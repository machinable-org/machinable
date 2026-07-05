"""The console's Textual application: records browser, record detail, live runs.

Every screen reads through :class:`~machinable.console.client.ConsoleClient`;
the app never imports the index or storage, so it can attach to a remote
server exactly like a local one.
"""

from __future__ import annotations

import datetime
import json
from collections.abc import Callable
from typing import Any, cast

from textual.app import App, ComposeResult, SystemCommand
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.screen import ModalScreen, Screen
from textual.widgets import (
    DataTable,
    Footer,
    Header,
    Input,
    Label,
    RichLog,
    Static,
    TabbedContent,
    TabPane,
    Tree,
)

from machinable.console.client import ConsoleClient, ConsoleError


def format_ns(ns: int | None) -> str:
    """ns-since-epoch → local ``YYYY-MM-DD HH:MM:SS`` (empty for None)."""
    if not ns:
        return ""
    moment = datetime.datetime.fromtimestamp(ns / 1e9)  # noqa: DTZ006 - local time
    return moment.strftime("%Y-%m-%d %H:%M:%S")


def config_summary(config: dict, width: int = 60) -> str:
    """One-line ``k=v`` digest of a resolved config for table cells."""
    parts = [f"{k}={v!r}" for k, v in config.items() if not str(k).startswith("_")]
    line = " ".join(parts)
    return line if len(line) <= width else line[: width - 1] + "…"


def run_status(info: dict) -> str:
    """One-word lifecycle status for an ExecutionInfo payload."""
    if info.get("is_active"):
        return "active"
    if info.get("is_finished"):
        return "finished"
    if info.get("is_incomplete"):
        return "incomplete"
    if info.get("is_started"):
        return "started"
    return "pending"


