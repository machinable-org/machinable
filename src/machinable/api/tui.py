"""Textual dashboard for the machinable API server."""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from typing import TYPE_CHECKING

import machinable
from machinable.api._helpers import active_execution_count, list_executions

if TYPE_CHECKING:
    from fastapi import FastAPI


def run_tui(
    *,
    host: str,
    port: int,
    project_dir: str,
    app: FastAPI,
    on_quit: Callable[[], None] | None = None,
) -> None:
    from textual.app import App, ComposeResult
    from textual.binding import Binding
    from textual.containers import Horizontal
    from textual.widgets import Footer, Header, RichLog, Static

    class ApiDashboard(App):
        TITLE = "machinable api"
        BINDINGS = [
            Binding("q", "quit", "Quit"),
            Binding("l", "toggle_log", "Log"),
            Binding("r", "refresh", "Refresh"),
            Binding("?", "help", "Help"),
        ]

        def __init__(self) -> None:
            super().__init__()
            self._host = host
            self._port = port
            self._project_dir = project_dir
            self._app = app
            self._on_quit = on_quit
            self._log_visible = False

        def compose(self) -> ComposeResult:
            yield Header()
            with Horizontal():
                yield Static(id="active-panel")
                yield Static(id="activity-panel")
            yield Static(id="status-bar")
            yield RichLog(id="access-log", wrap=True)
            yield Footer()

        def on_mount(self) -> None:
            self.query_one("#access-log", RichLog).display = False
            self.set_interval(1, self.refresh_view)

        def refresh_view(self) -> None:
            active = list_executions(active=True, limit=20)
            active_lines = ["Active Executions", "─" * 24]
            if not active:
                active_lines.append("(none)")
            for item in active:
                active_lines.append(f"{item.uuid[:8]}  {item.module or 'Execution'}")
                active_lines.append(f"  heartbeat: {item.heartbeat_at or 'n/a'}")
            self.query_one("#active-panel", Static).update("\n".join(active_lines))

            events = list(getattr(self._app.state, "event_log", deque()))
            activity_lines = ["Recent Activity", "─" * 24]
            activity_lines.extend(events[-12:] or ["(no activity yet)"])
            self.query_one("#activity-panel", Static).update("\n".join(activity_lines))

            status = (
                f"Project: {self._project_dir}\n"
                f"Active executions: {active_execution_count()}\n"
                f"Server: http://{self._host}:{self._port}  "
                f"v{machinable.__version__}"
            )
            self.query_one("#status-bar", Static).update(status)

        def action_refresh(self) -> None:
            self.refresh_view()

        def action_toggle_log(self) -> None:
            log = self.query_one("#access-log", RichLog)
            self._log_visible = not self._log_visible
            log.display = self._log_visible
            if self._log_visible:
                log.clear()
                for line in getattr(self._app.state, "event_log", []):
                    log.write(line)

        def action_help(self) -> None:
            self.notify("q quit · r refresh · l access log · Enter row for details")

        def action_quit(self) -> None:  # ty: ignore[invalid-method-override]
            if self._on_quit is not None:
                self._on_quit()
            self.exit()

    ApiDashboard().run()
