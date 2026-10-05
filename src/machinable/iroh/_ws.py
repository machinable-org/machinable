"""Shared RFC6455 frame demux for the iroh WebSocket client and native server.

Both sides drive a ``websockets`` sans-io protocol (``ClientProtocol`` /
``ServerProtocol``) over an iroh stream and need the identical handling of
incoming events: auto-reply to PING, ignore PONG, surface CLOSE, reassemble
continuation frames, and deliver TEXT as ``str`` / BINARY as ``bytes``. Keeping
it here means a protocol tweak is fixed once, on both ends.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from websockets.frames import Frame, Opcode


def ws_message(opcode: Opcode | None, data: bytes) -> str | bytes:
    """Decode a completed message: ``str`` for TEXT, ``bytes`` otherwise."""
    return data.decode() if opcode is Opcode.TEXT else bytes(data)


class WSFrameDecoder:
    """Reassembles messages from sans-io frame events, with fragment state.

    ``proto`` is the ``ClientProtocol``/``ServerProtocol`` used to auto-reply to
    PING frames (the caller flushes ``proto.data_to_send()`` afterward).
    """

    def __init__(self, proto: Any) -> None:
        self._proto = proto
        self._fragments: list[bytes] = []
        self._fragment_op: Opcode | None = None

    def decode(
        self,
        event: object,
        *,
        on_message: Callable[[str | bytes], None],
        on_close: Callable[[int], None],
    ) -> None:
        """Process one received event, invoking the message/close callbacks.

        Non-frame events (e.g. the handshake ``Response``) are ignored.
        """
        if not isinstance(event, Frame):
            return
        opcode = event.opcode
        if opcode is Opcode.PING:
            self._proto.send_pong(event.data)
        elif opcode is Opcode.PONG:
            return
        elif opcode is Opcode.CLOSE:
            on_close(self._proto.close_code or 1005)
        elif opcode is Opcode.CONT:
            self._fragments.append(bytes(event.data))
            if event.fin:
                on_message(ws_message(self._fragment_op, b"".join(self._fragments)))
                self._fragments, self._fragment_op = [], None
        elif event.fin:
            on_message(ws_message(opcode, bytes(event.data)))
        else:
            self._fragments = [bytes(event.data)]
            self._fragment_op = opcode
