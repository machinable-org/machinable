"""machinable's MCP functions for a remote caller (plans/lab-mcp.md).

The registry of the MCP's functions, axes and aggregates dispatched over the
API as an in-process launch runs them (a scoped run sees its scope), reads that
see the runs another server made in a shared home, ``get_module`` naming the
import error, and the MCP's resources, prompts and tools over REST.
"""

import asyncio
import os
import shutil
import time

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("fastmcp")
pytest.importorskip("scipy")

from fastapi.testclient import TestClient

from machinable import Execution, Index, Project, Storage, get
from machinable.api.app import create_app
from machinable.mcp import prompts, resources, tools
from machinable.mcp.context import MCPContext
from machinable.mcp.server import create_server
from tests.memory_storage import BUCKETS

SEEDED = """
import random

from pydantic import BaseModel

from machinable import Interface, get


class Seeded(Interface):
    class Config(BaseModel):
        optimizer: str = "sgd"

    def __call__(self):
        # what the investigate example does: the seed is a scope, not config
        rng = random.Random(self.predicate.get("seed", 0))
        floor = 0.10 if self.config.optimizer == "sgd" else 0.16
        self.save_file(
            "loss.json",
            {"final": floor + 0.02 * rng.random(), "predicate": self.predicate},
        )

    def loss(self):
        return self.load_file("loss.json")["final"]

    def seen(self):
        return self.load_file("loss.json")["predicate"]

    @staticmethod
    def axis_seeds(n=4):
        return [get("machinable.scope", {"seed": s}) for s in range(n)]

    def version_adam(self):
        return {"optimizer": "adam"}
"""

SWEEP = '''
from pydantic import BaseModel

from machinable import Interface, get


class Sweep(Interface):
    """An aggregate: its own launch() lays out the seeded runs."""

    class Config(BaseModel):
        seeds: int = 3
        optimizer: str = "sgd"

    def launch(self):
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("seeded", [{"optimizer": self.config.optimizer}]).launch()

    def version_adam(self):
        return {"optimizer": "adam"}
'''


def _project(tmp_path, name="project") -> str:
    project = tmp_path / name
    shutil.copytree(
        "tests/samples/project",
        project,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite", "__pycache__"),
    )
    (project / "seeded.py").write_text(SEEDED)
    (project / "sweep.py").write_text(SWEEP)
    return str(project)


def _connected(project: str, tmp_path, name: str):
    return (
        Project(project),
        Storage(str(tmp_path / f"{name}-storage")),
        Index({"database": str(tmp_path / f"{name}.sqlite")}),
    )


def _in_process(project, tmp_path, target, version) -> dict:
    """seed -> loss of each run launching ``target`` at ``version`` in-process."""
    one, two, three = _connected(project, tmp_path, "local")
    with one, two, three:
        get(target, version).launch()
        operand = get(target, version)
        return {
            u.__model__.predicate.get("seed"): (u.loss(), u.seen())
            for u in operand.interfaces
            if u.cached()
        }


def _app(project, tmp_path, name):
    return create_app(
        project_dir=project,
        ambient_connections=[
            {
                "target": "machinable.storage",
                "version": [{"directory": str(tmp_path / f"{name}-storage")}],
            },
            {
                "target": "machinable.index",
                "version": [{"database": str(tmp_path / f"{name}.sqlite")}],
            },
        ],
    )


def _tool(client, tool, /, **arguments):
    response = client.post(f"/v1/mcp/tools/{tool}", json={"arguments": arguments})
    assert response.status_code == 200, response.text
    return response.json()["result"]


def _wait_cached(client, uuids, seconds=60):
    deadline = time.monotonic() + seconds
    for uuid in uuids:
        while not _tool(client, "run_status", uuid=uuid).get("cached"):
            assert time.monotonic() < deadline, f"{uuid} did not finish"
            time.sleep(0.05)


def _over_api(client, interfaces) -> dict:
    """seed -> loss of each run the API dispatched for ``interfaces``."""
    answer = client.post("/v1/executions", json={"interfaces": interfaces})
    assert answer.status_code == 200, answer.text
    uuids = answer.json()["interface_uuids"]
    _wait_cached(client, uuids)
    out = {}
    for uuid in uuids:
        loss, seen = (
            client.post(
                "/v1/interfaces/call", json={"target": uuid, "method": method}
            ).json()["payload"]
            for method in ("loss", "seen")
        )
        out[seen.get("seed")] = (loss, seen)
    return out


# -- the registry -----------------------------------------------------------------


