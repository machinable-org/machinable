import pytest

pytest.importorskip("iroh")

from machinable.iroh.allowlist import Allowlist, PairingPolicy  # noqa: E402
from machinable.iroh.identity import load_identity  # noqa: E402


def test_identity_creates_and_persists_key(tmp_path):
    key_path = tmp_path / "secret.key"
    identity = load_identity(key_path)

    assert key_path.is_file()
    # a 64-char hex endpoint id (the address handed to clients)
    assert len(identity.endpoint_id) == 64
    assert int(identity.endpoint_id, 16) >= 0
    assert identity.short_id and identity.endpoint_id.startswith(identity.short_id)


def test_identity_is_stable_across_loads(tmp_path):
    key_path = tmp_path / "secret.key"
    first = load_identity(key_path)
    second = load_identity(key_path)
    assert first.endpoint_id == second.endpoint_id


def test_identity_rejects_malformed_key(tmp_path):
    key_path = tmp_path / "secret.key"
    key_path.write_bytes(b"too short")
    with pytest.raises(ValueError, match="not a valid iroh secret key"):
        load_identity(key_path)


# ── allowlist ──────────────────────────────────────────────────────────────

# a syntactically valid endpoint id is 64 hex chars
PEER_A = "a" * 64
PEER_B = "b" * 64


def test_allowlist_add_contains_remove_roundtrip(tmp_path):
    path = tmp_path / "allowlist.json"
    allow = Allowlist.load(path)
    assert allow.ids() == []

    assert allow.add(PEER_A, label="laptop") is True
    assert allow.add(PEER_A) is False  # idempotent
    assert allow.contains(PEER_A)

    # persisted and reloadable
    reloaded = Allowlist.load(path)
    assert reloaded.contains(PEER_A)
    assert reloaded.peers()[0]["label"] == "laptop"
    assert reloaded.peers()[0]["added_at"]

    assert reloaded.remove(PEER_A) is True
    assert reloaded.remove(PEER_A) is False
    assert not Allowlist.load(path).contains(PEER_A)


# ── pairing policy ─────────────────────────────────────────────────────────


def test_strict_refuses_unknown_admits_known(tmp_path):
    allow = Allowlist.load(tmp_path / "a.json")
    allow.add(PEER_A)
    policy = PairingPolicy("strict", allow, is_tty=True)

    assert policy.decide(PEER_A) is True
    assert policy.decide(PEER_B) is False


def test_auto_prompts_and_persists_on_yes(tmp_path):
    allow = Allowlist.load(tmp_path / "a.json")
    prompts: list[str] = []

    def fake_prompt(msg):
        prompts.append(msg)
        return "y"

    policy = PairingPolicy(
        "auto", allow, prompt=fake_prompt, is_tty=True, log=lambda _m: None
    )
    assert policy.decide(PEER_B) is True
    assert len(prompts) == 1
    assert PEER_B in prompts[0]
    # persisted, so a second dial does not prompt again
    assert allow.contains(PEER_B)
    assert policy.decide(PEER_B) is True
    assert len(prompts) == 1


def test_auto_refuses_on_no(tmp_path):
    allow = Allowlist.load(tmp_path / "a.json")
    policy = PairingPolicy(
        "auto", allow, prompt=lambda _m: "n", is_tty=True, log=lambda _m: None
    )
    assert policy.decide(PEER_B) is False
    assert not allow.contains(PEER_B)


def test_auto_without_tty_degrades_to_strict(tmp_path):
    allow = Allowlist.load(tmp_path / "a.json")
    allow.add(PEER_A)
    logs: list[str] = []

    def boom(_msg):  # must never be called without a terminal
        raise AssertionError("prompted despite no TTY")

    policy = PairingPolicy("auto", allow, prompt=boom, is_tty=False, log=logs.append)
    assert policy.effective_mode == "strict"
    assert policy.decide(PEER_A) is True  # known key still admitted
    assert policy.decide(PEER_B) is False  # unknown refused, no prompt
    assert any("no terminal" in line for line in logs)