class RecordsScreen(Screen):
    """Home screen: filterable records table plus the active-runs panel."""

    BINDINGS = [
        Binding("enter", "open_record", "Open"),
        Binding("n", "new_run", "Launch"),
        Binding("y", "yank_cli", "Copy CLI"),
        Binding("c", "cancel_run", "Cancel run", show=False),
        Binding("R", "remotes", "Remotes", show=False),
        Binding("r", "refresh", "Refresh"),
        Binding("slash", "focus_filter", "Filter", key_display="/"),
        Binding("escape", "blur_filter", show=False),
    ]

    def __init__(self) -> None:
        super().__init__()
        self._items: list[dict] = []
        self._active: dict[str, dict] = {}
        self._seen_active = False

    @property
    def client(self) -> ConsoleClient:
        return cast("ConsoleApp", self.app).client

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal():
            with Vertical(id="records-pane"):
                yield Input(
                    placeholder="filter records (module, label, id)…", id="filter"
                )
                yield DataTable(id="records")
            with Vertical(id="runs-pane"):
                yield Label("Active runs", id="runs-title")
                yield DataTable(id="runs")
        yield Static(id="statusline")
        yield Footer()

    def on_mount(self) -> None:
        records = self.query_one("#records", DataTable)
        records.cursor_type = "row"
        records.add_columns("id", "module", "kind", "config", "label", "created")
        records.focus()
        runs = self.query_one("#runs", DataTable)
        runs.cursor_type = "row"
        runs.add_columns("run", "module", "status", "heartbeat")
        self.action_refresh()
        self.set_interval(2.0, self._refresh_runs)

    # -- data loading ----------------------------------------------------------

    def action_refresh(self) -> None:
        self.run_worker(self._load(), exclusive=True, group="records")
        self._refresh_runs()

    async def _load(self) -> None:
        try:
            payload = await self.client.search()
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self._items = payload.get("items", [])
        total = payload.get("total", len(self._items))
        self._apply_filter()
        self._status(f"{total} records · {self.client.url}")

    def _apply_filter(self) -> None:
        needle = self.query_one("#filter", Input).value.strip().lower()
        table = self.query_one("#records", DataTable)
        table.clear()
        for item in self._items:
            haystack = " ".join(
                str(item.get(key) or "") for key in ("id", "module", "kind", "label")
            ).lower()
            if needle and needle not in haystack:
                continue
            table.add_row(
                item["id"][:8],
                item.get("module") or "",
                item.get("kind", ""),
                config_summary(item.get("config", {})),
                item.get("label") or "",
                format_ns(item.get("created_at_ns")),
                key=item["id"],
            )

    def _refresh_runs(self) -> None:
        self.run_worker(self._load_runs(), exclusive=True, group="runs")

    async def _load_runs(self) -> None:
        try:
            active = await self.client.executions(active=True, limit=50)
        except ConsoleError:
            return  # the records load already surfaces connection problems
        current = {info["uuid"]: info for info in active}
        if self._seen_active:
            for uuid, info in self._active.items():
                if uuid not in current:
                    self.run_worker(
                        self._notify_run_ended(uuid, info), group="run-ended"
                    )
        self._active = current
        self._seen_active = True
        table = self.query_one("#runs", DataTable)
        table.clear()
        for info in active:
            table.add_row(
                info.get("nickname") or info["uuid"][:8],
                info.get("module") or "",
                run_status(info),
                (info.get("heartbeat_at") or "")[-8:],
                key=info["uuid"],
            )

    async def _notify_run_ended(self, uuid: str, info: dict) -> None:
        name = info.get("nickname") or uuid[:8]
        try:
            detail = await self.client.execution(uuid)
        except ConsoleError:
            self.notify(f"{name} is no longer active", severity="warning")
            return
        state = run_status(detail)
        severity = "information" if state == "finished" else "warning"
        self.notify(f"{name} {state}", severity=severity)

    def _status(self, message: str) -> None:
        self.query_one("#statusline", Static).update(message)

    # -- interactions ----------------------------------------------------------

    def on_input_changed(self, event: Input.Changed) -> None:
        if event.input.id == "filter":
            self._apply_filter()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        if event.input.id == "filter":
            self.query_one("#records", DataTable).focus()

    def action_focus_filter(self) -> None:
        self.query_one("#filter", Input).focus()

    def action_blur_filter(self) -> None:
        self.query_one("#records", DataTable).focus()

    def action_new_run(self) -> None:
        self.app.push_screen(LaunchScreen())

    def action_remotes(self) -> None:
        self.app.push_screen(RemotesScreen())

    def _selected_key(self, table_id: str) -> str | None:
        table = self.query_one(f"#{table_id}", DataTable)
        if table.row_count and table.cursor_row is not None:
            return table.coordinate_to_cell_key(table.cursor_coordinate).row_key.value
        return None

    def action_yank_cli(self) -> None:
        uuid = self._selected_key("records")
        if uuid:
            self.run_worker(self._yank(uuid), exclusive=True, group="yank")

    async def _yank(self, uuid: str) -> None:
        try:
            info = await self.client.interface(uuid)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self.app.copy_to_clipboard(f"machinable {info.get('cli', '')}")
        self.notify("Reproduction command copied")

    def action_cancel_run(self) -> None:
        uuid = self._selected_key("runs")
        if uuid:
            self.run_worker(self._cancel(uuid), exclusive=True, group="cancel")

    async def _cancel(self, uuid: str) -> None:
        try:
            await self.client.cancel(uuid)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self.notify(f"Cancel requested for {uuid[:8]}")

    def action_open_record(self) -> None:
        table = self.query_one("#records", DataTable)
        if table.has_focus and table.cursor_row is not None and table.row_count:
            row_key = table.coordinate_to_cell_key(table.cursor_coordinate).row_key
            if row_key.value:
                self.app.push_screen(RecordScreen(row_key.value))

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        if event.row_key.value is None:
            return
        if event.data_table.id == "records":
            self.app.push_screen(RecordScreen(event.row_key.value))
        elif event.data_table.id == "runs":
            run = self._active.get(event.row_key.value)
            if run and run.get("parent_uuid"):
                self.app.push_screen(RecordScreen(run["parent_uuid"]))


def parse_version_line(line: str) -> list:
    """Parse a CLI-grammar version line (``~sgd lr=0.1``) to a compact version.

    Reuses the CLI parser, so the console and ``machinable`` accept the exact
    same syntax.
    """
    import shlex

    from machinable.cli import from_cli

    version = from_cli(shlex.split(line))
    return list(version) if isinstance(version, (list, tuple)) else [version]


