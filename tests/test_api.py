import time

import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient

from machinable.api.app import create_app


@pytest.fixture()
def api_client(tmp_storage):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path())
    with TestClient(app) as client:
        yield client


def test_health(api_client):
    response = api_client.get("/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "executions_active" in payload
    assert payload["uptime_seconds"] >= 0


def test_project_discovery(api_client):
    response = api_client.get("/v1/project")
    assert response.status_code == 200
    modules = {item["module"] for item in response.json()["modules"]}
    assert "basic" in modules
    assert "dummy" in modules

    schema = api_client.get("/v1/project/dummy").json()
    assert schema["module"] == "dummy"
    assert any(field["name"] == "a" for field in schema["config_fields"])


def test_interface_call(api_client):
    response = api_client.post(
        "/v1/interfaces/call",
        json={
            "target": "basic",
            "method": "hello",
            "args": [],
            "kwargs": {},
        },
    )
    assert response.status_code == 200
    assert response.json()["payload"] == "there"


def test_interface_ws_call(api_client):
    with api_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json(
            {
                "type": "connect",
                "target": "basic",
                "version": [],
                "meta": {"session": "test"},
            }
        )
        connected = ws.receive_json()
        assert connected["type"] == "connected"
        uuid = connected["payload"]["uuid"]

        ws.send_json(
            {
                "type": "call",
                "id": "1",
                "method": "set_state",
                "kwargs": {"state": "ready"},
            }
        )
        result = ws.receive_json()
        assert result["type"] == "result"
        assert result["id"] == "1"

        ws.send_json({"type": "call", "id": "2", "method": "get_state"})
        result = ws.receive_json()
        assert result["payload"] == "ready"

        listed = api_client.get("/v1/interfaces").json()
        match = next(item for item in listed if item["uuid"] == uuid)
        assert match["meta"]["session"] == "test"

        ws.send_json({"type": "close"})

    assert api_client.get(f"/v1/interfaces/{uuid}").status_code == 200
    assert api_client.delete(f"/v1/interfaces/{uuid}").status_code == 204


def test_interface_ws_emit(api_client):
    with api_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "emitter"})
        ws.receive_json()
        ws.send_json({"type": "call", "id": "1", "method": "progress", "kwargs": {}})

        events = []
        result = None
        for _ in range(4):
            msg = ws.receive_json()
            if msg["type"] == "event":
                events.append(msg["payload"])
            elif msg["type"] == "result":
                result = msg

        assert events == [{"step": 0}, {"step": 1}, {"step": 2}]
        assert result is not None
        assert result["id"] == "1"
        assert result["payload"] == "done"


def test_interface_ws_binary_chunk(api_client):
    with api_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "ingest"})
        ws.receive_json()

        ws.send_json(
            {
                "type": "chunk_start",
                "id": "rec-1",
                "path": "recordings/session/raw.bin",
                "mode": "write",
            }
        )
        ws.send_bytes(b"\x00\x01\x02")
        ws.send_bytes(b"\x03\x04")
        ws.send_json({"type": "chunk_end", "id": "rec-1"})

        done = ws.receive_json()
        assert done["type"] == "chunk_done"
        assert done["id"] == "rec-1"
        assert done["payload"]["path"] == "recordings/session/raw.bin"
        assert done["payload"]["bytes_written"] == 5

        ws.send_json(
            {
                "type": "call",
                "id": "1",
                "method": "byte_length",
                "kwargs": {"path": "recordings/session/raw.bin"},
            }
        )
        result = ws.receive_json()
        assert result["type"] == "result"
        assert result["payload"] == 5


def test_interface_stream(api_client):
    with api_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "streamer"})
        ws.receive_json()
        ws.send_json({"type": "call", "id": "s", "method": "stream", "kwargs": {}})
        first = ws.receive_json()
        second = ws.receive_json()
        final = ws.receive_json()
        assert first["type"] == "stream" and first["payload"] == 1
        assert second["type"] == "stream" and second["payload"] == 2
        assert final["final"] is True