def test_invalid_pairing_mode(tmp_path):
    allow = Allowlist.load(tmp_path / "a.json")
    with pytest.raises(ValueError, match="unknown pairing mode"):
        PairingPolicy("nope", allow)


# ── v0 pump: end-to-end server + client (Milestone 1 + 2) ───────────────────


def test_pump_serves_api_end_to_end(tmp_storage, tmp_path):
    """A client dials the endpoint by key and gets identical API responses."""
    import asyncio

    import httpx

    from machinable.api.app import create_app
    from machinable.iroh.client import iroh_transport
    from machinable.iroh.transport import LoopbackPumpServer
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server_identity = load_identity(tmp_path / "server.key")
        client_identity = load_identity(tmp_path / "client.key")

        allow = Allowlist.load(tmp_path / "allow.json")
        allow.add(client_identity.endpoint_id)  # pre-approve the client key
        policy = PairingPolicy("strict", allow, is_tty=False)

        server = LoopbackPumpServer(
            app, identity=server_identity, policy=policy, relay="minimal"
        )
        addr = await server.start()
        transport = iroh_transport(addr, identity=client_identity, relay="minimal")
        try:
            async with httpx.AsyncClient(
                base_url="http://iroh", transport=transport, timeout=10
            ) as client:
                # a GET, no body
                health = await client.get("/v1/health")
                assert health.status_code == 200
                assert health.json()["status"] == "ok"

                # a POST with a JSON body, exercising the same routes as TCP
                call = await client.post(
                    "/v1/interfaces/call",
                    json={
                        "target": "basic",
                        "method": "hello",
                        "args": [],
                        "kwargs": {},
                    },
                )
                assert call.status_code == 200
                assert call.json()["payload"] == "there"
        finally:
            await transport.aclose()
            await server.aclose()

    asyncio.run(scenario())


# ── serve interface (machinable.iroh) ─────────────────────────────────


def test_serve_interface_resolves_and_inherits_config():
    import machinable
    from machinable.iroh import IrohServer
    from machinable.server import Server

    srv = machinable.get("machinable.iroh", {"relay": "lan", "pairing": "strict"})
    assert isinstance(srv, IrohServer)
    assert isinstance(srv, Server)  # inherits the base server interface
    assert srv.config.relay == "lan"
    assert srv.config.pairing == "strict"
    assert srv.config.host == "127.0.0.1"  # inherited base config


def test_serve_interface_refuses_background_serving():
    """start()/widget_state() must not silently spin up a plain HTTP server."""
    import machinable

    srv = machinable.get("machinable.iroh")
    with pytest.raises(RuntimeError, match="foreground only"):
        srv.start()
    with pytest.raises(RuntimeError, match="no in-notebook widget"):
        srv.widget_state()


def test_serve_interface_endpoint_id_and_allowlist(tmp_path, monkeypatch, capsys):
    import machinable

    # isolate the config dir so allowlist/identity land under tmp
    monkeypatch.setenv("MACHINABLE_CONFIG_DIR", str(tmp_path / "cfg"))
    srv = machinable.get("machinable.iroh")

    eid = srv.endpoint_id()
    assert len(eid) == 64
    assert srv.endpoint_id() == eid  # stable

    from machinable.iroh.allowlist import Allowlist

    srv.approve(PEER_A, label="box")
    assert Allowlist.load().contains(PEER_A)
    srv.list_peers()  # prints, returns None
    assert PEER_A in capsys.readouterr().out
    srv.revoke(PEER_A)
    assert not Allowlist.load().contains(PEER_A)


