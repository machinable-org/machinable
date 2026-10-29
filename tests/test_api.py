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


def test_interface_call_errors_are_structured(api_client):
    def call(method, **kwargs):
        return api_client.post(
            "/v1/interfaces/call",
            json={"target": "basic", "method": method, "args": [], **kwargs},
        )

    # a nonexistent method is a 404 with the reason, not a bare 500
    missing = call("nope")
    assert missing.status_code == 404
    assert "nope" in missing.json()["detail"]

    # private/dunder names are rejected (no remote __call__ / getattr probing)
    private = call("__call__")
    assert private.status_code == 400
    assert "private" in private.json()["detail"]

    # signature mismatches are a 400 naming the method
    bad_args = call("hello", kwargs={"unexpected": 1})
    assert bad_args.status_code == 400
    assert "hello" in bad_args.json()["detail"]

    # an exception inside the method surfaces its type + message as detail
    raised = call("faulty")
    assert raised.status_code == 500
    assert "RuntimeError" in raised.json()["detail"]
    assert "accessor exploded" in raised.json()["detail"]


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


def _dispatch_and_finish(api_client, targets):
    response = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": t, "version": []} for t in targets]},
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    for _ in range(100):
        if api_client.get(f"/v1/executions/{payload['uuid']}").json()["is_finished"]:
            break
        time.sleep(0.05)
    return payload


def test_dispatch_all_cached_returns_at_once(api_client):
    first = _dispatch_and_finish(api_client, ["hello"])
    assert first["cached"] is False and first["cached_uuids"] == []

    started = time.monotonic()
    response = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "hello", "version": []}]},
    )
    assert time.monotonic() - started < 5  # not the 10 s dispatch wait
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["cached"] is True
    assert payload["uuid"] == first["uuid"]
    assert payload["cached_uuids"] == [first["uuid"]]
    assert payload["is_finished"] is True


def test_dispatch_mixed_cached_dispatches_only_uncached(api_client):
    cached = _dispatch_and_finish(api_client, ["hello"])
    mixed = _dispatch_and_finish(api_client, ["hello", "basic"])
    assert mixed["cached"] is False
    assert mixed["uuid"] != cached["uuid"]
    assert mixed["parent_uuid"] != cached["parent_uuid"]

    both = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": t, "version": []} for t in ("hello", "basic")]},
    ).json()
    assert both["cached"] is True
    assert len(both["cached_uuids"]) == 2
    assert cached["uuid"] in both["cached_uuids"]


def test_two_servers_over_one_folder_run_a_request_once(tmp_storage):
    from machinable.project import Project

    directory = Project.get().path()
    body = {"interfaces": [{"target": "slow", "version": []}]}
    with (
        TestClient(create_app(project_dir=directory)) as one,
        TestClient(create_app(project_dir=directory)) as two,
    ):
        first = one.post("/v1/executions", json=body).json()
        assert first["running_elsewhere"] is False and first["cached"] is False

        started = time.monotonic()
        second = two.post("/v1/executions", json=body).json()
        assert time.monotonic() - started < 5  # answered at once, not waited
        assert second["running_elsewhere"] is True
        assert second["cached"] is False
        assert second["uuid"] == first["uuid"]
        assert second["running_elsewhere_uuids"] == [first["uuid"]]

        for _ in range(200):
            if one.get(f"/v1/executions/{first['uuid']}").json()["is_finished"]:
                break
            time.sleep(0.05)
        third = two.post("/v1/executions", json=body).json()
        assert third["cached"] is True and third["uuid"] == first["uuid"]
        assert third["running_elsewhere"] is False


SERVER = """
import json
import sys

from fastapi.testclient import TestClient

from machinable.api.app import create_app

project, out = sys.argv[1:3]
body = {"interfaces": [{"target": "slow", "version": []}]}
with TestClient(create_app(project_dir=project)) as client:
    answer = client.post("/v1/executions", json=body).json()
    uuid = answer["uuid"]
    if not answer["running_elsewhere"] and not answer["cached"]:
        while not client.get(f"/v1/executions/{uuid}").json()["is_finished"]:
            pass
with open(out, "w") as f:
    json.dump(answer, f)
"""


