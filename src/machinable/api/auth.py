from __future__ import annotations

import asyncio
import base64
import contextlib
import hashlib
import hmac
import json
import logging
import os
import secrets
import threading
import time
import urllib.request
from collections.abc import Callable, Mapping
from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Any, Literal

logger = logging.getLogger("machinable.api.auth")

DEFAULT_ALGORITHMS = ("RS256", "ES256", "EdDSA")
_ASYMMETRIC_ALGORITHMS = {
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES256K",
    "ES384",
    "ES512",
    "EdDSA",
}
WS_TOKEN_EXPIRED = 4401
_RULE_TESTS = ("equals", "in", "contains", "present")

Fetch = Callable[[str], Any]


@dataclass(frozen=True)
class Principal:
    identity: str
    method: Literal["token", "session", "oidc"]
    claims: Mapping[str, Any] = field(default_factory=dict)
    expires_at: float | None = None


class AuthError(Exception):
    def __init__(self, reason: str, *, detail: str | None = None) -> None:
        super().__init__(reason)
        self.reason = reason
        self.detail = detail or reason


def request_principal(request: Any) -> Principal | None:
    scope = getattr(request, "scope", None) or {}
    state = scope.get("state") or {}
    principal = state.get("principal")
    return principal if isinstance(principal, Principal) else None


def _same(a: Any, b: Any) -> bool:
    # strict: `true` does not equal `1`, and "311" does not equal 311
    return type(a) is type(b) and a == b


def _check_rule_set(rules: Any, where: str) -> list[dict]:
    if not isinstance(rules, list):
        raise ValueError(f"{where}: a rule set must be a list of rules")
    for i, rule in enumerate(rules):
        _check_rule(rule, f"{where}[{i}]")
    return rules


def _check_rule(rule: Any, where: str) -> None:
    if not isinstance(rule, dict):
        raise ValueError(f"{where}: a rule must be an object")
    if "any_of" in rule:
        if set(rule) != {"any_of"} or not isinstance(rule["any_of"], list):
            raise ValueError(f"{where}: any_of takes a list of rule sets, alone")
        for j, rule_set in enumerate(rule["any_of"]):
            _check_rule_set(rule_set, f"{where}.any_of[{j}]")
        return
    claim = rule.get("claim")
    if not isinstance(claim, str) or not claim:
        raise ValueError(f"{where}: a rule names a claim")
    tests = [t for t in _RULE_TESTS if t in rule]
    if len(tests) != 1 or set(rule) != {"claim", tests[0]}:
        raise ValueError(
            f"{where}: a rule has exactly one test of {', '.join(_RULE_TESTS)}"
        )
    if "in" in rule and not isinstance(rule["in"], list):
        raise ValueError(f"{where}: `in` takes a list")
    if "present" in rule and not isinstance(rule["present"], bool):
        raise ValueError(f"{where}: `present` takes true or false")


def parse_rules(spec: Any) -> list[dict]:
    """Validate a rule set: a list of rules, or ``{"rules": [...]}``."""
    if isinstance(spec, dict) and set(spec) == {"rules"}:
        spec = spec["rules"]
    return _check_rule_set(spec, "rules")


def _rule_passes(rule: dict, claims: Mapping[str, Any]) -> bool:
    if "any_of" in rule:
        return any(rules_pass(rule_set, claims) for rule_set in rule["any_of"])
    name = rule["claim"]
    if "present" in rule:
        return (name in claims) == rule["present"]
    if name not in claims:
        return False
    value = claims[name]
    if "equals" in rule:
        return _same(value, rule["equals"])
    if "in" in rule:
        return any(_same(value, v) for v in rule["in"])
    expected = rule["contains"]
    if isinstance(value, list):
        return any(_same(item, expected) for item in value)
    if isinstance(value, dict):
        return isinstance(expected, str) and expected in value
    return False


def rules_pass(rules: list[dict], claims: Mapping[str, Any]) -> bool:
    return all(_rule_passes(rule, claims) for rule in rules)


