"""Helpers for the source-editing API (``/v1/source``).

Writing ``.py`` files that machinable later imports is a remote-code-execution
surface, so this module is deliberately conservative: every path is confined to
a ``BASE_DIR`` via ``realpath`` (symlink-safe), extensions are whitelisted, and
the routes require an explicit opt-in plus a token (see ``require_source_auth``).
"""

from __future__ import annotations

import hashlib
import importlib
import os
import sys

from fastapi import HTTPException, Request

from machinable.api._helpers import request_project_dir
from machinable.api.models import SourceFile
from machinable.utils import file_to_module, safe_path, skip_source_dir


def require_source_auth(request: Request) -> None:
    """FastAPI dependency guarding the source API.

    Secure by default: the API must be explicitly enabled *and* a token must be
    configured; a missing/invalid bearer token yields 401.
    """
    state = request.app.state
    if not getattr(state, "enable_source_api", False):
        raise HTTPException(status_code=403, detail="Source editing API is disabled")
    token = getattr(state, "source_token", None) or getattr(state, "api_token", None)
    if not token:
        raise HTTPException(
            status_code=403,
            detail="Source editing API requires a configured token",
        )
    if request.headers.get("Authorization", "") != f"Bearer {token}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def source_extensions(request: Request) -> set[str]:
    exts = getattr(request.app.state, "source_extensions", None) or [".py"]
    return {e.lower() for e in exts}


def source_base_dir(request: Request) -> str:
    """Absolute, symlink-resolved base directory the source API is confined to.

    Defaults to the request's resolved project directory (already validated
    against ``project_roots``); overridable by a server-pinned base.
    """
    override = getattr(request.app.state, "source_base_dir", None)
    base = override or request_project_dir(request)
    return os.path.realpath(os.path.expanduser(base))


def safe_resolve(base: str, rel: str) -> str:
    """Resolve ``rel`` under ``base`` or raise 400 if it escapes the base.

    Thin HTTP wrapper over the shared, symlink-safe :func:`machinable.utils.safe_path`.
    """
    try:
        return safe_path(base, rel)
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex)) from ex


def validate_extension(rel: str, allowed: set[str]) -> None:
    ext = os.path.splitext(rel)[1].lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext or '(none)'}' is not permitted",
        )


def compute_etag(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()  # noqa: S324 - content fingerprint, not security


def quote_etag(etag: str) -> str:
    return f'"{etag}"'


def etag_matches(header: str | None, current: str | None, *, exists: bool) -> bool:
    """Evaluate an ``If-Match`` header against the current ETag."""
    if header is None:
        return True
    candidates = {tok.strip().strip('"') for tok in header.split(",")}
    if "*" in candidates:
        return exists
    return current is not None and current in candidates


def list_source_files(base: str, allowed: set[str]) -> list[SourceFile]:
    files: list[SourceFile] = []
    for root, dirs, names in os.walk(base):
        dirs[:] = [d for d in dirs if not skip_source_dir(d)]
        for name in names:
            if os.path.splitext(name)[1].lower() not in allowed:
                continue
            full = os.path.join(root, name)
            rel = os.path.relpath(full, base).replace(os.sep, "/")
            try:
                st = os.stat(full)
            except OSError:
                continue
            files.append(
                SourceFile(
                    path=rel,
                    module=file_to_module(rel),
                    size=st.st_size,
                    mtime_ns=st.st_mtime_ns,
                )
            )
    files.sort(key=lambda f: f.path)
    return files


def _module_matches(instance_module: str | None, module: str) -> bool:
    if not instance_module or not module:
        return False
    return instance_module == module or instance_module.startswith(module + ".")


def invalidate_source(request: Request, rel: str) -> None:
    """Drop caches made stale by editing ``rel``.

    machinable's importer re-executes project ``.py`` files from disk on each
    import, so config/schema endpoints self-refresh. What does *not* self-heal
    and is cleared here: cached Interface instances built from the old class,
    and stale ``sys.modules`` class identities. Index rows are immutable
    (keyed by config hash) and intentionally untouched.
    """
    module = file_to_module(rel)
    if not module:
        return
    project = request_project_dir(request)

    caches = getattr(request.app.state, "interfaces", {})
    metas = getattr(request.app.state, "interface_meta", {})
    cache = caches.get(project, {})
    meta = metas.get(project, {})
    for uuid in [
        u
        for u, inst in list(cache.items())
        if _module_matches(getattr(inst, "module", None), module)
    ]:
        cache.pop(uuid, None)
        meta.pop(uuid, None)

    for name in [
        n for n in list(sys.modules) if n == module or n.startswith(module + ".")
    ]:
        sys.modules.pop(name, None)
    importlib.invalidate_caches()
