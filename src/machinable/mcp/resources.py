"""MCP resources: the context the agent writes against (attached without tool calls).

`guide://authoring` and `examples://` are the teaching set: a handful of current-API,
idiomatic templates.
"""

from __future__ import annotations

import os
import re
from collections.abc import Callable, Iterable
from typing import Any

from machinable.mcp.context import MCPContext
from machinable.mcp.inferences import CATALOG

_TEACHING = os.path.join(os.path.dirname(__file__), "teaching")
_EXAMPLES = (
    "interface",
    "config",
    "execution",
    "axis",
    "aggregate",
    "inference",
    "widget",
    "investigate",
)
# the MIME type each resource is served as, by URI (None: FastMCP infers it)
MIME_TYPES: dict[str, str | None] = {
    "guide://authoring": "text/markdown",
    "widget-sdk://docs": "text/markdown",
    "inferences://catalog": "application/json",
    "examples://{name}": "text/x-python",
    "module://{module}": None,
}


def _read(rel: str) -> str:
    with open(os.path.join(_TEACHING, rel), encoding="utf-8") as handle:
        return handle.read()


def functions(ctx: MCPContext) -> dict[str, Callable[..., Any]]:
    """The MCP's resources by URI (a template's ``{name}`` is an argument).

    What :func:`register_resources` serves; :func:`read` answers one URI.
    """
    found: dict[str, Callable[..., Any]] = {}

    def resource(uri: str):
        def add(fn: Callable[..., Any]) -> Callable[..., Any]:
            found[uri] = fn
            return fn

        return add

    @resource("guide://authoring")
    def guide_authoring() -> str:
        """How to write a machinable interface. Read before writing any code.

        Covers the pydantic Config, compact versions, the quantity/inference
        contracts, and the identity affordances.
        """
        return _read("guide_authoring.md")

    @resource("widget-sdk://docs")
    def widget_sdk() -> str:
        """The widget contract.

        render({model, el}) plus the widget_state/_update/_message model
        protocol.
        """
        return _read("widget_sdk.md")

    @resource("inferences://catalog")
    def inferences_catalog() -> dict:
        """The available inferences.

        Each entry names the atomic shape it requires and the test it runs.
        """
        return CATALOG

    @resource("examples://{name}")
    def example(name: str) -> str:
        """Small, runnable, idiomatic templates.

        interface, config, execution, axis, aggregate, inference, widget, and
        the end-to-end `investigate`.
        """
        if name not in _EXAMPLES:
            return f"# unknown example {name!r}; available: {', '.join(_EXAMPLES)}"
        return _read(os.path.join("examples", f"{name}.py"))

    @resource("module://{module}")
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

    return found


def register_resources(mcp: Any, ctx: MCPContext) -> None:
    """Register every resource of :func:`functions` on the FastMCP server ``mcp``."""
    for uri, fn in functions(ctx).items():
        mime_type = MIME_TYPES.get(uri)
        if mime_type is None:
            mcp.resource(uri)(fn)
        else:
            mcp.resource(uri, mime_type=mime_type)(fn)


def match(uri: str, patterns: Iterable[str]) -> tuple[str, dict[str, str]] | None:
    """The resource pattern ``uri`` names, with its template's arguments."""
    for pattern in patterns:
        names = re.findall(r"\{(\w+)\}", pattern)
        regex = "^" + re.sub(r"\\\{\w+\\\}", "(.+)", re.escape(pattern)) + "$"
        found = re.match(regex, uri)
        if found:
            return pattern, dict(zip(names, found.groups(), strict=True))
    return None


def read(ctx: MCPContext, uri: str) -> Any:
    """The content of the resource ``uri`` (``guide://authoring``, ``examples://axis``).

    Raises ``LookupError`` for a URI no resource serves.
    """
    found = functions(ctx)
    matched = match(uri, found)
    if matched is None:
        raise LookupError(f"No resource {uri!r}; resources: {', '.join(found)}")
    pattern, arguments = matched
    return found[pattern](**arguments)