def test_dispatch_execution(api_client):
    response = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "hello", "version": []}]},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["uuid"]
    assert payload["parent_uuid"]

    # dispatch is fire-and-forget in a background thread; poll for completion
    detail = api_client.get(f"/v1/executions/{payload['uuid']}").json()
    assert detail["uuid"] == payload["uuid"]
    for _ in range(100):
        if detail["is_finished"]:
            break
        time.sleep(0.05)
        detail = api_client.get(f"/v1/executions/{payload['uuid']}").json()
    assert detail["is_finished"] is True


def test_dispatch_interfaces_with_context(api_client):
    def run(body):
        resp = api_client.post("/v1/executions", json=body)
        assert resp.status_code == 200, resp.text
        euuid = resp.json()["uuid"]
        detail = api_client.get(f"/v1/executions/{euuid}").json()
        for _ in range(300):
            if detail["is_finished"]:
                break
            time.sleep(0.05)
            detail = api_client.get(f"/v1/executions/{euuid}").json()
        assert detail["is_finished"] is True
        return detail["parent_uuid"]

    # The new interfaces[] form runs to completion.
    plain = run({"interfaces": [{"target": "basic", "version": []}]})
    assert plain

    # The same interface dispatched under a Scope context resolves to a
    # DIFFERENT identity — the context's predicate folds into the interface
    # (entered/exited like the CLI chain).
    scoped = run(
        {
            "interfaces": [
                {
                    "target": "basic",
                    "version": [],
                    "context": [
                        {"target": "machinable.scope", "version": [{"unique": True}]}
                    ],
                }
            ]
        }
    )
    assert scoped and scoped != plain


def test_cancel_execution(api_client):
    disp = api_client.post(
        "/v1/executions", json={"interfaces": [{"target": "slow", "version": []}]}
    )
    assert disp.status_code == 200, disp.text
    euuid = disp.json()["uuid"]

    # Wait until the run has started.
    for _ in range(300):
        if api_client.get(f"/v1/executions/{euuid}").json()["is_started"]:
            break
        time.sleep(0.05)

    # Cancel = write the marker; the watcher injects ExecutionInterrupted within ~1s.
    assert api_client.post(f"/v1/executions/{euuid}/cancel").status_code == 204

    # Wait past the run's full ~4s duration: a cancelled run never
    # finishes; an uncancelled one would have. So `is_finished` staying
    # False proves the cancel took effect.
    time.sleep(6)
    detail = api_client.get(f"/v1/executions/{euuid}").json()
    assert detail["is_finished"] is False


def test_lifecycle_is_context_aware(api_client):
    scope = {"target": "machinable.scope", "version": [{"unique": True}]}

    # Dispatch "basic" under a Scope context, run to completion.
    disp = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "basic", "version": [], "context": [scope]}]},
    )
    assert disp.status_code == 200, disp.text
    euuid = disp.json()["uuid"]
    detail = api_client.get(f"/v1/executions/{euuid}").json()
    for _ in range(100):
        if detail["is_finished"]:
            break
        time.sleep(0.05)
        detail = api_client.get(f"/v1/executions/{euuid}").json()
    assert detail["is_finished"] is True
    scoped_uuid = detail["parent_uuid"]

    # Lifecycle WITH the matching context resolves to that exact scoped
    # interface, cached. (find matches by config fingerprint; the context
    # refines it to the scoped variant.)
    scoped = api_client.post(
        "/v1/interfaces/lifecycle",
        json={"target": "basic", "version": [], "context": [scope]},
    ).json()
    assert scoped["status"] == "cached"
    assert scoped["uuid"] == scoped_uuid


def test_interface_lifecycle_status(api_client):
    # An unmaterialized config is a draft: nothing in the index yet.
    draft = api_client.post(
        "/v1/interfaces/lifecycle", json={"target": "basic", "version": []}
    )
    assert draft.status_code == 200
    body = draft.json()
    assert body["status"] == "draft"
    assert body["uuid"] is None
    assert body["cached"] is False

    # Dispatch the same config and run it to completion.
    disp = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "basic", "version": []}]},
    )
    assert disp.status_code == 200
    euuid = disp.json()["uuid"]
    detail = api_client.get(f"/v1/executions/{euuid}").json()
    for _ in range(100):
        if detail["is_finished"]:
            break
        time.sleep(0.05)
        detail = api_client.get(f"/v1/executions/{euuid}").json()
    assert detail["is_finished"] is True

    # The same content now resolves to a cached result, with the run linked.
    done = api_client.post(
        "/v1/interfaces/lifecycle", json={"target": "basic", "version": []}
    ).json()
    assert done["status"] == "cached"
    assert done["cached"] is True
    assert done["uuid"]
    assert done["execution_uuid"] == euuid


