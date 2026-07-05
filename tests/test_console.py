"""Console: the ConsoleClient API wrapper and the Textual UI, both driven
against the FastAPI app in-process (no sockets)."""

import asyncio
import time

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("textual")

import httpx
from fastapi.testclient import TestClient

from machinable.api.app import create_app
from machinable.console.client import ConsoleClient, ConsoleError


@pytest.fixture()
def seeded_app(tmp_storage):
    """The API app with one finished `basic` run, created through the API.

    The console is a pure client, so records must exist in the server's own
    project context (each request opens its own connection scope; records made
    directly in the test context would be invisible to it).
    """
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path())
    with TestClient(app) as http:
        response = http.post(
            "/v1/executions", json={"interfaces": [{"target": "basic"}]}
        )
        assert response.status_code == 200
        payload = response.json()
        for _ in range(200):
            detail = http.get(f"/v1/executions/{payload['uuid']}").json()
            if detail.get("is_finished"):
                break
            time.sleep(0.05)
        assert detail["is_finished"] is True
        yield app, payload["parent_uuid"], payload["uuid"]


def _client(app) -> ConsoleClient:
    return ConsoleClient("http://console.test", transport=httpx.ASGITransport(app=app))


def test_console_client_roundtrip(seeded_app):
    app, parent_uuid, run_uuid = seeded_app

    async def scenario():
        client = _client(app)
        try:
            health = await client.health()
            assert health["status"] == "ok"

            found = await client.search()
            assert found["total"] >= 1
            item = next(i for i in found["items"] if i["module"] == "basic")
            assert item["id"] == parent_uuid

            info = await client.interface(parent_uuid)
            assert info["module"] == "basic"
            assert info["cached"] is True

            runs = await client.interface_executions(parent_uuid)
            assert runs and runs[0]["uuid"] == run_uuid
            assert runs[0]["is_finished"] is True

            files = await client.files(parent_uuid)
            assert files
            target = next((f for f in files if f.endswith(".json")), files[0])
            content = await client.read_file(parent_uuid, target)
            assert content is not None

            all_runs = await client.executions()
            assert any(e["uuid"] == run_uuid for e in all_runs)

            # cancel on a finished run is a no-op marker, but must succeed
            await client.cancel(run_uuid)

            with pytest.raises(ConsoleError):
                await client.interface("does-not-exist")
        finally:
            await client.aclose()

    asyncio.run(scenario())


def test_console_client_launch_pad(seeded_app):
    app, parent_uuid, _run_uuid = seeded_app

    async def scenario():
        client = _client(app)
        try:
            modules = await client.modules()
            assert any(m["module"] == "basic" for m in modules)

            schema = await client.module_schema("dummy")
            assert any(f["name"] == "a" for f in schema["config_fields"])

            resolved = await client.resolve("dummy", [{"a": 5}])
            assert resolved["config"]["a"] == 5
            assert resolved["cli"]

            # typos surface as clean errors instead of being dropped
            with pytest.raises(ConsoleError):
                await client.resolve("dummy", [{"nope": 1}])

            # the seeded run previews as cached, an unseen config as draft
            cached = await client.lifecycle("basic", [])
            assert cached["status"] == "cached"
            assert cached["uuid"] == parent_uuid
            draft = await client.lifecycle("basic", [{"a": 7}])
            assert draft["status"] == "draft"

            # dispatch runs it; the same config then previews as cached
            info = await client.dispatch("basic", [{"a": 7}])
            assert info["parent_uuid"]
            for _ in range(200):
                detail = await client.execution(info["uuid"])
                if detail.get("is_finished"):
                    break
                await asyncio.sleep(0.05)
            assert detail["is_finished"] is True
            after = await client.lifecycle("basic", [{"a": 7}])
            assert after["status"] == "cached"
            assert after["uuid"] == info["parent_uuid"]
        finally:
            await client.aclose()

    asyncio.run(scenario())