def test_two_server_processes_with_their_own_index_run_once(tmp_path):
    import json
    import os
    import shutil
    import subprocess
    import sys

    project = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project", project, ignore=shutil.ignore_patterns("storage")
    )
    script = tmp_path / "server.py"
    script.write_text(SERVER)
    src = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src")
    processes = []
    for name in ("a", "b"):
        env = dict(
            os.environ,
            MACHINABLE_INDEX=str(tmp_path / f"{name}.sqlite"),
            PYTHONPATH=src,
        )
        processes.append(
            subprocess.Popen(
                [sys.executable, str(script), str(project), str(tmp_path / name)],
                env=env,
                cwd=str(project),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )
        )
    for process in processes:
        output, _ = process.communicate(timeout=120)
        assert process.returncode == 0, output.decode()
    answers = [json.loads((tmp_path / name).read_text()) for name in ("a", "b")]
    assert answers[0]["uuid"] == answers[1]["uuid"]
    assert sorted(a["running_elsewhere"] or a["cached"] for a in answers) == [
        False,
        True,
    ]
    runs = [
        dirpath
        for dirpath, _, files in os.walk(project / "storage")
        if "id.json" in files and '"Execution"' in open(f"{dirpath}/id.json").read()
    ]
    assert len(runs) == 1


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


def _wait_finished(api_client, euuid, polls=200):
    detail = api_client.get(f"/v1/executions/{euuid}").json()
    for _ in range(polls):
        if detail["is_finished"]:
            break
        time.sleep(0.05)
        detail = api_client.get(f"/v1/executions/{euuid}").json()
    return detail


def test_lifecycle_names_the_newest_run_of_a_rerun(api_client):
    body = {"interfaces": [{"target": "slow", "version": []}]}
    lifecycle = {"target": "slow", "version": []}

    first = api_client.post("/v1/executions", json=body).json()["uuid"]
    assert _wait_finished(api_client, first)["is_finished"] is True
    done = api_client.post("/v1/interfaces/lifecycle", json=lifecycle).json()
    assert done["status"] == "cached"
    assert done["execution_uuid"] == first

    # un-cache and dispatch the same settings again: a second run of the record
    uncached = api_client.post(
        "/v1/interfaces/call",
        json={"target": "slow", "version": [], "method": "cached", "args": [False]},
    )
    assert uncached.status_code == 200, uncached.text
    again = api_client.post("/v1/executions", json=body).json()
    second = again["uuid"]
    assert again["cached"] is False
    assert second != first
    record = done["uuid"]
    assert api_client.get(f"/v1/executions/{second}").json()["parent_uuid"] == record

    # while the new run runs, the lifecycle names it (not the finished old one)
    running = api_client.post("/v1/interfaces/lifecycle", json=lifecycle).json()
    assert running["uuid"] == record
    assert running["execution_uuid"] == second
    assert running["status"] in ("running", "pending")
    assert running["cached"] is False

    assert _wait_finished(api_client, second)["is_finished"] is True
    finished = api_client.post("/v1/interfaces/lifecycle", json=lifecycle).json()
    assert finished["status"] == "cached"
    assert finished["execution_uuid"] == second

    # the record's info and its run list agree: newest first
    info = api_client.get(f"/v1/interfaces/{record}").json()
    assert info["execution_count"] == 2
    assert info["latest_execution_uuid"] == second
    runs = api_client.get(f"/v1/interfaces/{record}/executions").json()
    assert [run["uuid"] for run in runs] == [second, first]
    newest = api_client.get(f"/v1/interfaces/{record}/executions?limit=1").json()
    assert [run["uuid"] for run in newest] == [second]


RESOURCE_EXECUTION = """
from machinable import Execution


class PackageExecution(Execution):
    def on_compute_default_resources(self, interface):
        if interface is None:
            return None
        return {"package": {"name": "lab/tools", "hash": "abc123", "label": "1.4"}}
"""


