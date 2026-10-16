"""Bearer auth: the shared token on HTTP and WebSockets, and OIDC tokens."""

import json
import os
import time

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("jwt")
pytest.importorskip("cryptography")
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from fastapi.testclient import TestClient
from jwt.algorithms import ECAlgorithm, RSAAlgorithm
from starlette.websockets import WebSocketDisconnect

from machinable.api.app import create_app
from machinable.api.auth import OIDCVerifier, parse_rules, rules_pass

ISSUER = "https://idp.example"
AUDIENCE = "machinable-api"
JWKS_URI = f"{ISSUER}/keys"
WS_PATHS = ["/v1/interfaces/ws", "/v1/executions/ws"]


@pytest.fixture(scope="module")
def keys():
    return {
        "rsa": rsa.generate_private_key(public_exponent=65537, key_size=2048),
        "ec": ec.generate_private_key(ec.SECP256R1()),
        "other": rsa.generate_private_key(public_exponent=65537, key_size=2048),
    }


def _jwk(kind, key, kid):
    algorithm = RSAAlgorithm if kind == "rsa" else ECAlgorithm
    entry = algorithm.to_jwk(key.public_key(), as_dict=True)
    entry.update(kid=kid, use="sig", alg="RS256" if kind == "rsa" else "ES256")
    return entry


class FakeIdP:
    """Discovery document and JWKS served from memory, counting fetches."""

    def __init__(self, keys):
        self.jwks = {
            "keys": [_jwk("rsa", keys["rsa"], "r1"), _jwk("ec", keys["ec"], "e1")]
        }
        self.fetches = 0
        self.down = False

    def __call__(self, url):
        if url == f"{ISSUER}/.well-known/openid-configuration":
            return {"issuer": ISSUER, "jwks_uri": JWKS_URI}
        assert url == JWKS_URI
        if self.down:
            raise OSError("unreachable")
        self.fetches += 1
        return json.loads(json.dumps(self.jwks))


@pytest.fixture()
def idp(keys):
    return FakeIdP(keys)


def token(keys, *, kind="rsa", kid="r1", alg=None, headers=None, **claims):
    now = int(time.time())
    payload = {
        "iss": ISSUER,
        "aud": AUDIENCE,
        "sub": "alice-id",
        "iat": now,
        "exp": now + 3600,
        **claims,
    }
    payload = {k: v for k, v in payload.items() if v is not None}
    alg = alg or ("RS256" if kind in ("rsa", "other") else "ES256")
    return jwt.encode(
        payload, keys[kind], algorithm=alg, headers={"kid": kid, **(headers or {})}
    )


def bearer(value):
    return {"Authorization": f"Bearer {value}"}


def _app(fetch, **kwargs):
    from machinable.project import Project

    kwargs.setdefault("oidc_issuer", ISSUER)
    kwargs.setdefault("oidc_audience", AUDIENCE)
    return create_app(project_dir=Project.get().path(), oidc_fetch=fetch, **kwargs)


def _verifier(fetch, **kwargs):
    kwargs.setdefault("refetch_interval", 60)
    return OIDCVerifier(ISSUER, AUDIENCE, fetch=fetch, **kwargs)


def _reason(verifier, value):
    from machinable.api.auth import AuthError

    with pytest.raises(AuthError) as raised:
        verifier.verify(value)
    return raised.value.reason


def _ws_ping(ws):
    ws.send_json({"type": "ping", "id": "p"})
    assert ws.receive_json()["type"] == "pong"


# ── step 1: the shared token covers WebSockets ─────────────────────────────────


@pytest.mark.parametrize("path", WS_PATHS)
def test_shared_token_guards_websockets(tmp_storage, path):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path(), api_token="secret")
    with TestClient(app) as client:
        with pytest.raises(WebSocketDisconnect):
            with client.websocket_connect(path) as ws:
                ws.receive_json()
        with pytest.raises(WebSocketDisconnect):
            with client.websocket_connect(path, headers=bearer("wrong")) as ws:
                ws.receive_json()
        with client.websocket_connect(path, headers=bearer("secret")) as ws:
            _ws_ping(ws)
        # browsers send the token as a subprotocol; the server echoes `bearer`
        with client.websocket_connect(path, subprotocols=["bearer", "secret"]) as ws:
            assert ws.accepted_subprotocol == "bearer"
            _ws_ping(ws)