def test_console_ui_launch_pad(seeded_app):
    from textual.widgets import DataTable, Static

    from machinable.console.app import ConsoleApp, LaunchScreen, RecordScreen

    app, _parent_uuid, _run_uuid = seeded_app

    async def scenario():
        console = ConsoleApp(
            url="http://console.test",
            transport=httpx.ASGITransport(app=app),
        )
        async with console.run_test(size=(140, 40)) as pilot:
            table = console.screen.query_one("#records", DataTable)
            for _ in range(50):
                if table.row_count:
                    break
                await pilot.pause(0.05)

            # open the launch pad and narrow the module list to `basic`
            await pilot.press("n")
            await pilot.pause()
            assert isinstance(console.screen, LaunchScreen)
            console.screen.query_one("#module-filter").focus()
            await pilot.press(*"basic")
            for _ in range(50):
                if console.screen._module == "basic":
                    break
                await pilot.pause(0.05)
            assert console.screen._module == "basic"

            # a fresh config previews as draft with its resolved config
            console.screen.query_one("#version-line").focus()
            await pilot.press(*"a=9")
            preview = console.screen.query_one("#launch-preview", Static)
            for _ in range(80):
                if "draft" in str(preview.render()):
                    break
                await pilot.pause(0.1)
            rendered = str(preview.render())
            assert "draft" in rendered and '"a": 9' in rendered

            # Enter dispatches and lands on the record's detail screen
            await pilot.press("enter")
            for _ in range(80):
                if isinstance(console.screen, RecordScreen):
                    break
                await pilot.pause(0.1)
            assert isinstance(console.screen, RecordScreen)
            # let the freshly switched-in screen finish mounting before teardown
            await pilot.pause(0.5)

    asyncio.run(scenario())


def test_console_client_provenance_and_call(seeded_app):
    app, parent_uuid, run_uuid = seeded_app

    async def scenario():
        client = _client(app)
        try:
            graph = await client.provenance(parent_uuid)
            assert graph["root"] == parent_uuid
            node_ids = {n["uuid"] for n in graph["nodes"]}
            assert parent_uuid in node_ids and run_uuid in node_ids
            rels = {e["rel"] for e in graph["links"]}
            assert "runs" in rels

            payload = await client.call(parent_uuid, "hello")
            assert payload == "there"
        finally:
            await client.aclose()

    asyncio.run(scenario())


def test_console_ui_provenance_and_call(seeded_app):
    from textual.widgets import RichLog, Tree

    from machinable.console.app import ConsoleApp, RecordScreen

    app, parent_uuid, run_uuid = seeded_app

    async def scenario():
        console = ConsoleApp(
            url="http://console.test",
            transport=httpx.ASGITransport(app=app),
        )
        async with console.run_test(size=(140, 40)) as pilot:
            console.push_screen(RecordScreen(parent_uuid))
            await pilot.pause()
            tree = console.screen.query_one("#provenance-tree", Tree)
            for _ in range(80):
                if tree.root.children:
                    break
                await pilot.pause(0.05)
            # the run hangs off the record via a `runs` edge
            labels = [str(child.label) for child in tree.root.children]
            assert any("(runs) Execution" in label for label in labels)

            # selecting the execution node stays put (runs live in the Runs tab)
            await pilot.pause()
            assert isinstance(console.screen, RecordScreen)

            # a method call renders its returned payload
            call_line = console.screen.query_one("#call-line")
            call_line.focus()
            await pilot.press(*"hello()")
            await pilot.press("enter")
            result = console.screen.query_one("#call-result", RichLog)
            for _ in range(80):
                if result.lines:
                    break
                await pilot.pause(0.05)
            assert result.lines
            await pilot.pause(0.5)

    asyncio.run(scenario())