def test_run_info_carries_the_computed_resources(api_client):
    import os

    from machinable.project import Project

    with open(os.path.join(Project.get().path(), "package_execution.py"), "w") as f:
        f.write(RESOURCE_EXECUTION)

    package = {"name": "lab/tools", "hash": "abc123", "label": "1.4"}
    dispatched = api_client.post(
        "/v1/executions",
        json={
            "execution": {"target": "package_execution", "version": []},
            "interfaces": [{"target": "dummy", "version": [{"a": 7}]}],
        },
    )
    assert dispatched.status_code == 200, dispatched.text
    euuid = dispatched.json()["uuid"]
    detail = _wait_finished(api_client, euuid)
    assert detail["is_finished"] is True
    assert detail["resources"] == {"package": package}
    assert detail["declared_resources"] is None

    listed = api_client.get(f"/v1/interfaces/{detail['parent_uuid']}/executions")
    assert listed.json()[0]["resources"] == {"package": package}
    everything = api_client.get("/v1/executions").json()
    assert {"package": package} in [run["resources"] for run in everything]


def test_run_info_keeps_the_declared_resources(tmp_storage):
    import os

    from machinable import Execution, Interface
    from machinable.project import Project
    from machinable.server import Server

    with open(os.path.join(Project.get().path(), "package_execution.py"), "w") as f:
        f.write(RESOURCE_EXECUTION)
    package = {"name": "lab/tools", "hash": "abc123", "label": "1.4"}

    # declared resources merge into the computed ones and stay available as given
    with Execution.make("package_execution", resources={"cpus": 2}):
        interface = Interface.make("dummy", {"a": 8})
        interface.launch()
    run = interface.execution

    app = create_app(
        project_dir=Project.get().path(),
        ambient_connections=Server._ambient_connections(),
    )
    with TestClient(app) as client:
        detail = client.get(f"/v1/executions/{run.uuid}").json()
    assert detail["resources"] == {"package": package, "cpus": 2}
    assert detail["declared_resources"] == {"cpus": 2}


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


def test_search_include_status(api_client):
    # a run through the API: cached with one recorded execution
    dispatched = api_client.post(
        "/v1/executions", json={"interfaces": [{"target": "basic"}]}
    ).json()
    for _ in range(200):
        detail = api_client.get(f"/v1/executions/{dispatched['uuid']}").json()
        if detail.get("is_finished"):
            break
        time.sleep(0.05)

    # plain search stays lean (no status derivation)
    plain = api_client.post("/v1/interfaces/search", json={"module": "basic"}).json()
    assert plain["items"][0]["status"] is None

    enriched = api_client.post(
        "/v1/interfaces/search", json={"module": "basic", "include_status": True}
    ).json()
    item = enriched["items"][0]
    assert item["id"] == dispatched["parent_uuid"]
    assert item["status"] == "cached"
    assert item["run_count"] == 1
    assert item["version"] == []

    # a never-run record reports draft
    api_client.post(
        "/v1/interfaces", json={"target": "view", "version": [{"duration": 9}]}
    )
    drafts = api_client.post(
        "/v1/interfaces/search", json={"module": "view", "include_status": True}
    ).json()
    assert drafts["items"][0]["status"] == "draft"
    assert drafts["items"][0]["run_count"] == 0
    assert drafts["items"][0]["version"] == [{"duration": 9}]


def test_module_schema_nested_reflection(api_client):
    schema = api_client.get("/v1/project/pipeline").json()
    fields = {f["name"]: f for f in schema["config_fields"]}

    # a nested model annotation carries its recursively reflected sub-fields
    optimizer = fields["optimizer"]
    sub = {f["name"]: f for f in optimizer["fields"]}
    assert (
        sub["kind"]["type"].startswith("typing.Literal")
        or "Literal" in sub["kind"]["type"]
    )
    assert sub["lr"]["default"] == 0.1

    # …including through list containers
    stages = fields["stages"]
    assert [f["name"] for f in stages["fields"]] == ["name", "epochs"]

    # plain fields stay flat
    assert fields["note"]["fields"] is None

    # the ~version vocabulary is reflected with signatures + docs
    methods = {m["name"]: m for m in schema["version_methods"]}
    assert "epochs" in methods["fast"]["signature"]
    assert methods["precise"]["doc"] == "Lower learning rate."

    # the class's source location is reflected (feeds code views)
    assert schema["source_file"] == "pipeline.py"
    assert schema["source_line"] > 0
    assert methods["fast"]["source_line"] > schema["source_line"]