def test_shared_token_http_refusal(tmp_storage):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path(), api_token="secret")
    with TestClient(app) as client:
        missing = client.get("/v1/health")
        assert missing.status_code == 401
        assert missing.headers["WWW-Authenticate"].startswith("Bearer")
        wrong = client.get("/v1/health", headers=bearer("nope"))
        assert wrong.status_code == 401
        assert 'error="invalid_token"' in wrong.headers["WWW-Authenticate"]
        assert "nope" not in wrong.text
        assert client.get("/openapi.json").status_code == 200
        # CORS preflights are answered without a token
        preflight = client.options(
            "/v1/health",
            headers={
                "Origin": "http://app.example",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "authorization",
            },
        )
        assert preflight.status_code == 200


# ── the verifier ────────────────────────────────────────────────────────────────


def test_valid_tokens_rsa_and_ec(keys, idp):
    verifier = _verifier(idp)
    principal = verifier.verify(token(keys))
    assert principal.identity == "alice-id" and principal.method == "oidc"
    assert principal.claims["aud"] == AUDIENCE
    assert verifier.verify(token(keys, kind="ec", kid="e1")).identity == "alice-id"
    # the identity claim is configurable
    other = _verifier(idp, identity_claim="email")
    assert other.verify(token(keys, email="a@lab.example")).identity == "a@lab.example"
    assert _reason(other, token(keys)) == "no identity"


def test_refusals(keys, idp):
    verifier = _verifier(idp)
    now = int(time.time())
    assert _reason(verifier, token(keys, exp=now - 120)) == "expired"
    # inside the leeway, an expired token still passes
    verifier.verify(token(keys, exp=now - 30))
    assert _reason(verifier, token(keys, nbf=now + 300)) == "not yet valid"
    assert _reason(verifier, token(keys, iat=now + 300)) == "not yet valid"
    assert _reason(verifier, token(keys, iss="https://evil.example")) == "wrong issuer"
    assert _reason(verifier, token(keys, aud="someone-else")) == "wrong audience"
    assert _reason(verifier, token(keys, aud=None)) == "wrong audience"
    # a token signed by a key the issuer does not publish, under a known kid
    assert _reason(verifier, token(keys, kind="other", kid="r1")) == "bad signature"
    # a key of the wrong type for the header's algorithm
    assert _reason(verifier, token(keys, kind="ec", kid="r1")) == (
        "algorithm not accepted"
    )
    assert _reason(verifier, "not-a-jwt") == "malformed"
    assert _reason(verifier, token(keys, exp=None)) == "invalid"


def test_multi_audience_azp(keys, idp):
    verifier = _verifier(idp)
    # Zitadel's shape: aud = [client id, project id], azp = client id, and the
    # server's audience is the project id
    verifier.verify(token(keys, aud=["client-id", AUDIENCE], azp="client-id"))
    verifier.verify(token(keys, aud=[AUDIENCE, "client"]))
    # with several audiences, azp must be one of the token's own
    assert _reason(verifier, token(keys, aud=[AUDIENCE, "x"], azp="z")) == (
        "wrong audience"
    )
    # azp never admits a token whose aud lacks our audience
    assert _reason(verifier, token(keys, aud=["x", "y"], azp=AUDIENCE)) == (
        "wrong audience"
    )
    assert _reason(verifier, token(keys, aud="x", azp=AUDIENCE)) == "wrong audience"


def test_alg_none_and_hmac_refused(keys, idp):
    verifier = _verifier(idp)
    now = int(time.time())
    claims = {"iss": ISSUER, "aud": AUDIENCE, "sub": "eve", "exp": now + 600}
    unsigned = jwt.encode(claims, None, algorithm="none", headers={"kid": "r1"})
    assert _reason(verifier, unsigned) == "algorithm not accepted"
    # HS256 "signed" with the issuer's public key, which anyone can fetch
    public_pem = (
        keys["rsa"]
        .public_key()
        .public_bytes(
            serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo
        )
    )
    import base64
    import hashlib
    import hmac

    def b64(data):
        return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

    signing_input = (
        b64(json.dumps({"alg": "HS256", "typ": "JWT", "kid": "r1"}).encode())
        + "."
        + b64(json.dumps(claims).encode())
    )
    signature = hmac.new(public_pem, signing_input.encode(), hashlib.sha256).digest()
    forged = f"{signing_input}.{b64(signature)}"
    assert _reason(verifier, forged) == "algorithm not accepted"
    # and HMAC cannot be configured in
    with pytest.raises(ValueError, match="HS256"):
        _verifier(idp, algorithms=["RS256", "HS256"])
    with pytest.raises(ValueError, match="none"):
        _verifier(idp, algorithms=["none"])