def parse_call_line(line: str) -> tuple[str, list, dict]:
    """Parse ``method(args)`` into (name, args, kwargs), CLI grammar.

    Splits with the shared :func:`machinable.config.match_method` grammar and
    evaluates only the literal argument list (no builtins), mirroring
    ``machinable get … --method(args)``.
    """
    from machinable.config import match_method

    line = line.strip()
    if not line.endswith(")"):
        return line, [], {}
    matched = match_method(line)
    if matched is None:
        raise ValueError(f"Invalid method call: {line}")
    name, call_args = matched

    def collect(*args: Any, **kwargs: Any) -> tuple[list, dict]:
        return list(args), dict(kwargs)

    try:
        args, kwargs = eval(  # noqa: S307 - literals only, no builtins
            "__collect__(" + (call_args or "") + ")",
            {"__collect__": collect, "__builtins__": {}},
        )
    except Exception as ex:  # noqa: BLE001 - surface as one UI error
        raise ValueError(f"Invalid arguments in {line}: {ex}") from ex
    return name, args, kwargs


def provenance_label(info: dict, rel: str | None) -> str:
    """Tree label for a provenance graph node."""
    kind = info.get("kind", "?")
    attrs = info.get("attributes") or {}
    name = info.get("module") or (info.get("uuid") or "")[:8]
    if kind == "Execution":
        name = attrs.get("nickname") or name
    extra = ""
    if kind == "Manifest":
        for entry in attrs.get("entries") or []:
            token = entry.get("token") or {}
            if isinstance(token, dict) and token.get("commit"):
                extra = f" {token['commit'][:8]}"
                if token.get("dirty"):
                    extra += " (dirty)"
                break
    prefix = f"({rel}) " if rel else ""
    return f"{prefix}{kind}: {name}{extra}"