def test_output_capture_and_chunking(api_client):
    # in-process (thread) dispatch captures the run's stdout into output.log
    dispatched = api_client.post(
        "/v1/executions", json={"interfaces": [{"target": "interface.dummy"}]}
    ).json()
    for _ in range(200):
        detail = api_client.get(f"/v1/executions/{dispatched['uuid']}").json()
        if detail.get("is_finished"):
            break
        time.sleep(0.05)
    assert detail["is_finished"] is True

    base = f"/v1/executions/{dispatched['uuid']}/output"
    full = api_client.get(base).json()
    assert "Hello world!" in full["output"]
    assert full["offset"] == 0
    assert full["size"] == len(full["output"].encode())

    # tail: the last N bytes, offset reporting where the window starts
    tail = api_client.get(f"{base}?tail=7").json()
    assert full["output"].endswith(tail["output"])
    assert tail["offset"] == full["size"] - 7

    # incremental follow: offset=size yields an empty append, same size
    follow = api_client.get(f"{base}?offset={full['size']}").json()
    assert follow["output"] == ""
    assert follow["size"] == full["size"]

    # windows are capped server-side
    capped = api_client.get(f"{base}?limit=4").json()
    assert len(capped["output"].encode()) <= 4


def test_resolve_structured_issues(api_client):
    ok = api_client.post(
        "/v1/interfaces/resolve", json={"target": "view", "version": [{"duration": 5}]}
    )
    assert ok.status_code == 200

    bad = api_client.post(
        "/v1/interfaces/resolve", json={"target": "view", "version": [{"nope": 1}]}
    )
    assert bad.status_code == 400
    detail = bad.json()["detail"]
    assert "Unknown config key" in detail["message"]
    assert detail["issues"][0]["path"] == "nope"
    assert "Unknown config key" in detail["issues"][0]["message"]


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


def test_invalid_config_reports_issues_on_every_route(api_client):
    """A config the server cannot build is a 400 with field-attached issues.

    Every route that constructs one from (target, version) answers the same way — they
    used to disagree, resolve reporting issues while lifecycle, call and dispatch
    returned a bare 500, so the same mistake was legible in one panel and a mystery in
    the next.
    """
    out_of_range = [{"alpha": 5}]
    routes = [
        ("/v1/interfaces/resolve", {"target": "bounded", "version": out_of_range}),
        (
            "/v1/interfaces/lifecycle",
            {"target": "bounded", "version": out_of_range, "context": []},
        ),
        (
            "/v1/interfaces/call",
            {
                "target": "bounded",
                "version": out_of_range,
                "method": "cached",
                "args": [],
                "kwargs": {},
            },
        ),
        (
            "/v1/executions",
            {"interfaces": [{"target": "bounded", "version": out_of_range}]},
        ),
    ]
    for path, body in routes:
        response = api_client.post(path, json=body)
        assert response.status_code == 400, f"{path} -> {response.status_code}"
        detail = response.json()["detail"]
        assert detail["issues"] == [
            {"path": "alpha", "message": "Input should be less than or equal to 1"}
        ], path

    # a model_validator has no field location, but still reports rather than 500s
    response = api_client.post(
        "/v1/interfaces/lifecycle",
        json={"target": "bounded", "version": [{"labels": ["a", "b"]}], "context": []},
    )
    assert response.status_code == 400
    issues = response.json()["detail"]["issues"]
    assert issues[0]["path"] is None and "labels has 2 entries" in issues[0]["message"]

    # and a valid config is unaffected
    response = api_client.post(
        "/v1/interfaces/lifecycle",
        json={"target": "bounded", "version": [{"alpha": 0.5}], "context": []},
    )
    assert response.status_code == 200 and response.json()["status"] == "draft"