def test_unknown_kid_refetches_once(keys, idp):
    verifier = _verifier(idp, refetch_interval=0.5)
    verifier.verify(token(keys))
    assert idp.fetches == 1
    # a fetch was just made: an unknown kid waits for the interval
    assert _reason(verifier, token(keys, kind="other", kid="new")) == "unknown key"
    assert idp.fetches == 1
    time.sleep(0.6)
    # an unknown kid refetches once; a second one inside the interval does not
    assert _reason(verifier, token(keys, kind="other", kid="new")) == "unknown key"
    assert idp.fetches == 2
    assert _reason(verifier, token(keys, kind="other", kid="new")) == "unknown key"
    assert idp.fetches == 2


def test_key_rotation_and_failed_fetch(keys, idp):
    verifier = _verifier(idp, refetch_interval=0)
    verifier.verify(token(keys))
    # the issuer rotates in a new key: fetched again for its kid
    idp.jwks["keys"].append(_jwk("rsa", keys["other"], "r2"))
    assert verifier.verify(token(keys, kind="other", kid="r2")).identity == "alice-id"
    assert idp.fetches == 2
    # a failed fetch keeps the last good keys
    idp.down = True
    assert _reason(verifier, token(keys, kind="other", kid="r3")) == "unknown key"
    assert verifier.verify(token(keys)).identity == "alice-id"
    assert verifier.verify(token(keys, kind="other", kid="r2")).identity == "alice-id"


def test_discovery_must_name_the_issuer(keys):
    def fetch(url):
        return {"issuer": "https://other.example", "jwks_uri": JWKS_URI}

    verifier = _verifier(fetch)
    assert _reason(verifier, token(keys)) == "keys unavailable"


def test_missing_extra_error(monkeypatch):
    import builtins

    real_import = builtins.__import__

    def no_jwt(name, *args, **kwargs):
        if name == "jwt" or name.startswith("jwt."):
            raise ImportError("no jwt")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", no_jwt)
    with pytest.raises(ImportError, match=r"machinable\[oidc\]"):
        OIDCVerifier(ISSUER, AUDIENCE, fetch=lambda url: {})


def test_audience_is_required(idp):
    with pytest.raises(ValueError, match="oidc_audience"):
        OIDCVerifier(ISSUER, [], fetch=idp)


# ── rules ───────────────────────────────────────────────────────────────────────

TEAM = "https://aws.amazon.com/tags/principal_tags/team"
ROLES = "urn:zitadel:iam:org:project:roles"


def test_rules_language():
    claims = {
        "sub": "u1",
        TEAM: "311",
        "groups": ["lab", "staff"],
        ROLES: {"admin": {"org": "x"}},
        "level": 3,
    }

    def passes(rules):
        return rules_pass(parse_rules(rules), claims)

    assert passes([{"claim": TEAM, "equals": "311"}])
    assert not passes([{"claim": TEAM, "equals": 311}])
    assert passes([{"claim": "level", "in": [1, 2, 3]}])
    assert not passes([{"claim": "level", "in": ["3"]}])
    assert passes([{"claim": "groups", "contains": "lab"}])
    assert not passes([{"claim": "groups", "contains": "admin"}])
    assert passes([{"claim": ROLES, "contains": "admin"}])
    assert not passes([{"claim": ROLES, "contains": "member"}])
    assert not passes([{"claim": TEAM, "contains": "3"}])
    assert passes([{"claim": "sub", "present": True}])
    assert passes([{"claim": "email", "present": False}])
    assert not passes([{"claim": "email", "present": True}])
    assert not passes([{"claim": "email", "equals": "x"}])
    lab_rules = {
        "rules": [
            {"claim": TEAM, "equals": "311"},
            {
                "any_of": [
                    [{"claim": "sub", "equals": "owner"}],
                    [{"claim": ROLES, "contains": "admin"}],
                ]
            },
        ]
    }
    assert passes(lab_rules)
    assert not passes(
        [
            {
                "any_of": [
                    [{"claim": "sub", "equals": "owner"}],
                    [{"claim": "x", "present": True}],
                ]
            }
        ]
    )
    assert passes([])
    for broken in (
        {"claim": "sub", "equals": "x"},
        [{"claim": "sub"}],
        [{"claim": "sub", "equals": "x", "in": ["x"]}],
        [{"claim": "sub", "matches": "x"}],
        [{"claim": "sub", "in": "x"}],
        [{"any_of": {"claim": "sub", "equals": "x"}}],
        [{"claim": "sub", "present": "yes"}],
    ):
        with pytest.raises(ValueError):
            parse_rules(broken)