def test_pump_refuses_unapproved_client(tmp_storage, tmp_path):
    """An unlisted client key cannot reach the API under pairing=strict."""
    import asyncio

    import httpx

    from machinable.api.app import create_app
    from machinable.iroh.client import iroh_transport
    from machinable.iroh.transport import LoopbackPumpServer
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server_identity = load_identity(tmp_path / "server.key")
        client_identity = load_identity(tmp_path / "client.key")

        allow = Allowlist.load(tmp_path / "allow.json")  # client NOT approved
        policy = PairingPolicy("strict", allow, is_tty=False)

        server = LoopbackPumpServer(
            app, identity=server_identity, policy=policy, relay="minimal"
        )
        addr = await server.start()
        transport = iroh_transport(addr, identity=client_identity, relay="minimal")
        try:
            async with httpx.AsyncClient(
                base_url="http://iroh", transport=transport, timeout=5
            ) as client:
                with pytest.raises(Exception):  # noqa: B017 - connection refused
                    await client.get("/v1/health")
        finally:
            await transport.aclose()
            await server.aclose()

    asyncio.run(scenario())


# ── WebSocket over iroh (Milestone 2.2) + console client (2.3) ──────────────


def _serve_app_over_iroh(app, tmp_path):
    """Start a pump for ``app`` and return (server, client_identity)."""
    from machinable.iroh.transport import LoopbackPumpServer

    server_identity = load_identity(tmp_path / "server.key")
    client_identity = load_identity(tmp_path / "client.key")
    allow = Allowlist.load(tmp_path / "allow.json")
    allow.add(client_identity.endpoint_id)
    policy = PairingPolicy("strict", allow, is_tty=False)
    server = LoopbackPumpServer(
        app, identity=server_identity, policy=policy, relay="minimal"
    )
    return server, client_identity


def test_websocket_interface_session_over_iroh(tmp_storage, tmp_path):
    """A full connect → call → result WS session works over the iroh stream."""
    import asyncio
    import json

    from machinable.api.app import create_app
    from machinable.iroh.client import connect_websocket
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server, client_identity = _serve_app_over_iroh(app, tmp_path)
        addr = await server.start()
        try:
            ws = await connect_websocket(
                addr, "/v1/interfaces/ws", identity=client_identity, relay="minimal"
            )
            async with ws:
                await ws.send(json.dumps({"type": "connect", "target": "basic"}))
                connected = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
                assert connected["type"] == "connected"

                await ws.send(json.dumps({"type": "call", "method": "hello"}))
                result = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
                assert result["type"] == "result"
                assert result["payload"] == "there"
        finally:
            await server.aclose()

    asyncio.run(scenario())


def test_cli_console_iroh_wiring(tmp_path, monkeypatch):
    """`machinable console iroh://<id>` builds an iroh transport for the console."""
    import machinable.console as console_pkg
    from machinable.cli import main
    from machinable.iroh.client import IrohHttpTransport

    monkeypatch.setenv("MACHINABLE_CONFIG_DIR", str(tmp_path / "cfg"))
    captured = {}

    def fake_run_console(url, token=None, on_quit=None, transport=None):
        captured["url"] = url
        captured["transport"] = transport

    monkeypatch.setattr(console_pkg, "run_console", fake_run_console)

    rc = main(["console", f"iroh://{PEER_A}", "--relay", "minimal"])
    assert rc == 0
    assert captured["url"] == "http://iroh"
    assert isinstance(captured["transport"], IrohHttpTransport)


def test_console_client_over_iroh(tmp_storage, tmp_path):
    """ConsoleClient (what `machinable console iroh://…` drives) works by key."""
    import asyncio

    from machinable.api.app import create_app
    from machinable.console.client import ConsoleClient
    from machinable.iroh.client import iroh_transport
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server, client_identity = _serve_app_over_iroh(app, tmp_path)
        addr = await server.start()
        transport = iroh_transport(addr, identity=client_identity, relay="minimal")
        client = ConsoleClient("http://iroh", transport=transport)
        try:
            health = await client._request("GET", "/v1/health")
            assert health["status"] == "ok"
            modules = await client._request("GET", "/v1/project")
            assert "basic" in {m["module"] for m in modules["modules"]}
        finally:
            await client.aclose()
            await transport.aclose()
            await server.aclose()

    asyncio.run(scenario())