class LaunchScreen(Screen):
    """Configure a run and see, before launching, whether it already exists."""

    BINDINGS = [
        Binding("escape", "back", "Back"),
        Binding("ctrl+l", "launch", "Launch"),
    ]

    def __init__(self) -> None:
        super().__init__()
        self._modules: list[dict] = []
        self._module: str | None = None
        self._version: list = []
        self._lifecycle: dict = {}
        self._valid = False

    @property
    def client(self) -> ConsoleClient:
        return cast("ConsoleApp", self.app).client

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal():
            with Vertical(id="launch-modules-pane"):
                yield Input(placeholder="filter modules…", id="module-filter")
                yield DataTable(id="launch-modules")
            with Vertical(id="launch-config-pane"):
                yield Static(id="launch-schema")
                yield Input(
                    placeholder="version, e.g. ~sgd lr=0.1 nested.k=2",
                    id="version-line",
                )
                yield Static(id="launch-preview")
        yield Static(id="launch-status")
        yield Footer()

    def on_mount(self) -> None:
        table = self.query_one("#launch-modules", DataTable)
        table.cursor_type = "row"
        table.add_columns("module", "kind")
        table.focus()
        self.run_worker(self._load_modules(), exclusive=True, group="modules")

    def action_back(self) -> None:
        self.app.pop_screen()

    # -- module list -----------------------------------------------------------

    async def _load_modules(self) -> None:
        try:
            self._modules = await self.client.modules()
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self._apply_module_filter()

    def _apply_module_filter(self) -> None:
        needle = self.query_one("#module-filter", Input).value.strip().lower()
        table = self.query_one("#launch-modules", DataTable)
        table.clear()
        for item in self._modules:
            if needle and needle not in item["module"].lower():
                continue
            table.add_row(item["module"], item.get("kind", ""), key=item["module"])

    def on_data_table_row_highlighted(self, event: DataTable.RowHighlighted) -> None:
        if event.data_table.id == "launch-modules" and event.row_key.value:
            self._select_module(event.row_key.value)

    def _select_module(self, module: str) -> None:
        if module == self._module:
            return
        self._module = module
        self.run_worker(self._load_schema(module), exclusive=True, group="schema")
        self._schedule_preview()

    async def _load_schema(self, module: str) -> None:
        try:
            schema = await self.client.module_schema(module)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        lines = [f"[b]{module}[/b]"]
        if schema.get("doc"):
            lines.append(schema["doc"].strip().splitlines()[0])
        fields = schema.get("config_fields") or []
        if fields:
            lines.append("")
            lines.append("[b]Config[/b]")
            for field in fields:
                default = (
                    "(required)" if field["required"] else f"= {field['default']!r}"
                )
                lines.append(f"  {field['name']}: {field['type']} {default}")
        methods = schema.get("version_methods") or []
        if methods:
            lines.append("")
            lines.append("[b]~versions[/b]")
            for method in methods:
                doc = (method.get("doc") or "").strip().splitlines()
                suffix = f"  {doc[0]}" if doc else ""
                lines.append(
                    f"  ~{method['name']}{method.get('signature', '')}{suffix}"
                )
        self.query_one("#launch-schema", Static).update("\n".join(lines))

    # -- live identity preview ---------------------------------------------------

    def on_input_changed(self, event: Input.Changed) -> None:
        if event.input.id == "module-filter":
            self._apply_module_filter()
        elif event.input.id == "version-line":
            self._schedule_preview()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        if event.input.id == "version-line":
            self.action_launch()

    def _schedule_preview(self) -> None:
        # exclusive worker + initial sleep = debounce while typing
        self.run_worker(self._preview(), exclusive=True, group="preview")

    async def _preview(self) -> None:
        import asyncio

        await asyncio.sleep(0.3)
        self._valid = False
        if self._module is None:
            return
        preview = self.query_one("#launch-preview", Static)
        line = self.query_one("#version-line", Input).value
        try:
            self._version = parse_version_line(line)
        except ValueError as ex:
            preview.update(f"[red]Invalid version line: {ex}[/red]")
            return
        try:
            resolved = await self.client.resolve(self._module, self._version)
            self._lifecycle = await self.client.lifecycle(self._module, self._version)
        except ConsoleError as ex:
            preview.update(f"[red]{ex}[/red]")
            return
        self._valid = True
        status = self._lifecycle.get("status", "draft")
        badge = {
            "draft": "[green]draft[/green] — launching runs it",
            "cached": "[cyan]cached[/cyan] — launching opens the existing record",
            "running": "[yellow]running[/yellow] — a run is already active",
            "failed": "[red]failed[/red] — launching retries it",
        }.get(status, status)
        preview.update(
            "\n".join(
                [
                    badge,
                    f"reproduce: machinable {resolved.get('cli', '')}",
                    "",
                    json.dumps(resolved.get("config", {}), indent=2, default=str),
                ]
            )
        )
        self._status("ctrl+l or Enter to launch")

    # -- launch ------------------------------------------------------------------

    def action_launch(self) -> None:
        if not self._valid or self._module is None:
            self._status("Nothing to launch yet: pick a module and a valid version")
            return
        if self._lifecycle.get("status") == "cached" and self._lifecycle.get("uuid"):
            self.app.switch_screen(RecordScreen(self._lifecycle["uuid"]))
            return
        self.run_worker(self._dispatch(), exclusive=True, group="dispatch")

    async def _dispatch(self) -> None:
        assert self._module is not None
        try:
            info = await self.client.dispatch(self._module, self._version)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self.notify(f"Dispatched {info.get('nickname') or info['uuid'][:8]}")
        self.app.switch_screen(RecordScreen(info["parent_uuid"]))

    def _status(self, message: str) -> None:
        self.query_one("#launch-status", Static).update(message)