def test_config_field_constraints_are_served(api_client):
    """Declared constraints reach the client, so an editor can bound its inputs."""
    fields = {
        f["name"]: f
        for f in api_client.get("/v1/project/bounded").json()["config_fields"]
    }
    assert fields["alpha"]["constraints"] == {"ge": 0.0, "le": 1.0}
    assert fields["alpha"]["description"] == "Weight."
    assert fields["n"]["constraints"] is None


def test_pending_run_is_not_a_draft(tmp_storage):
    """A dispatched-but-unstarted run is the scheduler queue window.

    ``prepare_dispatch`` is what a submit-style backend (Slurm) calls before
    handing the job over: the run-record exists and carries ``dispatched_at``,
    but the payload has not run, so no ``started_at`` follows until the
    scheduler starts it. Reporting that as ``draft`` would say the interface
    was never launched at all.
    """
    from machinable import Execution, Interface
    from machinable.api._helpers import (
        _entry_status,
        execution_to_info,
        interface_lifecycle,
    )

    interface = Interface.make("basic")
    interface.materialize()
    assert _entry_status(interface.uuid) == ("draft", 0)

    run = Execution()
    run.prepare_dispatch(interface)

    status = run.status_snapshot()
    assert status.is_dispatched and not status.is_started
    assert status.is_pending
    assert not status.is_active and not status.is_incomplete

    assert _entry_status(interface.uuid) == ("pending", 1)
    assert interface_lifecycle(None, "basic", []).status == "pending"

    info = execution_to_info(run)
    assert info.is_pending is True
    assert info.is_started is False
    assert info.dispatched_at is not None

    # once the payload starts beating, the record leaves the queue window
    run.update_status("started")
    run.update_status("heartbeat")
    assert not run.status_snapshot().is_pending
    assert _entry_status(interface.uuid) == ("running", 1)


SLOW = """
import os
import time

from machinable import Interface

with open(os.environ["MACHINABLE_TEST_BUILDS"], "a") as f:
    f.write("x")
time.sleep(float(os.environ.get("MACHINABLE_TEST_BUILD_SECONDS", "0")))


class Slow(Interface):
    def hello(self):
        return "slow"
"""


def test_a_call_builds_off_the_event_loop_and_once(tmp_storage, monkeypatch):
    """A slow build does not hold up other requests; a repeated call reuses it."""
    import os
    import threading

    from machinable.project import Project

    project = Project.get().path()
    module = os.path.join(project, "slow_build.py")
    with open(module, "w") as f:
        f.write(SLOW)
    builds = os.path.join(project, "builds.txt")
    monkeypatch.setenv("MACHINABLE_TEST_BUILDS", builds)

    def count() -> int:
        with open(builds) as f:
            return len(f.read())

    app = create_app(project_dir=project)
    with TestClient(app) as client:

        def call(version=None):
            return client.post(
                "/v1/interfaces/call",
                json={
                    "target": "slow_build",
                    "version": version or [],
                    "method": "hello",
                    "args": [],
                },
            )

        monkeypatch.setenv("MACHINABLE_TEST_BUILD_SECONDS", "1.5")
        answers = []
        slow = threading.Thread(target=lambda: answers.append(call()))
        slow.start()
        deadline = time.monotonic() + 10
        while not os.path.exists(builds):  # the slow build has begun
            assert time.monotonic() < deadline
            time.sleep(0.01)
        started = time.monotonic()
        assert client.get("/v1/health").status_code == 200
        assert time.monotonic() - started < 1.0  # not behind the build
        slow.join()
        assert answers[0].status_code == 200, answers[0].text
        assert answers[0].json()["payload"] == "slow"
        built = count()

        # the same module and version again: no build
        monkeypatch.setenv("MACHINABLE_TEST_BUILD_SECONDS", "0")
        for _ in range(3):
            assert call().json()["payload"] == "slow"
        assert count() == built

        # a different version, or an edited module, builds again
        assert call([{"_tag": "other"}]).status_code in (200, 400)
        assert count() == built + 1
        stat = os.stat(module)
        os.utime(module, ns=(stat.st_atime_ns, stat.st_mtime_ns + 10**9))
        assert call().json()["payload"] == "slow"
        assert count() == built + 2