class RulesFile:
    """A JSON rules file, re-read when it changes; fails closed.

    A missing or invalid file yields ``None`` (refuse every token); the reason
    is logged once per change of the file.
    """

    def __init__(self, path: str) -> None:
        self.path = os.path.abspath(os.path.expanduser(path))
        self._lock = threading.Lock()
        self._stamp: tuple | None = None
        self._rules: list[dict] | None = None

    def _current_stamp(self) -> tuple | None:
        try:
            st = os.stat(self.path)
        except OSError:
            return None
        return (st.st_ino, st.st_mtime_ns, st.st_size)

    def get(self) -> list[dict] | None:
        stamp = self._current_stamp()
        with self._lock:
            if stamp is not None and stamp == self._stamp:
                return self._rules
            if stamp is None:
                if self._stamp != ("missing",):
                    logger.error("OIDC rules file %s is missing", self.path)
                self._stamp, self._rules = ("missing",), None
                return None
            try:
                with open(self.path, encoding="utf-8") as f:
                    rules = parse_rules(json.load(f))
            except (OSError, ValueError) as ex:
                logger.error("OIDC rules file %s is invalid: %s", self.path, ex)
                rules = None
            self._stamp, self._rules = stamp, rules
            return rules


def _require_jwt():
    try:
        import jwt
        from jwt.algorithms import has_crypto
    except ImportError as ex:
        raise ImportError(
            "Verifying OIDC tokens (oidc_issuer) requires PyJWT. "
            "Install with: pip install 'machinable[oidc]'"
        ) from ex
    if not has_crypto:
        raise ImportError(
            "Verifying OIDC tokens (oidc_issuer) requires PyJWT with "
            "cryptography. Install with: pip install 'machinable[oidc]'"
        )
    return jwt


def fetch_json(url: str, timeout: float = 10.0) -> Any:
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:  # noqa: S310
        return json.loads(response.read())