def test_bearer_auth(tmp_storage):
    from machinable.project import Project

    app = create_app(
        project_dir=Project.get().path(),
        api_token="secret",
    )
    with TestClient(app) as client:
        assert client.get("/v1/health").status_code == 401
        assert (
            client.get(
                "/v1/health", headers={"Authorization": "Bearer secret"}
            ).status_code
            == 200
        )


def test_multi_project_routing(tmp_path):
    import os
    import shutil

    root = tmp_path
    proj_a = str(root / "a")
    proj_b = str(root / "b")
    ignore = shutil.ignore_patterns("storage", ".machinable.sqlite")
    shutil.copytree("tests/samples/project", proj_a, ignore=ignore)
    shutil.copytree("tests/samples/project", proj_b, ignore=ignore)

    # default project is A; B is reachable because it sits under an allowed root
    app = create_app(project_dir=proj_a, project_roots=[str(root)])
    with TestClient(app) as client:
        # dispatch into the default project (A) and into B via ?project=
        ra = client.post(
            "/v1/executions",
            json={"interfaces": [{"target": "hello", "version": []}]},
        )
        rb = client.post(
            f"/v1/executions?project={proj_b}",
            json={"interfaces": [{"target": "hello", "version": []}]},
        )
        assert ra.status_code == 200 and rb.status_code == 200
        ua, ub = ra.json()["uuid"], rb.json()["uuid"]
        assert ua != ub

        # each execution is visible only under its own project
        assert client.get(f"/v1/executions/{ua}").status_code == 200
        assert client.get(f"/v1/executions/{ua}?project={proj_b}").status_code == 404
        assert client.get(f"/v1/executions/{ub}?project={proj_b}").status_code == 200
        assert client.get(f"/v1/executions/{ub}").status_code == 404

        # storage/index lands inside each project directory (per-project)
        assert os.path.isfile(os.path.join(proj_a, ".machinable.sqlite"))
        assert os.path.isfile(os.path.join(proj_b, ".machinable.sqlite"))

        # project discovery is per-request
        mods_a = {m["module"] for m in client.get("/v1/project").json()["modules"]}
        mods_b = {
            m["module"]
            for m in client.get(f"/v1/project?project={proj_b}").json()["modules"]
        }
        assert "hello" in mods_a and "hello" in mods_b

        # a project outside the allowlist is rejected
        outside = str(root.parent / "outside")
        assert client.get(f"/v1/project?project={outside}").status_code == 403

        # the projects registry lists what the server can serve
        registry = client.get("/v1/projects").json()
        assert registry["default"] == os.path.normpath(os.path.abspath(proj_a))


def test_created_by_via_user_header(api_client):
    # an interface created through the API is attributed via X-Machinable-User
    r = api_client.post(
        "/v1/interfaces/call",
        json={
            "target": "basic",
            "method": "hello",
            "args": [],
            "kwargs": {},
            "version": [],
            "meta": {},
        },
        headers={"X-Machinable-User": "alice"},
    )
    assert r.status_code == 200
    items = api_client.get("/v1/interfaces").json()
    basic = [i for i in items if i["module"] == "basic"]
    assert basic and basic[0]["created_by"] == "alice"


def test_create_by_id_idempotent_with_label(api_client):
    cid = "view-" + "a" * 40  # content-hash-style client id
    first = api_client.post(
        "/v1/interfaces",
        json={"target": "view", "uuid": cid, "label": "My View", "version": []},
    )
    assert first.status_code == 200
    body = first.json()
    assert body["uuid"] == cid
    assert body["label"] == "My View"

    # same id again is a no-op returning the same instance (content-addressed)
    second = api_client.post(
        "/v1/interfaces",
        json={"target": "view", "uuid": cid, "version": []},
    )
    assert second.status_code == 200
    assert second.json()["uuid"] == cid

    # config stays immutable, but the label can be renamed (last-write-wins)
    renamed = api_client.patch(f"/v1/interfaces/{cid}/label", json={"label": "Renamed"})
    assert renamed.status_code == 200
    assert renamed.json()["label"] == "Renamed"
    assert api_client.get(f"/v1/interfaces/{cid}").json()["label"] == "Renamed"