def test_dispatch_with_uses(api_client):
    """``uses`` names existing runs, also one of a module that no longer imports."""
    import os
    import sys

    from machinable.project import Project

    path = os.path.join(Project.get().path(), "gone.py")
    with open(path, "w") as f:
        f.write(
            "from machinable import Interface\n\n\nclass Gone(Interface):\n    pass\n"
        )
    (gone,) = _dispatch_and_finish(api_client, ["gone"])["interface_uuids"]
    os.remove(path)
    sys.modules.pop("gone", None)

    response = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "hello", "version": [], "uses": [gone]}]},
    )
    assert response.status_code == 200, response.text
    (hello,) = response.json()["interface_uuids"]
    graph = api_client.get(f"/v1/interfaces/{hello}/provenance").json()
    uses = [(e["source"], e["target"]) for e in graph["links"] if e["rel"] == "uses"]
    assert uses == [(hello, gone)]
    (node,) = [n for n in graph["nodes"] if n["uuid"] == gone]
    assert node["module"] == "gone"

    missing = api_client.post(
        "/v1/executions",
        json={"interfaces": [{"target": "hello", "uses": ["nosuchrunid"]}]},
    )
    assert missing.status_code == 404, missing.text


def test_dispatch_uses_a_run_made_under_another_index(tmp_path):
    """Two indexes over one storage: the server's has never seen the run."""
    import shutil

    from machinable import Index, Interface, Project, Storage

    project = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project", project, ignore=shutil.ignore_patterns("storage")
    )
    storage = str(tmp_path / "storage")
    with (
        Project(str(project)),
        Storage(storage),
        Index({"database": str(tmp_path / "one.sqlite")}),
    ):
        made = Interface.make("dummy", {"a": 3}).launch().uuid

    app = create_app(
        project_dir=str(project),
        ambient_connections=[
            {"target": "machinable.storage", "version": [{"directory": storage}]},
            {
                "target": "machinable.index",
                "version": [{"database": str(tmp_path / "two.sqlite")}],
            },
        ],
    )
    with TestClient(app) as client:
        response = client.post(
            "/v1/executions",
            json={"interfaces": [{"target": "hello", "uses": [made]}]},
        )
        assert response.status_code == 200, response.text
        (hello,) = response.json()["interface_uuids"]
        graph = client.get(f"/v1/interfaces/{hello}/provenance").json()
        assert [
            (e["source"], e["target"]) for e in graph["links"] if e["rel"] == "uses"
        ] == [(hello, made)]
        missing = client.post(
            "/v1/executions",
            json={"interfaces": [{"target": "hello", "uses": ["nosuchrunid"]}]},
        )
        assert missing.status_code == 404, missing.text


# ------------------------------------------- a data record's header, ingested


@pytest.fixture()
def server_project(tmp_path):
    """A project with a reader, whose server has never seen the data record."""
    import sys

    from machinable.corpus import PLAIN_MODULES

    from .test_plain_config import READER, _forget_modules, _write_modules

    modules = {**PLAIN_MODULES, "reader": READER}
    directory = tmp_path / "projects" / "server"
    directory.mkdir(parents=True)
    _write_modules(str(directory), modules)
    _forget_modules(modules)
    sys.path.insert(0, str(directory))
    with TestClient(create_app(project_dir=str(directory))) as client:
        yield str(directory), client
    sys.path.remove(str(directory))
    _forget_modules(modules)


def _header_bundle() -> tuple[dict, dict]:
    """What a plain writer (captu) sends: the header files, no data; its input."""
    import json

    from .test_dispatch import _vector

    vector = _vector()
    given, expect = vector["input"], vector["expect"]
    return {
        "id": json.loads(expect["id_json"]),
        "model": json.loads(expect["model_json"]),
        "files": json.loads(given["artifacts"]["files.json"]),
        "edges": [],
        "markers": {"updated_at": "2026-01-01T00:00:00+00:00"},
    }, vector