class OIDCVerifier:
    """Verifies JWT access tokens from one OpenID Connect issuer."""

    def __init__(
        self,
        issuer: str,
        audience: str | list[str],
        *,
        rules: Any = None,
        rules_file: str | None = None,
        identity_claim: str = "sub",
        algorithms: list[str] | None = None,
        leeway: float = 60,
        fetch: Fetch | None = None,
        refetch_interval: float = 60,
    ) -> None:
        self._jwt = _require_jwt()
        if not issuer:
            raise ValueError("oidc_issuer is required")
        audiences = [audience] if isinstance(audience, str) else list(audience or [])
        if not audiences or not all(isinstance(a, str) and a for a in audiences):
            raise ValueError("oidc_audience is required when oidc_issuer is set")
        algorithms = list(algorithms or DEFAULT_ALGORITHMS)
        refused = [a for a in algorithms if a not in _ASYMMETRIC_ALGORITHMS]
        if refused:
            raise ValueError(
                f"oidc_algorithms: {', '.join(refused)} not accepted; only "
                "asymmetric signatures are (never `none` or HMAC)"
            )
        self.issuer = issuer
        self.audiences = audiences
        self.rules = parse_rules(rules) if rules is not None else None
        self.rules_file = RulesFile(rules_file) if rules_file else None
        self.identity_claim = identity_claim or "sub"
        self.algorithms = algorithms
        self.leeway = float(leeway)
        self.refetch_interval = refetch_interval
        self._fetch: Fetch = fetch or fetch_json
        self._lock = threading.Lock()
        self._jwks_uri: str | None = None
        self._keys: dict[str | None, Any] | None = None
        self._last_fetch: float | None = None

    # keys

    def _discover(self) -> str:
        if self._jwks_uri is None:
            url = self.issuer.rstrip("/") + "/.well-known/openid-configuration"
            document = self._fetch(url)
            if document.get("issuer") != self.issuer:
                raise ValueError(
                    f"discovery names issuer {document.get('issuer')!r}, "
                    f"not {self.issuer!r}"
                )
            jwks_uri = document.get("jwks_uri")
            if not isinstance(jwks_uri, str) or not jwks_uri:
                raise ValueError("discovery document has no jwks_uri")
            self._jwks_uri = jwks_uri
        return self._jwks_uri

    def _load_keys(self) -> dict[str | None, Any]:
        jwks = self._fetch(self._discover())
        keys: dict[str | None, Any] = {}
        for entry in jwks.get("keys") or []:
            if not isinstance(entry, dict) or entry.get("use", "sig") != "sig":
                continue
            try:
                key = self._jwt.PyJWK(entry)
            except Exception:  # noqa: BLE001 - unusable keys are skipped
                continue
            keys[entry.get("kid")] = (key, entry.get("alg"))
        if not keys:
            raise ValueError("the JWKS holds no usable signing keys")
        return keys

    def refresh_keys(self, *, force: bool = False) -> bool:
        """Fetch the keys unless fetched within ``refetch_interval``.

        Returns whether a fetch succeeded; on failure the last good keys stay.
        """
        with self._lock:
            now = time.monotonic()
            if (
                not force
                and self._last_fetch is not None
                and now - self._last_fetch < self.refetch_interval
            ):
                return False
            self._last_fetch = now
            try:
                self._keys = self._load_keys()
            except Exception as ex:  # noqa: BLE001
                logger.warning("fetching keys from %s failed: %s", self.issuer, ex)
                return False
            return True

    def warm(self) -> None:
        """Fetch the keys once at start (errors are logged, not raised)."""
        if self._keys is None:
            self.refresh_keys()

    def _key_for(self, kid: str | None) -> Any:
        keys = self._keys
        if keys is None or (kid is not None and kid not in keys):
            self.refresh_keys()
            keys = self._keys
        if keys is None:
            raise AuthError("keys unavailable")
        if kid is None:
            # a token without kid is matched only against a single-key set
            if len(keys) == 1:
                return next(iter(keys.values()))
            raise AuthError("unknown key")
        if kid not in keys:
            raise AuthError("unknown key")
        return keys[kid]

    # tokens

    def _audience_ok(self, claims: Mapping[str, Any]) -> bool:
        aud = claims.get("aud")
        audiences = [aud] if isinstance(aud, str) else aud
        if not isinstance(audiences, list):
            return False
        if not any(a in self.audiences for a in audiences):
            return False
        # OIDC Core 3.1.3.7: with several audiences, an azp present must be one
        # of them; azp never admits a token whose aud lacks our audience
        azp = claims.get("azp")
        return len(audiences) < 2 or azp is None or azp in audiences

    def _rules_ok(self, claims: Mapping[str, Any]) -> bool:
        if self.rules is not None and not rules_pass(self.rules, claims):
            return False
        if self.rules_file is not None:
            rules = self.rules_file.get()
            if rules is None or not rules_pass(rules, claims):
                return False
        return True

    def verify(self, token: str) -> Principal:
        """Verify ``token``; the admitted principal, or :class:`AuthError`."""
        jwt = self._jwt
        try:
            header = jwt.get_unverified_header(token)
        except jwt.exceptions.PyJWTError as ex:
            raise AuthError("malformed") from ex
        alg = header.get("alg")
        if alg not in self.algorithms:
            raise AuthError("algorithm not accepted")
        kid = header.get("kid")
        key, key_alg = self._key_for(kid if isinstance(kid, str) else None)
        if key_alg is not None and key_alg != alg:
            raise AuthError("algorithm not accepted")
        try:
            claims = jwt.decode(
                token,
                key.key,
                algorithms=[alg],
                issuer=self.issuer,
                leeway=self.leeway,
                options={"verify_aud": False, "require": ["exp", "iss"]},
            )
        except jwt.exceptions.ExpiredSignatureError as ex:
            raise AuthError("expired") from ex
        except jwt.exceptions.ImmatureSignatureError as ex:
            raise AuthError("not yet valid") from ex
        except jwt.exceptions.InvalidIssuerError as ex:
            raise AuthError("wrong issuer") from ex
        except jwt.exceptions.InvalidSignatureError as ex:
            raise AuthError("bad signature") from ex
        except jwt.exceptions.PyJWTError as ex:
            raise AuthError("invalid", detail=f"invalid: {ex}") from ex
        identity = claims.get(self.identity_claim)
        who = identity if isinstance(identity, str) else "?"
        iat = claims.get("iat")
        if isinstance(iat, int | float) and iat > time.time() + self.leeway:
            raise AuthError("not yet valid", detail=f"not yet valid: iat ({who})")
        if not self._audience_ok(claims):
            raise AuthError("wrong audience", detail=f"wrong audience ({who})")
        if not isinstance(identity, str) or not identity:
            raise AuthError("no identity", detail=f"no {self.identity_claim} claim")
        if not self._rules_ok(claims):
            raise AuthError("rules", detail=f"rules ({who})")
        return Principal(
            identity=identity,
            method="oidc",
            claims=MappingProxyType(dict(claims)),
            expires_at=float(claims["exp"]),
        )


SESSION_PREFIX = "mst1"
SESSION_MAX_TTL = 3600


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