def test_the_registry_is_what_the_server_registers(tmp_path):
    project = _project(tmp_path)
    ctx = MCPContext(project_dir=project)
    server = create_server(project)

    async def listed():
        from fastmcp import Client

        async with Client(server) as client:
            return (
                {t.name for t in await client.list_tools()},
                {str(r.uri) for r in await client.list_resources()}
                | {t.uriTemplate for t in await client.list_resource_templates()},
                {p.name for p in await client.list_prompts()},
            )

    served_tools, served_resources, served_prompts = asyncio.run(listed())
    assert set(tools.functions(ctx)) == served_tools
    assert set(resources.functions(ctx)) == served_resources
    assert set(prompts.functions(ctx)) == served_prompts

    found = tools.functions(ctx)["resolve_config"](target="seeded", version=["~adam"])
    assert found["config"]["optimizer"] == "adam"
    assert "authoring" in resources.read(ctx, "guide://authoring").lower()
    assert "axis_seeds" in resources.read(ctx, "examples://axis")
    assert resources.read(ctx, "module://seeded")["module"] == "seeded"
    with pytest.raises(LookupError):
        resources.read(ctx, "nothing://here")
    assert "sgd beats adam" in prompts.functions(ctx)["investigate"]("sgd beats adam")


# -- an axis, a scope and an aggregate dispatched over the API --------------------


def test_an_axis_over_the_api_runs_as_an_in_process_launch(tmp_path):
    local = _in_process(_project(tmp_path, "local"), tmp_path, "seeded", ["~~seeds"])
    assert set(local) == {0, 1, 2, 3}
    assert all(seen == {"seed": seed} for seed, (_, seen) in local.items())

    project = _project(tmp_path, "served")
    with TestClient(_app(project, tmp_path, "served")) as client:
        body = [{"target": "seeded", "version": ["~~seeds"]}]
        served = _over_api(client, body)
        assert served == local

        # again: every member is cached, each listed
        again = client.post("/v1/executions", json={"interfaces": body}).json()
        assert again["cached"] is True
        assert len(again["cached_uuids"]) == 4
        assert len(again["interface_uuids"]) == 4


def test_a_scoped_run_over_the_api_sees_its_scope(tmp_path):
    project = _project(tmp_path, "local")
    one, two, three = _connected(project, tmp_path, "local")
    with one, two, three:
        with get("machinable.scope", {"seed": 4}):
            run = get("seeded", ["~adam"]).launch()
        local = (run.loss(), run.seen())
    assert local[1] == {"seed": 4}

    project = _project(tmp_path, "served")
    with TestClient(_app(project, tmp_path, "served")) as client:
        served = _over_api(
            client,
            [
                {
                    "target": "seeded",
                    "version": ["~adam"],
                    "context": [
                        {"target": "machinable.scope", "version": [{"seed": 4}]}
                    ],
                }
            ],
        )
    assert served == {4: local}


def test_an_aggregate_over_the_api_runs_as_its_launch(tmp_path):
    local = _in_process(_project(tmp_path, "local"), tmp_path, "sweep", ["~adam"])
    assert set(local) == {0, 1, 2}

    project = _project(tmp_path, "served")
    with TestClient(_app(project, tmp_path, "served")) as client:
        served = _over_api(client, [{"target": "sweep", "version": ["~adam"]}])
    assert served == local


def test_runs_queued_in_scopes_keep_them(tmp_path):
    project = _project(tmp_path)
    one, two, three = _connected(project, tmp_path, "local")
    with one, two, three:
        with Execution() as execution:
            for seed in range(2):
                with get("machinable.scope", {"seed": seed}):
                    get("seeded").launch()
        runs = list(execution.interfaces)
        assert [r.seen() for r in runs] == [{"seed": 0}, {"seed": 1}]
        assert len({r.uuid for r in runs}) == 2


# -- reads on one server see the runs another made in a shared home ---------------


@pytest.fixture()
def lab(tmp_path, request):
    """Two servers of one project over one in-memory bucket, each its own index."""
    url = f"mem://{request.node.name}/lab"
    BUCKETS.pop(url, None)
    project = _project(tmp_path)

    def server(name):
        return TestClient(
            create_app(
                project_dir=project,
                ambient_connections=[
                    {
                        "target": "tests.memory_storage",
                        "version": [
                            {"url": url, "directory": str(tmp_path / f"{name}-copy")}
                        ],
                    },
                    {
                        "target": "machinable.index",
                        "version": [{"database": str(tmp_path / f"{name}.sqlite")}],
                    },
                ],
            )
        )

    yield server
    BUCKETS.pop(url, None)