def test_ingest_a_data_record_then_dispatch_with_its_working_copy(
    server_project, tmp_path
):
    import os

    from machinable import Index, Interface, Project
    from machinable.dispatch import dispatch_request
    from machinable.interface import connection_scope

    from .test_dispatch import _folder, _reads, _seen

    project, client = server_project
    bundle, vector = _header_bundle()
    uuid = vector["expect"]["record_id"]
    folder = _folder(tmp_path / "rig", vector["input"]["artifacts"])

    # unknown to the server: uses cannot resolve it
    missing = client.post("/v1/executions", json=_reads(uuid, folder))
    assert missing.status_code == 404, missing.text

    response = client.post("/v1/interfaces/ingest", json=bundle)
    assert response.status_code == 200, response.text
    assert response.json() == {"uuid": uuid, "created": True}
    # the same header again is fine
    again = client.post("/v1/interfaces/ingest", json=bundle)
    assert again.status_code == 200, again.text
    assert again.json() == {"uuid": uuid, "created": False}

    with connection_scope(), Project(project):
        directory = Index.get().local_directory(uuid)
        # the header, never a data file
        assert sorted(os.listdir(directory)) == [
            ".machinable",
            "files.json",
            "id.json",
            "model.json",
            "updated_at",
        ]
        record = Interface.find_by_id(uuid, fetch=False, stub=True)
        assert record.load_file("files.json") == bundle["files"]

    response = client.post("/v1/executions", json=_reads(uuid, folder))
    assert response.status_code == 200, response.text
    (run_uuid,) = response.json()["interface_uuids"]
    deadline = time.monotonic() + 30
    while _seen(project, run_uuid) is None and time.monotonic() < deadline:
        time.sleep(0.05)
    seen = _seen(project, run_uuid)
    assert seen is not None
    assert seen["path"].startswith(folder)

    # and serverless dispatch on the same project resolves it too
    handle = dispatch_request(_reads(uuid, folder), project=project, mode="prepare")
    assert handle["runs"] == [] or handle["parent_uuid"] == run_uuid


def test_ingest_refuses_data_paths_and_other_headers(server_project):
    import copy

    _, client = server_project
    bundle, _ = _header_bundle()

    def ingest(body):
        return client.post("/v1/interfaces/ingest", json=body)

    # no data files, no paths: only the header's fields
    for extra in (
        {"artifacts": {"Record Node 101/continuous/data.dat": "\u0000"}},
        {"path": "/home/someone/session"},
        {"directory": "/tmp/x"},
        {"home": "../../elsewhere"},
    ):
        response = ingest({**bundle, **extra})
        assert response.status_code == 422, (extra, response.text)

    def changed(path, value):
        body = copy.deepcopy(bundle)
        target = body
        for key in path[:-1]:
            target = target[key]
        target[path[-1]] = value
        return body

    for body in (
        changed(("id", "uuid"), "../escape"),
        changed(("id", "identity_key"), "a/b"),
        changed(("id", "kind"), "Execution"),
        changed(("model", "uuid"), "SomeoneElse1"),
        changed(("model", "inherits"), ["machinable.interface"]),
        changed(("markers",), {"finished_at": "2026-01-01T00:00:00+00:00"}),
        changed(("edges",), [{"name": "uses", "uuid": "aaa", "related_uuid": "b"}]),
    ):
        response = ingest(body)
        assert response.status_code == 400, response.text

    assert ingest(bundle).status_code == 200
    # another header for the record the server has is refused
    conflicting = changed(("model", "config", "format"), "nwb")
    response = ingest(conflicting)
    assert response.status_code == 409, response.text
    response = ingest(changed(("id", "predicate_key"), "0" * 32))
    assert response.status_code == 409, response.text
    # a relabelled one is the same record
    relabelled = changed(("model", "label"), "renamed")
    assert ingest(relabelled).json()["created"] is False
