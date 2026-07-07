"""Source routes (``/v1/source``).

Lets a client read, write, create, rename, and delete the project's interface
source files, enough to build a code editor. Reading is inspection and is
served by default; the WRITE routes are gated behind ``enable_source_api`` and
a token (writing ``.py`` files is remote code execution). Every path is
confined to the project ``BASE_DIR``.
"""

from __future__ import annotations

import os

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from machinable.api._helpers import log_event as _log_event
from machinable.api._helpers import project_context
from machinable.api.models import (
    SourceFileContent,
    SourceListResponse,
    SourceMoveRequest,
    SourceWriteRequest,
    SourceWriteResponse,
)
from machinable.api.source import (
    compute_etag,
    etag_matches,
    file_to_module,
    invalidate_source,
    list_source_files,
    quote_etag,
    require_source_write,
    safe_resolve,
    source_base_dir,
    source_extensions,
    validate_extension,
)

router = APIRouter(
    prefix="/v1/source",
    tags=["source"],
    dependencies=[Depends(project_context)],
)
# writes are RCE: opt-in + token, per route (reads stay inspection-open)
_write_guard = [Depends(require_source_write)]


@router.get("", response_model=SourceListResponse)
def list_source(request: Request) -> SourceListResponse:
    """List the editable source files under the project base directory."""
    base = source_base_dir(request)
    return SourceListResponse(
        base_dir=base, files=list_source_files(base, source_extensions(request))
    )


@router.get("/{path:path}", response_model=SourceFileContent)
async def read_source(
    path: str, request: Request, response: Response
) -> SourceFileContent:
    """Read a file's content; the strong ETag (MD5) is also a response header."""
    base = source_base_dir(request)
    allowed = source_extensions(request)
    validate_extension(path, allowed)
    full = safe_resolve(base, path)
    if not os.path.isfile(full):
        raise HTTPException(status_code=404, detail="File not found")
    async with aiofiles.open(full, "rb") as handle:
        data = await handle.read()
    etag = compute_etag(data)
    response.headers["ETag"] = quote_etag(etag)
    return SourceFileContent(
        path=path.replace("\\", "/").strip("/"),
        module=file_to_module(path),
        content=data.decode("utf-8"),
        etag=etag,
        size=len(data),
    )


@router.put(
    "/{path:path}", response_model=SourceWriteResponse, dependencies=_write_guard
)
async def write_source(
    path: str,
    body: SourceWriteRequest,
    request: Request,
    response: Response,
) -> SourceWriteResponse:
    """Create or fully overwrite a file.

    Conditional writes: ``If-Match: "<etag>"`` (or ``*``) returns 412 on a stale
    ETag; ``If-None-Match: *`` returns 412 if the file already exists
    (create-only). Editing invalidates caches made stale by the change.
    """
    base = source_base_dir(request)
    allowed = source_extensions(request)
    validate_extension(path, allowed)
    full = safe_resolve(base, path)

    exists = os.path.isfile(full)
    current: str | None = None
    if exists:
        async with aiofiles.open(full, "rb") as handle:
            current = compute_etag(await handle.read())

    if request.headers.get("If-None-Match", "").strip() == "*" and exists:
        raise HTTPException(status_code=412, detail="File already exists")
    if not etag_matches(request.headers.get("If-Match"), current, exists=exists):
        raise HTTPException(status_code=412, detail="ETag precondition failed")

    data = body.content.encode("utf-8")
    os.makedirs(os.path.dirname(full) or base, exist_ok=True)
    async with aiofiles.open(full, "wb") as handle:
        await handle.write(data)

    invalidate_source(request, path)
    etag = compute_etag(data)
    response.headers["ETag"] = quote_etag(etag)
    response.status_code = 200 if exists else 201
    _log_event(request, f"{'PUT' if exists else 'CREATE'} /v1/source/{path}")
    return SourceWriteResponse(
        path=path.replace("\\", "/").strip("/"),
        module=file_to_module(path),
        etag=etag,
        created=not exists,
    )


@router.delete("/{path:path}", status_code=204, dependencies=_write_guard)
def delete_source(path: str, request: Request) -> Response:
    """Delete a source file and invalidate caches made stale by its removal."""
    base = source_base_dir(request)
    validate_extension(path, source_extensions(request))
    full = safe_resolve(base, path)
    if not os.path.isfile(full):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(full)
    invalidate_source(request, path)
    _log_event(request, f"DELETE /v1/source/{path}")
    return Response(status_code=204)


@router.post("/move", response_model=SourceWriteResponse, dependencies=_write_guard)
def move_source(body: SourceMoveRequest, request: Request) -> SourceWriteResponse:
    """Atomically rename/move a file within the base directory.

    Handles interface renames, including converting a single-file module to a
    package layout (``foo.py`` → ``foo/__init__.py``) and back.
    """
    base = source_base_dir(request)
    allowed = source_extensions(request)
    validate_extension(body.from_path, allowed)
    validate_extension(body.to, allowed)
    src = safe_resolve(base, body.from_path)
    dst = safe_resolve(base, body.to)
    if not os.path.isfile(src):
        raise HTTPException(status_code=404, detail="Source file not found")
    if os.path.exists(dst):
        raise HTTPException(status_code=409, detail="Destination already exists")

    os.makedirs(os.path.dirname(dst) or base, exist_ok=True)
    os.rename(src, dst)
    invalidate_source(request, body.from_path)
    invalidate_source(request, body.to)
    _log_event(request, f"MOVE /v1/source {body.from_path} -> {body.to}")

    with open(dst, "rb") as handle:
        etag = compute_etag(handle.read())
    return SourceWriteResponse(
        path=body.to.replace("\\", "/").strip("/"),
        module=file_to_module(body.to),
        etag=etag,
        created=False,
    )
