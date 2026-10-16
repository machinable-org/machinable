"""Short-lived session tokens for holders of the shared ``api_token``."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from machinable.api.auth import SESSION_MAX_TTL, request_principal

router = APIRouter(prefix="/v1/auth", tags=["auth"])


class SessionTokenRequest(BaseModel):
    ttl: int = SESSION_MAX_TTL


class SessionTokenResponse(BaseModel):
    token: str
    expires_in: int


@router.post("/token", response_model=SessionTokenResponse)
def mint_session_token(
    request: Request, body: SessionTokenRequest | None = None
) -> SessionTokenResponse:
    """Mint a short-lived bearer token (at most an hour) from the ``api_token``.

    For clients that should not hold the long-lived token, such as the
    notebook widget. Only a request carrying the ``api_token`` itself may mint;
    a session token cannot extend itself, and an OIDC caller has its own
    short-lived token already.
    """
    sessions = getattr(request.app.state, "sessions", None)
    if sessions is None:
        raise HTTPException(status_code=404, detail="This server has no api_token")
    principal = request_principal(request)
    if principal is None or principal.method != "token":
        raise HTTPException(
            status_code=403, detail="Only the api_token can mint session tokens"
        )
    token, expires_in = sessions.mint((body or SessionTokenRequest()).ttl)
    return SessionTokenResponse(token=token, expires_in=expires_in)
