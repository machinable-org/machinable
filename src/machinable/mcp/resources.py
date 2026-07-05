"""MCP resources: the context the agent writes against (attached without tool calls).

`guide://authoring` and `examples://` are the teaching set: a handful of current-API,
idiomatic templates.
"""

from __future__ import annotations

import os
from typing import Any

from machinable.mcp.context import MCPContext
from machinable.mcp.inferences import CATALOG

_TEACHING = os.path.join(os.path.dirname(__file__), "teaching")
_EXAMPLES = (
    "interface",
    "config",
    "execution",
    "aggregate",
    "inference",
    "widget",
    "investigate",
)


def _read(rel: str) -> str:
    with open(os.path.join(_TEACHING, rel), encoding="utf-8") as handle:
        return handle.read()


def register_resources(mcp: Any, ctx: MCPContext) -> None:
    @mcp.resource("guide://authoring", mime_type="text/markdown")
    def guide_authoring() -> str:
        """How to write a machinable interface. Read before writing any code.

        Covers the pydantic Config, compact versions, the quantity/inference
        contracts, and the identity affordances.
        """
        return _read("guide_authoring.md")

    @mcp.resource("widget-sdk://docs", mime_type="text/markdown")
    def widget_sdk() -> str:
        """The widget contract.

        render({model, el}) plus the widget_state/_update/_message model
        protocol.
        """
        return _read("widget_sdk.md")

    @mcp.resource("inferences://catalog", mime_type="application/json")
    def inferences_catalog() -> dict:
        """The available inferences.

        Each entry names the atomic shape it requires and the test it runs.
        """
        return CATALOG

    @mcp.resource("examples://{name}", mime_type="text/x-python")
    def example(name: str) -> str:
        """Small, runnable, idiomatic templates.

        interface, config, execution, aggregate, inference, widget, and the
        end-to-end `investigate`.
        """
        if name not in _EXAMPLES:
            return f"# unknown example {name!r}; available: {', '.join(_EXAMPLES)}"
        return _read(os.path.join("examples", f"{name}.py"))

    @mcp.resource("module://{module}")
    def module_resource(module: str) -> dict:
        """Resolved schema for a project module.

        Config fields, version vocabulary, widget descriptor, docstring.
        """
        from machinable.api._helpers import module_schema

        with ctx.bind():
            try:
                return module_schema(ctx.project_dir, module).model_dump()
            except Exception as ex:  # noqa: BLE001
                return {"module": module, "error": f"{type(ex).__name__}: {ex}"}
