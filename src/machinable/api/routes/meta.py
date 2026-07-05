"""Self-description route: the WebSocket protocol + capability map.

OpenAPI describes the REST surface; this endpoint covers the parts it cannot:
the WebSocket frame protocol and the interface hooks a project implements, in a
machine-readable form so coding agents can discover the full contract.
"""

from __future__ import annotations

from fastapi import APIRouter

from machinable.api.protocol import ProtocolDoc, build_protocol

router = APIRouter(prefix="/v1/protocol", tags=["meta"])


@router.get(
    "",
    response_model=ProtocolDoc,
    summary="Describe the WebSocket protocol and capability map",
)
def protocol() -> ProtocolDoc:
    """Return the non-OpenAPI half of the contract.

    Includes every WebSocket frame type, the binary upload/read sequences, the
    interface hooks a project implements (``read``, ``emit``, callable methods),
    cross-cutting request headers, and the capability map.
    """
    return build_protocol()