class RecordScreen(Screen):
    """One record: overview/config, run history with output follow, files."""

    BINDINGS = [
        Binding("escape", "back", "Back"),
        Binding("r", "refresh", "Refresh"),
        Binding("y", "yank_cli", "Copy CLI"),
        Binding("c", "cancel_run", "Cancel run"),
    ]

    def __init__(self, uuid: str) -> None:
        super().__init__()
        self._uuid = uuid
        self._info: dict = {}
        self._runs: list[dict] = []
        self._followed: str | None = None

    @property
    def client(self) -> ConsoleClient:
        return cast("ConsoleApp", self.app).client

    def compose(self) -> ComposeResult:
        yield Header()
        with TabbedContent(initial="overview"):
            with TabPane("Overview", id="overview"):
                yield Static(id="record-info")
            with TabPane("Runs", id="runs-tab"):
                yield DataTable(id="record-runs", cursor_type="row")
                yield RichLog(id="run-output", wrap=True, highlight=True)
            with TabPane("Files", id="files-tab"):
                yield DataTable(id="record-files", cursor_type="row")
                yield RichLog(id="file-preview", wrap=True, highlight=True)
            with TabPane("Provenance", id="provenance-tab"):
                yield Tree("provenance", id="provenance-tree")
            with TabPane("Call", id="call-tab"):
                yield Input(placeholder="method, e.g. summary(top=3)", id="call-line")
                yield RichLog(id="call-result", wrap=True, highlight=True)
        yield Static(id="detail-status")
        yield Footer()

    def on_mount(self) -> None:
        runs = self.query_one("#record-runs", DataTable)
        runs.cursor_type = "row"
        runs.add_columns("run", "status", "seed", "nickname")
        files = self.query_one("#record-files", DataTable)
        files.cursor_type = "row"
        files.add_columns("path")
        self.action_refresh()
        self.set_interval(1.0, self._poll_output)

    def action_back(self) -> None:
        self.app.pop_screen()

    def action_refresh(self) -> None:
        self.run_worker(self._load(), exclusive=True, group="detail")

    async def _load(self) -> None:
        try:
            self._info = await self.client.interface(self._uuid)
            self._runs = await self.client.interface_executions(self._uuid)
            file_paths = await self.client.files(self._uuid)
            graph = await self.client.provenance(self._uuid)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self._build_provenance(graph)

        info = self._info
        lines = [
            f"[b]{info.get('module') or info.get('kind')}[/b]  {self._uuid}",
            "",
            f"kind:      {info.get('kind')}",
            f"cached:    {info.get('cached')}",
            f"created:   {info.get('created_at', '')}",
            f"label:     {info.get('label') or ''}",
            f"reproduce: machinable {info.get('cli', '')}",
            "",
            "[b]Config[/b]",
            json.dumps(info.get("config", {}), indent=2, default=str),
        ]
        self.query_one("#record-info", Static).update("\n".join(lines))

        runs = self.query_one("#record-runs", DataTable)
        runs.clear()
        for run in self._runs:
            runs.add_row(
                run["uuid"][:8],
                run_status(run),
                str(run.get("seed", "")),
                run.get("nickname", ""),
                key=run["uuid"],
            )
        if self._runs and self._followed is None:
            self._follow(self._runs[0]["uuid"])

        files = self.query_one("#record-files", DataTable)
        files.clear()
        for path in file_paths:
            files.add_row(path, key=path)

        self._status(f"{len(self._runs)} runs · {len(file_paths)} files")

    # -- provenance --------------------------------------------------------------

    def _build_provenance(self, graph: dict) -> None:
        tree = self.query_one("#provenance-tree", Tree)
        tree.clear()
        nodes = {n["uuid"]: n for n in graph.get("nodes", [])}
        children: dict[str, list[tuple[str, str]]] = {}
        for edge in graph.get("links", []):
            children.setdefault(edge["source"], []).append(
                (edge["rel"], edge["target"])
            )
        root_id = graph.get("root") or self._uuid
        tree.root.set_label(provenance_label(nodes.get(root_id, {}), None))
        tree.root.data = nodes.get(root_id, {})

        def attach(parent, uuid: str, seen: frozenset) -> None:
            for rel, target in children.get(uuid, []):
                info = nodes.get(target, {})
                node = parent.add(provenance_label(info, rel), data=info)
                if target not in seen:  # a DAG may share subtrees; walk each once
                    attach(node, target, seen | {target})

        attach(tree.root, root_id, frozenset({root_id}))
        tree.root.expand_all()

    def on_tree_node_selected(self, event: Tree.NodeSelected) -> None:
        info = event.node.data or {}
        uuid = info.get("uuid")
        if not uuid or uuid == self._uuid:
            return
        if info.get("kind") == "Execution":
            self.notify("Runs are shown in the record's Runs tab")
            return
        self.app.push_screen(RecordScreen(uuid))

    # -- method calls --------------------------------------------------------------

    def on_input_submitted(self, event: Input.Submitted) -> None:
        if event.input.id == "call-line" and event.value.strip():
            self.run_worker(self._call(event.value), exclusive=True, group="call")

    async def _call(self, line: str) -> None:
        log = self.query_one("#call-result", RichLog)
        try:
            name, args, kwargs = parse_call_line(line)
        except ValueError as ex:
            log.clear()
            log.write(str(ex))
            return
        try:
            payload = await self.client.call(self._uuid, name, args, kwargs)
        except ConsoleError as ex:
            log.clear()
            log.write(str(ex))
            return
        log.clear()
        if (
            isinstance(payload, list)
            and payload
            and all(isinstance(row, dict) for row in payload)
        ):
            from rich.table import Table

            columns = list(payload[0].keys())
            table = Table(*[str(c) for c in columns])
            for row in payload:
                table.add_row(*[str(row.get(c, "")) for c in columns])
            log.write(table)
        elif isinstance(payload, str):
            log.write(payload)
        else:
            log.write(json.dumps(payload, indent=2, default=str))
        cli = self._info.get("cli", "")
        self._status(f"CLI equivalent: machinable {cli} --{line.strip()}")

    # -- output follow ---------------------------------------------------------

    def _follow(self, uuid: str) -> None:
        self._followed = uuid
        log = self.query_one("#run-output", RichLog)
        log.clear()
        self.run_worker(self._render_output(), exclusive=True, group="output")

    def _poll_output(self) -> None:
        followed = next((r for r in self._runs if r["uuid"] == self._followed), None)
        if followed and followed.get("is_active"):
            self.run_worker(self._render_output(), exclusive=True, group="output")

    async def _render_output(self) -> None:
        if self._followed is None:
            return
        try:
            output = await self.client.output(self._followed)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        log = self.query_one("#run-output", RichLog)
        log.clear()
        log.write(output if output is not None else "(no output yet)")

    # -- interactions ----------------------------------------------------------

    def on_data_table_row_selected(self, event: DataTable.RowSelected) -> None:
        key = event.row_key.value
        if key is None:
            return
        if event.data_table.id == "record-runs":
            self._follow(key)
        elif event.data_table.id == "record-files":
            self.run_worker(self._preview(key), exclusive=True, group="preview")

    async def _preview(self, path: str) -> None:
        try:
            content = await self.client.read_file(self._uuid, path)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        log = self.query_one("#file-preview", RichLog)
        log.clear()
        if not isinstance(content, str):
            content = json.dumps(content, indent=2, default=str)
        log.write(content[:20_000])

    def action_yank_cli(self) -> None:
        cli = self._info.get("cli")
        if cli:
            self.app.copy_to_clipboard(f"machinable {cli}")
            self.notify("Reproduction command copied")

    def action_cancel_run(self) -> None:
        if self._followed is not None:
            self.run_worker(self._cancel(self._followed), group="cancel")

    async def _cancel(self, uuid: str) -> None:
        try:
            await self.client.cancel(uuid)
        except ConsoleError as ex:
            self._status(str(ex))
            return
        self.notify(f"Cancel requested for {uuid[:8]}")

    def _status(self, message: str) -> None:
        self.query_one("#detail-status", Static).update(message)