def test_config_search_range_sort_pagination(api_client):
    for i in (1, 2, 3):
        api_client.post(
            "/v1/interfaces",
            json={"target": "view", "version": [{"duration": i}], "label": f"v{i}"},
        )

    # range filter: duration >= 2, sorted ascending, paginated
    resp = api_client.post(
        "/v1/interfaces/search",
        json={
            "kind": "Interface",
            "config": {
                "layer": "resolved",
                "filters": [{"path": "duration", "op": "gte", "value": 2}],
            },
            "sort": [
                {"by": "duration", "config_layer": "resolved", "direction": "asc"}
            ],
            "limit": 10,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    durations = [item["config"]["duration"] for item in data["items"]]
    assert durations == [2, 3]
    assert data["total"] == 2
    assert all("id" in item and "config" in item for item in data["items"])

    # label filter narrows to a single instance
    by_label = api_client.post("/v1/interfaces/search", json={"label": "v3"}).json()
    assert [item["config"]["duration"] for item in by_label["items"]] == [3]


def test_ws_binary_read_and_not_found(api_client):
    with api_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "reader"})
        ws.receive_json()

        # upload 5 bytes, then stream them back in 2-byte frames
        ws.send_json(
            {"type": "chunk_start", "id": "w", "path": "blob.bin", "mode": "write"}
        )
        ws.send_bytes(b"\x00\x01\x02\x03\x04")
        ws.send_json({"type": "chunk_end", "id": "w"})
        assert ws.receive_json()["type"] == "chunk_done"

        ws.send_json(
            {
                "type": "chunk_start",
                "id": "r",
                "mode": "read",
                "params": {"path": "blob.bin", "chunk_size": 2},
            }
        )
        frames = [ws.receive_bytes(), ws.receive_bytes(), ws.receive_bytes()]
        assert frames == [b"\x00\x01", b"\x02\x03", b"\x04"]
        done = ws.receive_json()
        assert done["type"] == "chunk_done"
        assert done["payload"]["bytes_sent"] == 5

        # missing data surfaces as a typed not_found error, not a transport failure
        ws.send_json(
            {
                "type": "chunk_start",
                "id": "r2",
                "mode": "read",
                "params": {"path": "nope.bin"},
            }
        )
        err = ws.receive_json()
        assert err["type"] == "error"
        assert err["payload"]["code"] == "not_found"


def test_openapi_is_self_describing():
    app = create_app()
    schema = app.openapi()
    info = schema["info"]
    assert info["title"] == "machinable API"
    assert info["version"]
    assert "substrate" in info["description"].lower()
    tags = {t["name"] for t in schema.get("tags", [])}
    assert {"interfaces", "executions", "meta", "health"} <= tags
    assert "/v1/protocol" in schema["paths"]


def test_protocol_endpoint(api_client):
    doc = api_client.get("/v1/protocol").json()
    assert doc["protocol_version"]
    frame_types = {f["type"] for f in doc["ws_frames"]}
    assert {"connect", "call", "chunk_start", "chunk_done", "error"} <= frame_types
    flows = {f["name"] for f in doc["chunk_flows"]}
    assert {"upload", "read"} == flows
    caps = {c["name"] for c in doc["capabilities"]}
    assert {"binary_read", "config_search", "create_by_id", "mutable_label"} <= caps
    hooks = {h["name"] for h in doc["interface_hooks"]}
    assert "read" in hooks


def test_docs_generator_renders():
    from machinable.api.docs import render

    md = render()
    assert md.startswith("<!-- GENERATED")
    assert "## WebSocket protocol" in md
    assert "## Capabilities" in md
    assert "POST /v1/interfaces/search" in md
    assert "GET /v1/protocol" in md
