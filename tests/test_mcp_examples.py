"""What the MCP and the guides teach has to run: examples, scaffolds, snippets."""

import ast
import re
import shutil
from pathlib import Path

import pytest

from machinable import Index, Project, Storage, get
from machinable.mcp import prompts, resources
from machinable.mcp.context import MCPContext

_IMPORTS = "from pydantic import BaseModel\n\nfrom machinable import Interface, get"


def _classes(source: str) -> dict[str, str]:
    """Each top-level class of ``source`` as a module of its own (shared imports)."""
    tree = ast.parse(source)
    imports = "\n".join(
        ast.get_source_segment(source, n)
        for n in tree.body
        if isinstance(n, (ast.Import, ast.ImportFrom))
    )
    imports = _IMPORTS + "\n" + imports  # guide snippets leave the imports out
    return {
        n.name: imports + "\n\n\n" + ast.get_source_segment(source, n) + "\n"
        for n in tree.body
        if isinstance(n, ast.ClassDef)
    }


def _python_blocks(markdown: str) -> list[tuple[str | None, str]]:
    """(``[filename]``, code) of every python fence of a markdown document."""
    return [
        (name, code)
        for name, code in re.findall(
            r"^```python(?: \[(.+?)\])?\n(.*?)^```", markdown, re.M | re.S
        )
    ]


def _project(tmp_path, modules: dict[str, str]) -> str:
    project = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project",
        project,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite", "__pycache__"),
    )
    for name, source in modules.items():
        path = project / f"{name}.py"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(source)
    return str(project)


def _connected(project: str, tmp_path):
    return (
        Project(project),
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
    )


def _investigate_modules() -> dict[str, str]:
    modules = _classes(
        resources.read(MCPContext(project_dir="."), "examples://investigate")
    )
    return {
        "train": modules["Train"],
        "optimizers": modules["Optimizers"],
        "outperforms_example": modules["Outperforms"],
    }


def test_the_investigate_example_runs_end_to_end(tmp_path):
    project = _project(tmp_path, _investigate_modules())
    one, two, three = _connected(project, tmp_path)
    with one, two, three:
        a, b = get("optimizers", ["~sgd"]), get("optimizers", ["~adam"])
        # the arm is in the aggregate's config and reaches the members it launches
        assert a.config.optimizer == "sgd" and b.config.optimizer == "adam"
        assert b.config.lr == 1e-3
        a.launch()
        b.launch()
        members = a.interfaces
        assert len(members) == 10 and all(m.cached() for m in members)
        assert {m.config.optimizer for m in members} == {"sgd"}
        assert {m.config.optimizer for m in b.interfaces} == {"adam"}

        losses = [m.loss() for m in members]
        assert len(losses) == 10 and all(0.1 <= x <= 0.12 for x in losses)

        for module in ("outperforms_example", "machinable.mcp.inferences.outperforms"):
            verdict = (
                get(module, {"quantity": "loss", "tail": "less"})
                .of(get("optimizers", ["~sgd"]), get("optimizers", ["~adam"]))
                .launch()
                .verdict()
            )
            assert verdict["holds"] is True


def test_the_aggregate_example_resolves_and_launches(tmp_path):
    modules = _classes(
        resources.read(MCPContext(project_dir="."), "examples://aggregate")
    )
    train = _investigate_modules()["train"]
    project = _project(tmp_path, {"optimizers": modules["Optimizers"], "train": train})
    one, two, three = _connected(project, tmp_path)
    with one, two, three:
        for arm in ("sgd", "adam"):
            agg = get("optimizers", [f"~{arm}"])
            assert agg.config.optimizer == arm
        agg = get("optimizers", ["~adam", {"seeds": 2}])
        agg.launch()
        assert {m.config.optimizer for m in agg.interfaces} == {"adam"}
        assert len(agg.interfaces) == 2


def test_the_scaffold_aggregate_prompt_resolves_its_versions(tmp_path):
    ctx = MCPContext(project_dir=".")
    text = prompts.functions(ctx)["scaffold_aggregate"]("my_sweep", "sgd,adam")
    (code,) = re.findall(r"```python\n(.*?)```", text, re.S)
    train = _investigate_modules()["train"]
    project = _project(tmp_path, {"my_sweep": code, "train": train})
    one, two, three = _connected(project, tmp_path)
    with one, two, three:
        for arm in ("sgd", "adam"):
            assert get("my_sweep", [f"~{arm}"]).config.optimizer == arm
        agg = get("my_sweep", ["~adam", {"seeds": 2}])
        agg.launch()
        assert [m.config.optimizer for m in agg.interfaces] == ["adam", "adam"]


@pytest.mark.parametrize(
    "path",
    [
        "docs/guide/advanced-execution.md",
        "docs/mcp/workflow.md",
        "docs/guide/putting-it-all-together.md",
        "src/machinable/mcp/teaching/guide_authoring.md",
    ],
)
def test_the_guide_aggregates_resolve_their_versions(tmp_path, path):
    """Every `Optimizers` aggregate a guide teaches sets only fields its Config has."""
    blocks = [
        code
        for _, code in _python_blocks(Path(path).read_text(encoding="utf-8"))
        if "class Optimizers(Interface)" in code
    ]
    assert blocks, path
    train = _investigate_modules()["train"]
    project = _project(
        tmp_path, {"optimizers": _classes(blocks[0])["Optimizers"], "train": train}
    )
    one, two, three = _connected(project, tmp_path)
    with one, two, three:
        for arm in ("sgd", "adam"):
            agg = get("optimizers", [f"~{arm}", {"seeds": 2}])
            assert agg.config.optimizer == arm
        agg.launch()
        assert {m.config.optimizer for m in agg.interfaces} == {"adam"}