class RemotesScreen(Screen):
    """Declared remote modules: URLs the project imports code from."""

    BINDINGS = [Binding("escape", "back", "Back")]

    @property
    def client(self) -> ConsoleClient:
        return cast("ConsoleApp", self.app).client

    def compose(self) -> ComposeResult:
        yield Header()
        yield Static(
            "Remotes execute arbitrary code on import. Inspect before running: "
            "machinable fetch <module>",
            id="remotes-warning",
        )
        yield DataTable(id="remotes-table")
        yield Static(id="remotes-status")
        yield Footer()

    def on_mount(self) -> None:
        table = self.query_one("#remotes-table", DataTable)
        table.cursor_type = "row"
        table.add_columns("module", "source")
        self.run_worker(self._load(), exclusive=True, group="remotes")

    async def _load(self) -> None:
        try:
            remotes = await self.client.remotes()
        except ConsoleError as ex:
            self.query_one("#remotes-status", Static).update(str(ex))
            return
        table = self.query_one("#remotes-table", DataTable)
        for module, source in sorted(remotes.items()):
            url = source[0] if isinstance(source, list) else source
            table.add_row(module, url, key=module)
        if not remotes:
            self.query_one("#remotes-status", Static).update("(no remotes declared)")

    def action_back(self) -> None:
        self.app.pop_screen()