def test_rules_on_tokens(keys, idp):
    verifier = _verifier(idp, rules=[{"claim": TEAM, "equals": "311"}])
    verifier.verify(token(keys, **{TEAM: "311"}))
    assert _reason(verifier, token(keys, **{TEAM: "312"})) == "rules"
    assert _reason(verifier, token(keys)) == "rules"


def test_rules_file_reloads_and_fails_closed(keys, idp, tmp_path):
    rules_file = tmp_path / "rules.json"
    verifier = _verifier(idp, rules_file=str(rules_file))
    member = token(keys, **{TEAM: "311"})
    # missing file: everything refused
    assert _reason(verifier, member) == "rules"

    def write(content):
        rules_file.write_text(content)
        # distinct mtimes even on coarse clocks
        stamp = time.time_ns() + write.calls * 10**9
        write.calls += 1
        os.utime(rules_file, ns=(stamp, stamp))

    write.calls = 1
    write(json.dumps({"rules": [{"claim": TEAM, "equals": "311"}]}))
    assert verifier.verify(member).identity == "alice-id"
    write(json.dumps({"rules": [{"claim": "sub", "equals": "someone-else"}]}))
    assert _reason(verifier, member) == "rules"
    write("{ not json")
    assert _reason(verifier, member) == "rules"
    write(json.dumps({"rules": [{"claim": "sub", "nope": 1}]}))
    assert _reason(verifier, member) == "rules"
    write(json.dumps([{"claim": "sub", "equals": "alice-id"}]))
    assert verifier.verify(member).identity == "alice-id"
    rules_file.unlink()
    assert _reason(verifier, member) == "rules"


# ── the server ──────────────────────────────────────────────────────────────────


def _created_by(client, headers):
    items = client.get("/v1/interfaces", headers=headers).json()
    return {i["created_by"] for i in items if i["module"] == "basic"}


def test_oidc_http_admits_and_attributes(tmp_storage, keys, idp):
    with TestClient(_app(idp)) as client:
        auth = bearer(token(keys))
        assert client.get("/v1/health").status_code == 401
        refused = client.get("/v1/health", headers=bearer(token(keys, aud="x")))
        assert refused.status_code == 401
        assert refused.json()["reason"] == "wrong audience"
        assert 'error="invalid_token"' in refused.headers["WWW-Authenticate"]
        assert client.get("/v1/health", headers=auth).status_code == 200
        r = client.post(
            "/v1/interfaces/call",
            json={"target": "basic", "method": "hello", "version": [], "meta": {}},
            headers={**auth, "X-Machinable-User": "mallory"},
        )
        assert r.status_code == 200
        assert _created_by(client, auth) == {"alice-id"}


@pytest.mark.parametrize("path", WS_PATHS)
def test_oidc_websockets(tmp_storage, keys, idp, path):
    with TestClient(_app(idp)) as client:
        with pytest.raises(WebSocketDisconnect):
            with client.websocket_connect(path) as ws:
                ws.receive_json()
        with pytest.raises(WebSocketDisconnect):
            with client.websocket_connect(
                path, headers=bearer(token(keys, aud="x"))
            ) as ws:
                ws.receive_json()
        with client.websocket_connect(path, headers=bearer(token(keys))) as ws:
            _ws_ping(ws)
        with client.websocket_connect(path, subprotocols=["bearer", token(keys)]) as ws:
            assert ws.accepted_subprotocol == "bearer"
            _ws_ping(ws)