class SessionTokens:
    """Short-lived bearer tokens minted for a holder of the shared ``api_token``."""

    def __init__(self) -> None:
        self._secret = secrets.token_bytes(32)

    def _sign(self, payload: str) -> str:
        mac = hmac.new(self._secret, payload.encode(), hashlib.sha256).digest()
        return _b64(mac)

    def mint(self, ttl: float = SESSION_MAX_TTL) -> tuple[str, int]:
        """A new token and its lifetime in seconds (capped)."""
        ttl = int(max(1, min(ttl, SESSION_MAX_TTL)))
        claims = {"exp": int(time.time()) + ttl, "n": secrets.token_hex(8)}
        payload = f"{SESSION_PREFIX}.{_b64(json.dumps(claims).encode())}"
        return f"{payload}.{self._sign(payload)}", ttl

    def verify(self, token: str) -> Principal | None:
        """The principal for a session token; ``None`` if it is not one.

        Raises :class:`AuthError` for a session token that is forged or expired.
        """
        if not token.startswith(SESSION_PREFIX + "."):
            return None
        payload, _, signature = token.rpartition(".")
        if not hmac.compare_digest(signature.encode(), self._sign(payload).encode()):
            raise AuthError("invalid token")
        try:
            claims = json.loads(_unb64(payload.split(".", 1)[1]))
            exp = float(claims["exp"])
        except (ValueError, KeyError, TypeError) as ex:
            raise AuthError("invalid token") from ex
        if exp <= time.time():
            raise AuthError("expired")
        return Principal(identity="api_token", method="session", expires_at=exp)


WORKER_SECRET_HEADER = "X-Machinable-Worker-Secret"
WORKER_SECRET_ENV = "MACHINABLE_WORKER_SECRET"


class WorkerSecretMiddleware:
    """Admit only the gateway: every scope must carry its per-worker secret."""

    def __init__(self, app, *, secret: str) -> None:
        self.app = app
        self._secret = secret.encode()

    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] not in ("http", "websocket"):
            await self.app(scope, receive, send)
            return
        given = _headers(scope).get(WORKER_SECRET_HEADER.lower(), "")
        if hmac.compare_digest(given.encode(), self._secret):
            await self.app(scope, receive, send)
            return
        if scope["type"] == "websocket":
            if (await receive())["type"] == "websocket.connect":
                await send({"type": "websocket.close", "code": 1008})
            return
        body = b'{"detail": "Unauthorized"}'
        await send(
            {
                "type": "http.response.start",
                "status": 401,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode()),
                ],
            }
        )
        await send({"type": "http.response.body", "body": body})


def _headers(scope: dict) -> dict[str, str]:
    out: dict[str, str] = {}
    for name, value in scope.get("headers") or []:
        out.setdefault(name.decode("latin-1").lower(), value.decode("latin-1"))
    return out


def _bearer(value: str | None) -> str | None:
    if not value:
        return None
    scheme, _, token = value.strip().partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None
    return token.strip()


def _subprotocol_token(scope: dict) -> str | None:
    """``Sec-WebSocket-Protocol: bearer, <token>`` (browsers set no headers)."""
    protocols = list(scope.get("subprotocols") or [])
    if "bearer" in protocols:
        i = protocols.index("bearer")
        if i + 1 < len(protocols):
            return protocols[i + 1]
    return None


class _ExpiringSocket:
    """Closes a WebSocket with 4401 when its token's ``exp`` passes."""

    def __init__(self, receive, send, expires_at: float, echo: str | None) -> None:
        self._receive = receive
        self._send = send
        self._expires_at = expires_at
        self._echo = echo
        self._lock = asyncio.Lock()
        self._expired = asyncio.Event()
        self._closed = False
        self._accepted = False
        self._pending: asyncio.Future | None = None
        self._expired_wait: asyncio.Future | None = None

    async def send(self, message: dict) -> None:
        async with self._lock:
            if self._closed:
                return
            if message["type"] == "websocket.accept":
                self._accepted = True
                if self._echo and not message.get("subprotocol"):
                    message = {**message, "subprotocol": self._echo}
            elif message["type"] == "websocket.close":
                self._closed = True
            await self._send(message)

    async def receive(self) -> dict:
        if self._pending is None:
            self._pending = asyncio.ensure_future(self._receive())
        if self._expired_wait is None:
            self._expired_wait = asyncio.ensure_future(self._expired.wait())
        await asyncio.wait(
            {self._pending, self._expired_wait},
            return_when=asyncio.FIRST_COMPLETED,
        )
        if self._pending.done():
            pending, self._pending = self._pending, None
            return pending.result()
        return {"type": "websocket.disconnect", "code": WS_TOKEN_EXPIRED}

    async def watch(self) -> None:
        await asyncio.sleep(max(0.0, self._expires_at - time.time()))
        async with self._lock:
            if not self._closed:
                self._closed = True
                await self._send(
                    {
                        "type": "websocket.close",
                        "code": WS_TOKEN_EXPIRED if self._accepted else 1008,
                        "reason": "token expired",
                    }
                )
        self._expired.set()

    def cancel(self) -> None:
        for future in (self._pending, self._expired_wait):
            if future is not None and not future.done():
                future.cancel()


