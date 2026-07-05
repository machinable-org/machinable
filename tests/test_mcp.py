import asyncio
import shutil

import pytest

pytest.importorskip("fastmcp")
pytest.importorskip("scipy")

from fastmcp import Client

from machinable.mcp.server import create_server


def _project(tmp_path) -> str:
    proj = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite", "__pycache__"),
    )
    return str(proj)


def _run(server, fn):
    async def main():
        async with Client(server) as client:
            return await fn(client)

    return asyncio.run(main())


def test_server_lists_tools_resources_prompts(tmp_path):
    server = create_server(_project(tmp_path))

    async def fn(c):
        tools = {t.name for t in await c.list_tools()}
        assert {
            "list_modules",
            "get_module",
            "resolve_config",
            "write_source",
            "search_interfaces",
            "launch",
            "outperforms",
            "converges_faster",
            "ranks",
            "infer",
            "quantity",
        } <= tools
        prompts = {p.name for p in await c.list_prompts()}
        assert {"investigate", "scaffold_aggregate", "add_inference"} <= prompts

    _run(server, fn)


def test_get_module_and_resolve_config(tmp_path):
    server = create_server(_project(tmp_path))

    async def fn(c):
        gm = (await c.call_tool("get_module", {"module": "versioned"})).data
        assert set(gm["versions"]) == {"large", "lr"}
        rc = (
            await c.call_tool(
                "resolve_config", {"target": "versioned", "version": ["~large"]}
            )
        ).data
        assert rc["config"]["layers"] == 12
        assert "~large" in rc["cli"]

    _run(server, fn)


def test_write_source_surfaces_import_error(tmp_path):
    server = create_server(_project(tmp_path))

    async def fn(c):
        bad = (
            await c.call_tool("write_source", {"path": "broken.py", "content": "def ("})
        ).data
        assert bad["ok"] is False and bad["error"]

        good = (
            await c.call_tool(
                "write_source",
                {
                    "path": "newmod.py",
                    "content": "from pydantic import BaseModel\n"
                    "from machinable import Interface\n\n\n"
                    "class New(Interface):\n"
                    "    class Config(BaseModel):\n"
                    "        a: int = 1\n",
                },
            )
        ).data
        assert good["ok"] is True and good["error"] is None
        # the new module is now discoverable
        mods = {m["module"] for m in (await c.call_tool("list_modules", {})).data}
        assert "newmod" in mods

    _run(server, fn)


def test_read_only_blocks_writes(tmp_path):
    server = create_server(_project(tmp_path), read_only=True)

    async def fn(c):
        res = await c.call_tool(
            "write_source", {"path": "x.py", "content": "x=1"}, raise_on_error=False
        )
        assert res.is_error  # read-only -> PermissionError surfaced

    _run(server, fn)


def test_inference_end_to_end(tmp_path):
    server = create_server(_project(tmp_path))

    async def fn(c):
        a = {"points": [1.0, 2.0, 3.0]}
        b = {"points": [10.0, 11.0, 12.0]}
        await c.call_tool("launch", {"target": "score_group", "version": [a]})
        await c.call_tool("launch", {"target": "score_group", "version": [b]})

        # quantity probe: collect score() across the aggregate's cached runs
        q = (
            await c.call_tool(
                "quantity",
                {"operand": "score_group", "name": "score", "version": [a]},
            )
        ).data
        assert q["ok"] is True and sorted(q["values"]) == [1.0, 2.0, 3.0]

        # the scientific question -> a verdict
        out = (
            await c.call_tool(
                "outperforms",
                {
                    "a": "score_group",
                    "a_version": [a],
                    "b": "score_group",
                    "b_version": [b],
                    "quantity": "score",
                    "tail": "greater",
                },
            )
        ).data
        assert out["ok"] is True
        assert out["verdict"]["holds"] is False  # mean 2 is not > mean 11
        assert out["cached"] is False
        # re-asking the same question is a cached no-op
        again = (
            await c.call_tool(
                "outperforms",
                {
                    "a": "score_group",
                    "a_version": [a],
                    "b": "score_group",
                    "b_version": [b],
                    "quantity": "score",
                    "tail": "greater",
                },
            )
        ).data
        assert again["cached"] is True

        # the contract: a missing accessor names exactly what to implement
        miss = (
            await c.call_tool(
                "outperforms",
                {
                    "a": "score_group",
                    "a_version": [a],
                    "b": "score_group",
                    "b_version": [b],
                    "quantity": "nonexistent_metric",
                },
            )
        ).data
        assert miss["ok"] is False and "nonexistent_metric" in miss["needs"]

    _run(server, fn)


def test_resources_and_prompts_render(tmp_path):
    server = create_server(_project(tmp_path))

    async def fn(c):
        guide = (await c.read_resource("guide://authoring"))[0].text
        assert "BaseModel" in guide and "version_" in guide
        example = (await c.read_resource("examples://investigate"))[0].text
        assert "Outperforms" in example
        catalog = (await c.read_resource("inferences://catalog"))[0].text
        assert "converges_faster" in catalog

        prompt = await c.get_prompt("investigate", {"hypothesis": "sgd beats adam"})
        text = prompt.messages[0].content.text
        assert "FRAME" in text and "sgd beats adam" in text

    _run(server, fn)