def test_console_ui_remotes_and_help(seeded_app):
    from textual.widgets import DataTable

    from machinable.console.app import ConsoleApp, HelpScreen, RemotesScreen

    app, _parent_uuid, _run_uuid = seeded_app

    async def scenario():
        console = ConsoleApp(
            url="http://console.test",
            transport=httpx.ASGITransport(app=app),
        )
        async with console.run_test(size=(120, 40)) as pilot:
            await pilot.pause()

            # remotes screen lists the sample project's declared remotes
            await pilot.press("R")
            await pilot.pause()
            assert isinstance(console.screen, RemotesScreen)
            table = console.screen.query_one("#remotes-table", DataTable)
            for _ in range(50):
                if table.row_count:
                    break
                await pilot.pause(0.05)
            assert table.row_count >= 1
            await pilot.press("escape")
            await pilot.pause()

            # help overlay opens and closes
            await pilot.press("question_mark")
            await pilot.pause()
            assert isinstance(console.screen, HelpScreen)
            await pilot.press("escape")
            await pilot.pause()
            assert not isinstance(console.screen, HelpScreen)

    asyncio.run(scenario())


def test_console_client_remotes(seeded_app):
    app, _parent_uuid, _run_uuid = seeded_app

    async def scenario():
        client = _client(app)
        try:
            remotes = await client.remotes()
            assert isinstance(remotes, dict)
        finally:
            await client.aclose()

    asyncio.run(scenario())


def test_parse_call_line():
    from machinable.console.app import parse_call_line

    assert parse_call_line("hello") == ("hello", [], {})
    assert parse_call_line("summary(top=3)") == ("summary", [], {"top": 3})
    assert parse_call_line("fit((0, 1), k=2)") == ("fit", [(0, 1)], {"k": 2})
    with pytest.raises(ValueError):
        parse_call_line("summary(nope=)")


def test_parse_version_line():
    from machinable.console.app import parse_version_line

    assert parse_version_line("") == []
    assert parse_version_line("~sgd lr=0.1") == ["~sgd", {"lr": 0.1}]
    assert parse_version_line("nested.k=2") == [{"nested": {"k": 2}}]


def test_console_client_wraps_transport_errors():
    async def scenario():
        client = ConsoleClient("http://127.0.0.1:1")  # nothing listens here
        try:
            with pytest.raises(ConsoleError):
                await client.health()
        finally:
            await client.aclose()

    asyncio.run(scenario())


def test_console_ui_browse_and_detail(seeded_app):
    from textual.widgets import DataTable, Static

    from machinable.console.app import ConsoleApp, RecordScreen

    app, parent_uuid, _run_uuid = seeded_app

    async def scenario():
        console = ConsoleApp(
            url="http://console.test",
            transport=httpx.ASGITransport(app=app),
        )
        async with console.run_test(size=(120, 40)) as pilot:
            # the records table populates from /v1/interfaces/search
            table = console.screen.query_one("#records", DataTable)
            for _ in range(50):
                if table.row_count:
                    break
                await pilot.pause(0.05)
            assert table.row_count >= 1

            # filtering narrows down to the matching record
            console.screen.query_one("#filter").focus()
            await pilot.press(*"basic")
            await pilot.pause()
            assert table.row_count >= 1
            await pilot.press("enter")  # submit → focus moves to the table

            # open the record detail screen
            await pilot.press("enter")
            for _ in range(50):
                if isinstance(console.screen, RecordScreen):
                    break
                await pilot.pause(0.05)
            assert isinstance(console.screen, RecordScreen)

            # detail loads info + runs
            info = console.screen.query_one("#record-info", Static)
            for _ in range(50):
                if parent_uuid in str(info.render()):
                    break
                await pilot.pause(0.05)
            assert parent_uuid in str(info.render())
            runs_table = console.screen.query_one("#record-runs", DataTable)
            for _ in range(50):
                if runs_table.row_count:
                    break
                await pilot.pause(0.05)
            assert runs_table.row_count >= 1

            # back to the records browser
            await pilot.press("escape")
            await pilot.pause()
            assert not isinstance(console.screen, RecordScreen)

    asyncio.run(scenario())