class AuthMiddleware:
    """Admit ``http`` and ``websocket`` scopes by bearer token."""

    def __init__(
        self,
        app,
        *,
        api_token: str | None = None,
        verifier: OIDCVerifier | None = None,
        sessions: SessionTokens | None = None,
        public_paths: set[str] | frozenset[str] = frozenset(),
    ) -> None:
        self.app = app
        self.api_token = api_token
        self.verifier = verifier
        self.sessions = sessions
        self.public_paths = set(public_paths)

    async def _admit(self, token: str | None) -> Principal:
        if token is None:
            raise AuthError("missing token")
        if self.api_token and hmac.compare_digest(
            token.encode(), self.api_token.encode()
        ):
            return Principal(identity="api_token", method="token")
        if self.sessions is not None:
            principal = self.sessions.verify(token)
            if principal is not None:
                return principal
        if self.verifier is None:
            raise AuthError("invalid token")
        # off the event loop: a key refetch or rules-file read may block
        return await asyncio.to_thread(self.verifier.verify, token)

    async def __call__(self, scope, receive, send) -> None:
        kind = scope["type"]
        if kind not in ("http", "websocket"):
            await self.app(scope, receive, send)
            return
        if kind == "http" and scope.get("path") in self.public_paths:
            await self.app(scope, receive, send)
            return

        headers = _headers(scope)
        token = _bearer(headers.get("authorization"))
        echo = None
        if token is None and kind == "websocket":
            token = _subprotocol_token(scope)
            if token is not None:
                echo = "bearer"
                # keep the token out of what the app sees as subprotocols
                scope = {
                    **scope,
                    "subprotocols": [
                        p for p in scope.get("subprotocols") or [] if p != token
                    ],
                }

        try:
            principal = await self._admit(token)
        except AuthError as ex:
            path = scope.get("path")
            if ex.reason == "missing token":
                logger.debug("refused %s %s: %s", kind, path, ex.detail)
            else:
                logger.warning("refused %s %s: %s", kind, path, ex.detail)
            await self._refuse(kind, ex.reason, receive, send)
            return

        state: dict = dict(scope.get("state") or {})
        state["principal"] = principal
        scope = {**scope, "state": state}
        if kind == "http":
            await self.app(scope, receive, send)
            return

        if principal.expires_at is None:
            if echo is None:
                await self.app(scope, receive, send)
                return
            await self.app(scope, receive, _echo_subprotocol(send, echo))
            return

        socket = _ExpiringSocket(receive, send, principal.expires_at, echo)
        watcher = asyncio.ensure_future(socket.watch())
        try:
            await self.app(scope, socket.receive, socket.send)
        finally:
            watcher.cancel()
            socket.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await watcher

    async def _refuse(self, kind: str, reason: str, receive, send) -> None:
        if kind == "websocket":
            message = await receive()
            if message["type"] == "websocket.connect":
                await send({"type": "websocket.close", "code": 1008})
            return
        if reason == "missing token":
            # RFC 6750 3.1: no error code when the request had no credentials
            challenge = 'Bearer realm="machinable"'
        else:
            challenge = f'Bearer error="invalid_token", error_description="{reason}"'
        body = json.dumps({"detail": "Unauthorized", "reason": reason}).encode()
        await send(
            {
                "type": "http.response.start",
                "status": 401,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode()),
                    (b"www-authenticate", challenge.encode()),
                ],
            }
        )
        await send({"type": "http.response.body", "body": body})


def _echo_subprotocol(send, echo: str):
    async def wrapped(message: dict) -> None:
        if message["type"] == "websocket.accept" and not message.get("subprotocol"):
            message = {**message, "subprotocol": echo}
        await send(message)

    return wrapped