# ── native ASGI-over-iroh, v1 (Milestone 3) ─────────────────────────────────


def test_native_serves_http_and_websocket(tmp_storage, tmp_path):
    """The native (no-loopback) server serves the same HTTP + WS API by key."""
    import asyncio
    import json

    import httpx

    from machinable.api.app import create_app
    from machinable.iroh.client import connect_websocket, iroh_transport
    from machinable.iroh.native import NativeServer
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server_identity = load_identity(tmp_path / "server.key")
        client_identity = load_identity(tmp_path / "client.key")
        allow = Allowlist.load(tmp_path / "allow.json")
        allow.add(client_identity.endpoint_id)
        policy = PairingPolicy("strict", allow, is_tty=False)

        server = NativeServer(
            app, identity=server_identity, policy=policy, relay="minimal"
        )
        addr = await server.start()
        try:
            transport = iroh_transport(addr, identity=client_identity, relay="minimal")
            async with httpx.AsyncClient(
                base_url="http://iroh", transport=transport, timeout=10
            ) as client:
                health = await client.get("/v1/health")
                assert health.status_code == 200
                assert health.json()["status"] == "ok"
                call = await client.post(
                    "/v1/interfaces/call",
                    json={"target": "basic", "method": "hello", "args": []},
                )
                assert call.json()["payload"] == "there"
            await transport.aclose()

            ws = await connect_websocket(
                addr, "/v1/interfaces/ws", identity=client_identity, relay="minimal"
            )
            async with ws:
                await ws.send(json.dumps({"type": "connect", "target": "basic"}))
                connected = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
                assert connected["type"] == "connected"
                await ws.send(json.dumps({"type": "call", "method": "hello"}))
                result = json.loads(await asyncio.wait_for(ws.recv(), timeout=10))
                assert result["type"] == "result"
                assert result["payload"] == "there"
        finally:
            await server.aclose()

    asyncio.run(scenario())


def test_native_injects_bearer_token(tmp_storage, tmp_path):
    """Native server injects the bearer header so the token never hits the wire."""
    import asyncio

    import httpx

    from machinable.api.app import create_app
    from machinable.iroh.client import iroh_transport
    from machinable.iroh.native import NativeServer
    from machinable.project import Project

    async def scenario(inject: bool):
        # the API enforces a token; the client never sends one
        app = create_app(project_dir=Project.get().path(), api_token="s3cret")
        server_identity = load_identity(tmp_path / f"s{inject}.key")
        client_identity = load_identity(tmp_path / f"c{inject}.key")
        allow = Allowlist.load(tmp_path / f"a{inject}.json")
        allow.add(client_identity.endpoint_id)
        policy = PairingPolicy("strict", allow, is_tty=False)

        server = NativeServer(
            app,
            identity=server_identity,
            policy=policy,
            relay="minimal",
            api_token="s3cret" if inject else None,
        )
        addr = await server.start()
        transport = iroh_transport(addr, identity=client_identity, relay="minimal")
        try:
            async with httpx.AsyncClient(
                base_url="http://iroh", transport=transport, timeout=10
            ) as client:
                # a token-guarded route: passes only if the server injected auth
                return (await client.get("/v1/project")).status_code
        finally:
            await transport.aclose()
            await server.aclose()

    # with injection the key-authed client passes; without, the API rejects it
    assert asyncio.run(scenario(inject=True)) == 200
    assert asyncio.run(scenario(inject=False)) == 401


