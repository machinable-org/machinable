"""MCP tools: authoring, inference, and widget. Task-shaped, not 1:1 with endpoints.

Each tool runs against the bound project (``ctx.bind()``) and calls machinable's
Python API directly. The inference tools run a reference ``Inference`` over operands
and either return a cached/fresh verdict or the contract ``NotImplementedError`` that
tells the agent which ``<quantity>()`` to write.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

if TYPE_CHECKING:
    from machinable import Inference

from machinable.mcp.context import MCPContext
from machinable.mcp.inferences import CATALOG


def _looks_like_uuid(ref: str) -> bool:
    return isinstance(ref, str) and len(ref) >= 24 and "." not in ref and "/" not in ref


def _resolve_operand(ref: str, version: list | None = None):
    """A reference (module + optional version, or a uuid) → an Interface."""
    import machinable
    from machinable.interface import Interface

    if version is None and _looks_like_uuid(ref):
        found = Interface.find_by_id(ref)
        if found is not None:
            return found
    return machinable.get(ref, version)


def _operand_label(operand) -> str:
    try:
        return operand.to_cli()
    except Exception:  # noqa: BLE001
        return operand.module or "?"


def _run_inference(ctx: MCPContext, module: str, config: dict, operands: list) -> dict:
    """Materialize (dedup by method × operands) and return cached or fresh verdict."""
    import machinable

    inference = cast("Inference", machinable.get(module, config or {})).of(*operands)
    inference.materialize()
    verdict = inference.verdict()
    cached = verdict is not None
    if not cached:
        verdict = inference()
    return {
        "ok": True,
        "cached": cached,
        "verdict": verdict,
        "inference_uuid": inference.uuid,
        "operands": [_operand_label(o) for o in operands],
    }


def _infer_tool(ctx: MCPContext, name: str, config: dict, operand_specs: list) -> dict:
    spec = CATALOG[name]
    with ctx.bind():
        operands = [
            _resolve_operand(s, None) if isinstance(s, str) else _resolve_operand(*s)
            for s in operand_specs
        ]
        if spec["operands"] is not None and len(operands) != spec["operands"]:
            return {
                "ok": False,
                "error": f"{name} expects {spec['operands']} operand(s), "
                f"got {len(operands)}",
            }
        try:
            return _run_inference(ctx, spec["module"], config, operands)
        except NotImplementedError as miss:
            # the design's engine: a precise spec of the accessor to write
            return {"ok": False, "needs": str(miss)}


def register_tools(mcp: Any, ctx: MCPContext) -> None:
    # ---- authoring ----------------------------------------------------------

    @mcp.tool
    def list_modules() -> list[dict]:
        """List the project's interface modules (module, kind, doc, is-widget)."""
        from machinable.api._helpers import discover_project_modules

        with ctx.bind():
            index = discover_project_modules(ctx.project_dir)
        return [m.model_dump() for m in index.modules]

    @mcp.tool
    def get_module(module: str) -> dict:
        """Resolved schema for a module.

        Config fields, version-method vocabulary (``~versions`` with
        signatures/docs), widget descriptor, docstring.
        """
        from machinable.api._helpers import module_schema

        with ctx.bind():
            try:
                return module_schema(ctx.project_dir, module).model_dump()
            except Exception as ex:  # noqa: BLE001 - surface import errors
                return {"module": module, "error": f"{type(ex).__name__}: {ex}"}

    @mcp.tool
    def resolve_config(target: str, version: list | None = None) -> dict:
        """Dry-run a compact version → resolved config + CLI, without materializing."""
        from machinable.api._helpers import resolved_config
        from machinable.interface import Interface

        with ctx.bind():
            try:
                interface = Interface.make(target, version=version or [])
                return {
                    "module": interface.module,
                    "version": interface.version(),
                    "config": resolved_config(interface),
                    "cli": interface.to_cli(),
                    "predicate": interface.predicate,
                }
            except Exception as ex:  # noqa: BLE001
                return {"error": f"{type(ex).__name__}: {ex}"}

    @mcp.tool
    def read_source(path: str) -> str:
        """Read a project source file (path relative to the project root)."""
        return ctx.read_source(path)

    @mcp.tool
    def write_source(path: str, content: str) -> dict:
        """Create/overwrite a source file (token-gated).

        Re-imports the module and
        **returns any import/syntax error** so you can self-correct.
        """
        with ctx.bind():
            error = ctx.write_source(path, content)
        return {"path": path, "ok": error is None, "error": error}

    @mcp.tool
    def move_source(source: str, destination: str) -> dict:
        """Rename/move a source file; re-imports the destination and returns errors."""
        with ctx.bind():
            error = ctx.move_source(source, destination)
        return {"path": destination, "ok": error is None, "error": error}

    @mcp.tool
    def delete_source(path: str) -> dict:
        """Delete a project source file."""
        ctx.delete_source(path)
        return {"path": path, "ok": True}

    @mcp.tool
    def search_interfaces(
        module: str | None = None,
        filters: list[dict] | None = None,
        limit: int = 100,
    ) -> dict:
        """Find materialized interfaces by config. ``filters`` are.

        ``{path, op, value}`` over config fields (e.g. ``{path:"optimizer",
        op:"eq", value:"sgd"}``).
        """
        from machinable.api.models import ConfigFilter, ConfigMatch, FindRequest
        from machinable.index import Index

        config_query = None
        if filters:
            config_query = ConfigMatch(filters=[ConfigFilter(**f) for f in filters])
        req = FindRequest(module=module, config=config_query, limit=limit)
        with ctx.bind():
            entries, total = Index.get().search(req)
            items = [
                {
                    "uuid": e.record_id,
                    "module": e.module,
                    "kind": e.kind,
                    "label": e.label,
                    "config": {
                        k: v
                        for k, v in (e.config.resolved or {}).items()
                        if not str(k).startswith("_")
                    },
                }
                for e in entries
            ]
        return {"items": items, "total": total}

    @mcp.tool
    def create_interface(
        target: str, version: list | None = None, uuid: str | None = None
    ) -> dict:
        """Materialize an interface (idempotent in ``uuid``; content-addressed)."""
        import machinable

        with ctx.bind():
            interface = machinable.get(target, version or [])
            interface.materialize(record_id=uuid)
            return {
                "uuid": interface.uuid,
                "module": interface.module,
                "cli": interface.to_cli(),
            }

    @mcp.tool
    def launch(target: str, version: list | None = None) -> dict:
        """Run an interface and return it with its execution uuid.

        An aggregate's ``launch()`` lays out its grid; dedup is free.
        """
        import machinable

        with ctx.bind():
            interface = machinable.get(target, version or [])
            interface.launch()
            execution = interface.execution if interface.is_materialized() else None
            return {
                "uuid": interface.uuid,
                "module": interface.module,
                "execution_uuid": execution.uuid if execution else None,
            }

    @mcp.tool
    def run_status(uuid: str) -> dict:
        """Lifecycle of a run (started/finished/failed) and its execution."""
        from machinable.interface import Interface

        with ctx.bind():
            interface = Interface.find_by_id(uuid)
            if interface is None:
                return {"uuid": uuid, "error": "not found"}
            execution = interface.execution
            return {
                "uuid": uuid,
                "module": interface.module,
                "cached": interface.cached(),
                "is_started": execution.is_started() if execution else None,
                "is_finished": execution.is_finished() if execution else None,
                "is_live": execution.is_live() if execution else None,
            }

    @mcp.tool
    def call(
        interface: str,
        method: str,
        version: list | None = None,
        args: list | None = None,
        kwargs: dict | None = None,
    ) -> dict:
        """Invoke any method on an interface. The generic compute/RPC hook.

        For example ``get_best``, a ``<quantity>()``, or a domain analysis.
        """
        import machinable
        from machinable.api._helpers import json_payload

        with ctx.bind():
            target = machinable.get(interface, version or [])
            fn = getattr(target, method)
            result = fn(*(args or []), **(kwargs or {}))
            return {"payload": json_payload(result)}

    @mcp.tool
    def provenance(uuid: str, depth: int = 8, rels: str | None = None) -> dict:
        """The provenance graph: how an interface came to be.

        Recipe (config layers, context, derivation) plus history (executions,
        each with the Manifest of code/deps/environment it used), as a
        normalized node-link DAG. ``rels`` is a comma-separated edge-label
        filter (e.g. ``derivation,runs,manifest``).
        """
        from machinable.interface import Interface
        from machinable.provenance import build_provenance_graph

        with ctx.bind():
            interface = Interface.find_by_id(uuid)
            if interface is None:
                return {"uuid": uuid, "error": "not found"}
            rel_set = (
                {r.strip() for r in rels.split(",") if r.strip()} if rels else None
            )
            return build_provenance_graph(
                interface, depth=depth, rels=rel_set
            ).model_dump()

    # ---- inference (the scientific vocabulary) ------------------------------

    @mcp.tool
    def quantity(operand: str, name: str, version: list | None = None) -> dict:
        """Probe an operand's ``<quantity>()`` accessor.

        Returns its value(s) across the operand's cached units, or the
        contract error naming what to implement.
        """
        with ctx.bind():
            op = _resolve_operand(operand, version)
            units = list(op.interfaces.filter(lambda x: x.cached())) or [op]
            try:
                values = [getattr(u, name)() for u in units]
                return {
                    "ok": True,
                    "quantity": name,
                    "values": values,
                    "n_units": len(units),
                }
            except (AttributeError, NotImplementedError) as miss:
                return {
                    "ok": False,
                    "quantity": name,
                    "needs": f"{op.module} has no {name!r} accessor. Implement "
                    f"`def {name}(self)` returning one run's value. ({miss})",
                }

    def _two(a, a_version, b, b_version):
        return [[a, a_version or []], [b, b_version or []]]

    @mcp.tool
    def outperforms(
        a: str,
        b: str,
        a_version: list | None = None,
        b_version: list | None = None,
        quantity: str = "objective",
        test: str = "welch",
        tail: str = "greater",
        alpha: float = 0.05,
    ) -> dict:
        """Is A's ``quantity`` greater than B's? (two-sample test)."""
        return _infer_tool(
            ctx,
            "outperforms",
            {"quantity": quantity, "test": test, "tail": tail, "alpha": alpha},
            _two(a, a_version, b, b_version),
        )

    @mcp.tool
    def differs(
        a: str,
        b: str,
        a_version: list | None = None,
        b_version: list | None = None,
        quantity: str = "objective",
        test: str = "welch",
        alpha: float = 0.05,
    ) -> dict:
        """Do A and B differ on ``quantity``? (two-sided two-sample test)."""
        return _infer_tool(
            ctx,
            "outperforms",
            {"quantity": quantity, "test": test, "tail": "two-sided", "alpha": alpha},
            _two(a, a_version, b, b_version),
        )

    @mcp.tool
    def beats_baseline(
        a: str,
        a_version: list | None = None,
        quantity: str = "objective",
        baseline: float = 0.0,
        tail: str = "greater",
        alpha: float = 0.05,
    ) -> dict:
        """Does A's ``quantity`` beat a fixed ``baseline``? (one-sample t-test)."""
        return _infer_tool(
            ctx,
            "beats_baseline",
            {"quantity": quantity, "baseline": baseline, "tail": tail, "alpha": alpha},
            [[a, a_version or []]],
        )

    @mcp.tool
    def ranks(
        operands: list,
        quantity: str = "objective",
        direction: str = "greater",
        alpha: float = 0.05,
    ) -> dict:
        """Do >=3 operands differ, and how do they rank? (Friedman omnibus).

        Each operand is a ``[module, version]`` or a module string.
        """
        return _infer_tool(
            ctx,
            "ranks",
            {"quantity": quantity, "direction": direction, "alpha": alpha},
            operands,
        )

    @mcp.tool
    def converges_faster(
        a: str,
        b: str,
        a_version: list | None = None,
        b_version: list | None = None,
        quantity: str = "loss_curve",
        summary: str = "auc",
        threshold: float = 0.0,
        test: str = "welch",
        alpha: float = 0.05,
    ) -> dict:
        """Does A's curve reach its target sooner than B's? (series; AUC / steps)."""
        return _infer_tool(
            ctx,
            "converges_faster",
            {
                "quantity": quantity,
                "summary": summary,
                "threshold": threshold,
                "test": test,
                "alpha": alpha,
            },
            _two(a, a_version, b, b_version),
        )

    @mcp.tool
    def infer(inference: str, operands: list, options: dict | None = None) -> dict:
        """Generic escape hatch: run any catalog inference by name.

        Each operand is a ``[module, version]`` or module string; ``options``
        is passed as config.
        """
        if inference not in CATALOG:
            return {
                "ok": False,
                "error": f"unknown inference {inference!r}; known: {sorted(CATALOG)}",
            }
        return _infer_tool(ctx, inference, options or {}, operands)

    # ---- widget -------------------------------------------------------------

    @mcp.tool
    def read_widget_result(interface: str, version: list | None = None) -> dict:
        """The ``widget_state()`` a widget interface produces.

        Structured verification: check your work without a screenshot.
        """
        import machinable

        with ctx.bind():
            target = machinable.get(interface, version or [])
            state = (
                cast("Any", target).widget_state()
                if hasattr(target, "widget_state")
                else None
            )
            return {"module": target.module, "widget_state": state}

    @mcp.tool
    def list_widgets() -> list[dict]:
        """Project modules whose schema carries a widget descriptor."""
        from machinable.api._helpers import discover_project_modules

        with ctx.bind():
            index = discover_project_modules(ctx.project_dir)
        return [m.model_dump() for m in index.modules if m.widget]