def test_oidc_websocket_attribution(tmp_storage, keys, idp):
    with TestClient(_app(idp)) as client:
        auth = bearer(token(keys))
        with client.websocket_connect(
            "/v1/interfaces/ws", headers={**auth, "X-Machinable-User": "mallory"}
        ) as ws:
            ws.send_json({"type": "connect", "target": "basic", "version": []})
            connected = ws.receive_json()
            assert connected["type"] == "connected"
            uuid = connected["payload"]["uuid"]
            ws.send_json({"type": "call", "id": "1", "method": "hello"})
            assert ws.receive_json()["payload"] == "there"
            info = client.get(f"/v1/interfaces/{uuid}", headers=auth).json()
            assert info["created_by"] == "alice-id"


def test_oidc_socket_closed_at_expiry(tmp_storage, keys, idp):
    with TestClient(_app(idp, oidc_leeway=0)) as client:
        short = token(keys, exp=int(time.time()) + 2)
        with client.websocket_connect("/v1/interfaces/ws", headers=bearer(short)) as ws:
            _ws_ping(ws)
            with pytest.raises(WebSocketDisconnect) as closed:
                ws.receive_json()
            assert closed.value.code == 4401


def test_shared_token_beside_oidc(tmp_storage, keys, idp):
    with TestClient(_app(idp, api_token="secret")) as client:
        assert client.get("/v1/health", headers=bearer("secret")).status_code == 200
        assert client.get("/v1/health", headers=bearer(token(keys))).status_code == 200
        assert client.get("/v1/health", headers=bearer("nope")).status_code == 401
        # a socket the shared token admits has no expiry
        with client.websocket_connect(
            "/v1/interfaces/ws", headers=bearer("secret")
        ) as ws:
            time.sleep(0.2)
            _ws_ping(ws)
        # and the shared token keeps the client-asserted attribution
        r = client.post(
            "/v1/interfaces/call",
            json={"target": "basic", "method": "hello", "version": [], "meta": {}},
            headers={**bearer("secret"), "X-Machinable-User": "operator"},
        )
        assert r.status_code == 200
        assert _created_by(client, bearer("secret")) == {"operator"}


def test_oidc_rules_file_on_the_server(tmp_storage, keys, idp, tmp_path):
    rules_file = tmp_path / "rules.json"
    rules_file.write_text(json.dumps([{"claim": "sub", "equals": "owner"}]))
    with TestClient(_app(idp, oidc_rules_file=str(rules_file))) as client:
        member = bearer(token(keys))
        refused = client.get("/v1/health", headers=member)
        assert refused.status_code == 401 and refused.json()["reason"] == "rules"
        # the owner shares the node: the next request sees the new rules
        rules_file.write_text(json.dumps([{"claim": "sub", "present": True}]))
        stamp = time.time_ns() + 10**9
        os.utime(rules_file, ns=(stamp, stamp))
        assert client.get("/v1/health", headers=member).status_code == 200


def test_server_passes_oidc_config(tmp_storage, idp, monkeypatch):
    from machinable.api import app as app_module
    from machinable.server import Server

    seen = {}
    real = app_module.create_app

    def spy(**kwargs):
        seen.update(kwargs)
        return real(**{**kwargs, "oidc_fetch": idp})

    monkeypatch.setattr(app_module, "create_app", spy)
    server = Server(
        {
            "oidc_issuer": ISSUER,
            "oidc_audience": [AUDIENCE, "other"],
            "oidc_rules": {"rules": [{"claim": "sub", "present": True}]},
        }
    )
    built = server._build_app()
    assert seen["oidc_audience"] == [AUDIENCE, "other"]
    assert seen["oidc_rules"] == {"rules": [{"claim": "sub", "present": True}]}
    assert built.state.oidc.audiences == [AUDIENCE, "other"]


# ── source writes, session tokens, CORS, workers ────────────────────────────────

SOURCE = "source-secret"


