"""Binary chunk upload/download helpers for the WebSocket API."""

from __future__ import annotations

import asyncio
import inspect
import os
from collections.abc import Awaitable, Callable, Iterable
from typing import Any, BinaryIO, Literal, cast

from machinable.interface import Interface
from machinable.utils import safe_path

ChunkMode = Literal["write", "append"]

_READ_DONE = object()


def _safe_next(iterator: Any) -> Any:
    return next(iterator, _READ_DONE)


async def stream_interface_read(
    interface: Interface,
    params: dict[str, Any],
    send_bytes: Callable[[bytes], Awaitable[None]],
) -> int:
    """Invoke the interface's ``read(params)`` hook and stream bytes back.

    ``params`` is opaque to machinable and handed to the interface verbatim.
    The hook may return ``bytes`` or yield a sequence of ``bytes`` (sync or async
    iterator) for bounded, flow-controlled streaming. Raises ``AttributeError``
    when the interface implements no ``read`` hook; ``read`` may raise
    ``machinable.errors.NotFound`` (or ``FileNotFoundError``) for missing data.
    Returns the total number of bytes sent.
    """
    fn = getattr(interface, "read", None)
    if fn is None or not callable(fn):
        raise AttributeError("Interface does not support 'read'")

    if inspect.iscoroutinefunction(fn):
        result = await fn(params)
    elif inspect.isasyncgenfunction(fn):
        result = fn(params)
    else:
        result = await asyncio.to_thread(fn, params)

    sent = 0
    if isinstance(result, bytes | bytearray | memoryview):
        data = bytes(result)
        if data:
            await send_bytes(data)
        return len(data)

    if inspect.isasyncgen(result):
        async for chunk in result:
            data = bytes(cast(Any, chunk))
            await send_bytes(data)
            sent += len(data)
        return sent

    if hasattr(result, "__iter__"):
        iterator = iter(cast("Iterable[Any]", result))
        while True:
            # advance the (possibly blocking) iterator off the event loop
            chunk = await asyncio.to_thread(_safe_next, iterator)
            if chunk is _READ_DONE:
                break
            data = bytes(chunk)
            await send_bytes(data)
            sent += len(data)
        return sent

    raise TypeError("Interface read() must return bytes or an iterator of bytes")


def resolve_interface_write_path(interface: Interface, path: str) -> str:
    """Resolve a safe absolute write path under the interface directory.

    Confined via the shared symlink-safe :func:`machinable.utils.safe_path`.
    """
    return safe_path(interface.local_directory(), path)


class ChunkUpload:
    """Open chunk upload session writing to one path on an Interface."""

    def __init__(
        self,
        interface: Interface,
        chunk_id: str,
        path: str,
        *,
        mode: ChunkMode = "write",
    ) -> None:
        self.chunk_id = chunk_id
        self.path = path.replace("\\", "/").strip("/")
        self.mode = mode
        self.bytes_written = 0
        self._full_path = resolve_interface_write_path(interface, self.path)
        self._handle: BinaryIO | None = None

    def open(self) -> None:
        parent = os.path.dirname(self._full_path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        file_mode = "ab" if self.mode == "append" else "wb"
        self._handle = open(self._full_path, file_mode)

    def write(self, data: bytes) -> None:
        if self._handle is None:
            raise RuntimeError("Chunk upload is not open")
        self._handle.write(data)
        self.bytes_written += len(data)

    def finish(self) -> dict[str, object]:
        self.close()
        return {
            "path": self.path,
            "bytes_written": self.bytes_written,
            "mode": self.mode,
        }

    def close(self) -> None:
        if self._handle is not None:
            self._handle.close()
            self._handle = None

    def abort(self) -> None:
        self.close()