HELP = """[b]machinable console[/b]

[b]Records[/b]          enter open · n launch · y copy CLI · / filter · r refresh
[b]Active runs[/b]      enter open parent · c cancel
[b]Record detail[/b]    tabs: Overview / Runs / Files / Provenance / Call
                 enter follow run or preview file · y copy CLI · c cancel run
[b]Launch pad[/b]       type a version like the CLI (~sgd lr=0.1) · enter launch
[b]Everywhere[/b]       R remotes · ctrl+p palette · ? help · escape back · q quit
"""


class HelpScreen(ModalScreen):
    """Key reference overlay; any dismiss key closes it."""

    BINDINGS = [
        Binding("escape", "close", show=False),
        Binding("question_mark", "close", show=False),
        Binding("q", "close", show=False),
    ]

    def compose(self) -> ComposeResult:
        yield Static(HELP, id="help")

    def action_close(self) -> None:
        self.app.pop_screen()


class ConsoleApp(App):
    """machinable console: drive a machinable API server from the terminal."""

    TITLE = "machinable console"
    CSS = """
    #records-pane { width: 3fr; }
    #runs-pane { width: 1fr; min-width: 32; border-left: solid $primary 30%; }
    #runs-title { padding: 0 1; color: $text-muted; }
    #statusline, #detail-status { height: 1; padding: 0 1; color: $text-muted; }
    #filter { margin: 0 0 1 0; }
    #run-output, #file-preview, #call-result {
        height: 1fr; border-top: solid $primary 30%;
    }
    #provenance-tree { height: 1fr; }
    #record-runs, #record-files { max-height: 40%; }
    #record-info { padding: 1 2; }
    #launch-modules-pane { width: 1fr; min-width: 32; }
    #launch-config-pane { width: 2fr; border-left: solid $primary 30%; padding: 0 1; }
    #launch-schema { height: auto; max-height: 40%; overflow-y: auto; }
    #launch-preview { height: 1fr; overflow-y: auto; margin-top: 1; }
    #version-line { margin-top: 1; }
    #launch-status { height: 1; padding: 0 1; color: $text-muted; }
    #remotes-warning { padding: 1 2; color: $warning; }
    #remotes-status { height: 1; padding: 0 1; color: $text-muted; }
    HelpScreen { align: center middle; }
    #help {
        padding: 1 2; width: 80; height: auto;
        background: $surface; border: solid $primary;
    }
    """
    BINDINGS = [
        Binding("q", "quit", "Quit"),
        Binding("question_mark", "help", "Help", key_display="?"),
    ]

    def __init__(
        self,
        url: str,
        token: str | None = None,
        on_quit: Callable[[], None] | None = None,
        transport: Any | None = None,
    ) -> None:
        super().__init__()
        # transport override lets tests drive an in-process ASGI app
        self.client = ConsoleClient(url, token=token, transport=transport)
        self._on_quit = on_quit
        self.sub_title = url

    def on_mount(self) -> None:
        self.push_screen(RecordsScreen())

    def action_help(self) -> None:
        if not isinstance(self.screen, HelpScreen):
            self.push_screen(HelpScreen())

    def get_system_commands(self, screen: Screen) -> Any:
        yield from super().get_system_commands(screen)
        yield SystemCommand(
            "Launch run", "Configure and dispatch a run", self._palette_launch
        )
        yield SystemCommand("Remotes", "Declared remote modules", self._palette_remotes)
        yield SystemCommand("Help", "Key reference", self.action_help)

    def _palette_launch(self) -> None:
        self.push_screen(LaunchScreen())

    def _palette_remotes(self) -> None:
        self.push_screen(RemotesScreen())

    async def action_quit(self) -> None:
        if self._on_quit is not None:
            self._on_quit()
        await self.client.aclose()
        self.exit()


def run_console(
    url: str = "http://127.0.0.1:8000",
    token: str | None = None,
    on_quit: Callable[[], None] | None = None,
) -> None:
    """Attach the console to a running machinable API server."""
    ConsoleApp(url=url, token=token, on_quit=on_quit).run()