def test_source_write_with_oidc_and_a_source_token(tmp_storage, keys, idp):
    app = _app(idp, enable_source_api=True, source_token=SOURCE)
    with TestClient(app) as client:
        auth = bearer(token(keys))
        body = {"content": "x = 1\n"}
        # reads need only the server's auth
        assert client.get("/v1/source", headers=auth).status_code == 200
        assert client.get("/v1/source/basic.py", headers=auth).status_code == 200
        # writes also need the source token, in its own header
        assert client.put("/v1/source/s.py", json=body, headers=auth).status_code == 401
        wrong = {**auth, "X-Machinable-Source-Token": "nope"}
        assert (
            client.put("/v1/source/s.py", json=body, headers=wrong).status_code == 401
        )
        ok = {**auth, "X-Machinable-Source-Token": SOURCE}
        assert client.put("/v1/source/s.py", json=body, headers=ok).status_code in (
            200,
            201,
        )
        # the source token alone does not pass the server's auth
        alone = {"X-Machinable-Source-Token": SOURCE}
        assert (
            client.put("/v1/source/s.py", json=body, headers=alone).status_code == 401
        )


def test_source_write_with_api_token_and_a_source_token(tmp_storage):
    from machinable.project import Project

    app = create_app(
        project_dir=Project.get().path(),
        api_token="secret",
        enable_source_api=True,
        source_token=SOURCE,
    )
    with TestClient(app) as client:
        body = {"content": "x = 1\n"}
        auth = bearer("secret")
        assert client.put("/v1/source/s.py", json=body, headers=auth).status_code == 401
        ok = {**auth, "X-Machinable-Source-Token": SOURCE}
        assert client.put("/v1/source/s.py", json=body, headers=ok).status_code in (
            200,
            201,
        )


def test_session_tokens(tmp_storage, keys, idp):
    from machinable.api.auth import AuthError, SessionTokens

    with TestClient(_app(idp, api_token="secret")) as client:
        minted = client.post("/v1/auth/token", headers=bearer("secret"))
        assert minted.status_code == 200
        session = minted.json()["token"]
        assert minted.json()["expires_in"] == 3600
        assert client.get("/v1/health", headers=bearer(session)).status_code == 200
        with client.websocket_connect(
            "/v1/interfaces/ws", headers=bearer(session)
        ) as ws:
            _ws_ping(ws)
        # only the api_token mints: not a session token, not an OIDC caller
        assert client.post("/v1/auth/token", headers=bearer(session)).status_code == 403
        oidc = bearer(token(keys))
        assert client.post("/v1/auth/token", headers=oidc).status_code == 403
        # the lifetime is capped; a forged token is refused
        capped = client.post(
            "/v1/auth/token", headers=bearer("secret"), json={"ttl": 10**6}
        )
        assert capped.json()["expires_in"] == 3600
        forged = session[:-2] + ("AA" if not session.endswith("AA") else "BB")
        assert client.get("/v1/health", headers=bearer(forged)).status_code == 401

    tokens = SessionTokens()
    short, _ = tokens.mint(1)
    assert tokens.verify(short).method == "session"
    time.sleep(1.1)
    with pytest.raises(AuthError, match="expired"):
        tokens.verify(short)
    # tokens from another server process (another secret) are refused
    with pytest.raises(AuthError):
        SessionTokens().verify(tokens.mint()[0])


def test_no_session_tokens_without_api_token(tmp_storage, keys, idp):
    with TestClient(_app(idp)) as client:
        response = client.post("/v1/auth/token", headers=bearer(token(keys)))
        assert response.status_code == 404


def test_cors_default_has_no_credentials(tmp_storage):
    from machinable.project import Project

    origin = {"Origin": "http://app.example"}
    with TestClient(create_app(project_dir=Project.get().path())) as client:
        response = client.get("/v1/health", headers=origin)
        assert response.headers["access-control-allow-origin"] == "*"
        assert "access-control-allow-credentials" not in response.headers
    listed = create_app(
        project_dir=Project.get().path(), allow_origins=["http://app.example"]
    )
    with TestClient(listed) as client:
        response = client.get("/v1/health", headers=origin)
        assert response.headers["access-control-allow-origin"] == "http://app.example"
        assert response.headers["access-control-allow-credentials"] == "true"