def test_native_binary_chunk_upload_over_websocket(tmp_storage, tmp_path):
    """The binary data plane (chunk upload) works over the native WS transport."""
    import asyncio
    import json

    from machinable.api.app import create_app
    from machinable.iroh.client import connect_websocket
    from machinable.iroh.native import NativeServer
    from machinable.project import Project

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server_identity = load_identity(tmp_path / "server.key")
        client_identity = load_identity(tmp_path / "client.key")
        allow = Allowlist.load(tmp_path / "allow.json")
        allow.add(client_identity.endpoint_id)
        policy = PairingPolicy("strict", allow, is_tty=False)

        server = NativeServer(
            app, identity=server_identity, policy=policy, relay="minimal"
        )
        addr = await server.start()
        try:
            ws = await connect_websocket(
                addr, "/v1/interfaces/ws", identity=client_identity, relay="minimal"
            )
            async with ws:
                await ws.send(json.dumps({"type": "connect", "target": "basic"}))
                assert json.loads(await asyncio.wait_for(ws.recv(), 10))["type"] == (
                    "connected"
                )
                # chunk_start → binary frame(s) → chunk_end → chunk_done
                await ws.send(
                    json.dumps(
                        {
                            "type": "chunk_start",
                            "id": "u1",
                            "path": "blob.bin",
                            "mode": "write",
                        }
                    )
                )
                await ws.send(b"hello bytes")  # a binary WS frame (data plane)
                await ws.send(json.dumps({"type": "chunk_end", "id": "u1"}))
                done = json.loads(await asyncio.wait_for(ws.recv(), 10))
                assert done["type"] == "chunk_done"
                assert done["payload"]["bytes_written"] == len(b"hello bytes")
        finally:
            await server.aclose()

    asyncio.run(scenario())


# ── discovery / relay modes + bulk data (Milestone 4) ───────────────────────


def test_relay_mode_resolution():
    """Relay strings map to the right iroh preset/relay_mode (and reject junk)."""
    import iroh

    from machinable.iroh.transport import _relay_config

    # public + lan + offline use a preset with no relay_mode override
    for mode in ("default", "lan", "offline", "minimal"):
        _preset, relay_mode = _relay_config(iroh, mode)
        assert relay_mode is None

    # a self-hosted relay URL produces a custom relay_mode (was ignored before)
    _preset, relay_mode = _relay_config(iroh, "https://relay.example.com")
    assert relay_mode is not None

    with pytest.raises(ValueError, match="unknown relay mode"):
        _relay_config(iroh, "not-a-mode")


def test_bulk_payload_round_trips(tmp_storage, tmp_path):
    """A multi-megabyte upload survives the transport intact (bulk data plane)."""
    import asyncio
    import json

    from machinable.api.app import create_app
    from machinable.iroh.client import connect_websocket
    from machinable.project import Project

    blob = b"machinable-bulk" * 400_000  # ~6 MB across many QUIC frames

    async def scenario():
        app = create_app(project_dir=Project.get().path())
        server, client_identity = _native_server(app, tmp_path)
        addr = await server.start()
        try:
            ws = await connect_websocket(
                addr, "/v1/interfaces/ws", identity=client_identity, relay="minimal"
            )
            async with ws:
                await ws.send(json.dumps({"type": "connect", "target": "basic"}))
                assert json.loads(await asyncio.wait_for(ws.recv(), 20))["type"] == (
                    "connected"
                )
                await ws.send(
                    json.dumps(
                        {
                            "type": "chunk_start",
                            "id": "big",
                            "path": "big.bin",
                            "mode": "write",
                        }
                    )
                )
                await ws.send(blob)
                await ws.send(json.dumps({"type": "chunk_end", "id": "big"}))
                done = json.loads(await asyncio.wait_for(ws.recv(), 20))
                assert done["type"] == "chunk_done"
                assert done["payload"]["bytes_written"] == len(blob)
        finally:
            await server.aclose()

    asyncio.run(scenario())


def _native_server(app, tmp_path):
    """Start a native server for ``app`` and return (server, client_identity)."""
    from machinable.iroh.native import NativeServer

    server_identity = load_identity(tmp_path / "server.key")
    client_identity = load_identity(tmp_path / "client.key")
    allow = Allowlist.load(tmp_path / "allow.json")
    allow.add(client_identity.endpoint_id)
    policy = PairingPolicy("strict", allow, is_tty=False)
    server = NativeServer(app, identity=server_identity, policy=policy, relay="minimal")
    return server, client_identity