def test_a_server_reads_the_runs_and_verdicts_another_made(lab):
    with lab("a") as a, lab("b") as b:
        uuids = []
        for version in (["~~seeds"], ["~~seeds", "~adam"]):
            answer = a.post(
                "/v1/executions",
                json={"interfaces": [{"target": "seeded", "version": version}]},
            ).json()
            uuids += answer["interface_uuids"]
        assert len(uuids) == 8
        _wait_cached(a, uuids)

        # b dispatched nothing, adopted nothing: its reads look in the home
        status = _tool(b, "run_status", uuid=uuids[0])
        assert status["cached"] is True and status["is_finished"] is True
        on_a = _tool(a, "quantity", operand="seeded", name="loss", version=["~~seeds"])
        on_b = _tool(b, "quantity", operand="seeded", name="loss", version=["~~seeds"])
        assert on_b["ok"] is True and on_b["n_units"] == 4
        assert sorted(on_b["values"]) == sorted(on_a["values"])

        question = {
            "a": "seeded",
            "a_version": ["~~seeds"],
            "b": "seeded",
            "b_version": ["~~seeds", "~adam"],
            "quantity": "loss",
            "tail": "less",
        }
        asked = _tool(a, "outperforms", **question)
        assert asked["ok"] is True and asked["cached"] is False
        assert asked["verdict"]["holds"] is True
        # b reads a's verdict: the same, cached
        read = _tool(b, "outperforms", **question)
        assert read["cached"] is True
        assert read["verdict"] == asked["verdict"]
        assert read["inference_uuid"] == asked["inference_uuid"]

        # nothing ran on b
        assert b.get("/v1/executions").json() == [] or all(
            e["is_finished"] for e in b.get("/v1/executions").json()
        )


def test_a_read_of_a_record_nobody_made_writes_nothing(lab):
    with lab("b") as b:
        before = {k: dict(v) for k, v in BUCKETS.items() if v}
        status = _tool(b, "resolve_config", target="seeded", version=["~adam"])
        assert status["config"]["optimizer"] == "adam"
        # no run anywhere: the accessor has nothing to read (an error), and the
        # look in the home wrote nothing there
        b.post(
            "/v1/mcp/tools/quantity",
            json={"arguments": {"operand": "seeded", "name": "loss"}},
        )
        assert {k: dict(v) for k, v in BUCKETS.items() if v} == before


# -- get_module names the import error --------------------------------------------


def test_get_module_names_the_import_error(tmp_path):
    project = _project(tmp_path)
    with open(os.path.join(project, "broken.py"), "w") as f:
        f.write(
            "from machinable import Interface\n\nclass Broken(Interface):\n    def (\n"
        )
    get_module = tools.functions(MCPContext(project_dir=project))["get_module"]

    error = get_module("broken")["error"]
    assert error.startswith("SyntaxError") and "broken.py" in error
    assert "not a declared remote" not in get_module("absent")["error"]
    assert "No interface module 'absent'" in get_module("absent")["error"]

    with TestClient(create_app(project_dir=project)) as client:
        response = client.get("/v1/project/broken")
        assert response.status_code == 404
        assert "broken.py" in response.json()["detail"]


# -- the MCP over REST ------------------------------------------------------------


def test_the_mcp_over_rest(tmp_path):
    project = _project(tmp_path)
    with TestClient(create_app(project_dir=project)) as client:
        described = client.get("/v1/mcp").json()
        assert "guide://authoring" in described["instructions"]
        assert {"launch", "quantity", "get_module"} <= set(described["tools"])
        assert described["resources"]["examples://{name}"]["mime_type"] == (
            "text/x-python"
        )
        assert "investigate" in described["prompts"]

        def resource(uri):
            return client.get("/v1/mcp/resources", params={"uri": uri})

        guide = resource("guide://authoring").json()
        assert guide["mime_type"] == "text/markdown"
        assert "BaseModel" in guide["content"]
        assert "axis_seeds" in resource("examples://axis").json()["content"]
        catalog = resource("inferences://catalog").json()["content"]
        assert "converges_faster" in catalog
        assert "render" in resource("widget-sdk://docs").json()["content"]
        assert resource("module://seeded").json()["content"]["module"] == "seeded"
        assert resource("nothing://here").status_code == 404

        prompt = client.post(
            "/v1/mcp/prompts/investigate",
            json={"arguments": {"hypothesis": "sgd beats adam"}},
        ).json()
        assert "sgd beats adam" in prompt["text"]
        assert client.post("/v1/mcp/prompts/nope", json={}).status_code == 404

        schema = _tool(client, "get_module", module="seeded")
        assert "seeds" in schema["axes"]
        # read-only: sources are edited through the source API
        written = client.post(
            "/v1/mcp/tools/write_source",
            json={"arguments": {"path": "x.py", "content": "x = 1"}},
        )
        assert written.status_code == 403
        assert not os.path.exists(os.path.join(project, "x.py"))
        wrong = client.post("/v1/mcp/tools/get_module", json={"arguments": {"nope": 1}})
        assert wrong.status_code == 400
        assert client.post("/v1/mcp/tools/nope", json={}).status_code == 404
