"""machinable API server Interface."""

from __future__ import annotations

import os
import sys
import threading
import time
from typing import TYPE_CHECKING

from pydantic import BaseModel

from machinable.interface import Interface

if TYPE_CHECKING:
    from fastapi import FastAPI


class Server(Interface):
    """HTTP/WebSocket API server for the connected project."""

    class Config(BaseModel):
        host: str = "127.0.0.1"
        port: int = 8000
        # attach the terminal console (machinable[console]) to the server:
        # None = auto (attach when installed and running in a terminal),
        # True = required (error when not installed), False = headless.
        console: bool | None = None
        reload: bool = False
        api_token: str | None = None
        log_level: str = "info"
        project: str | None = None
        # roots under which additional projects may be opened per request
        # (?project=…); empty means only the default project is reachable.
        project_roots: list[str] | None = None
        # interpreters that may be launched for process-isolated workers
        # (?python=…); the project's own .venv is always permitted.
        python_allowlist: list[str] | None = None
        # source-editing API: writing project .py files is remote code execution,
        # so it is disabled by default and requires a token when enabled.
        enable_source_api: bool = False
        source_token: str | None = None
        source_base_dir: str | None = None

    def launch(self) -> None:  # ty: ignore[invalid-method-override]
        """Start uvicorn, attaching the terminal console when configured."""
        try:
            import uvicorn
        except ImportError as ex:
            raise ImportError(
                "uvicorn is required to launch the machinable API server. "
                "Install with: pip install 'machinable[api]'"
            ) from ex

        from machinable.api.app import create_app

        project_dir = self.config.project or os.getcwd()
        app = create_app(
            project_dir=project_dir,
            api_token=self.config.api_token,
            project_roots=list(self.config.project_roots or []),
            python_allowlist=list(self.config.python_allowlist or []),
            enable_source_api=self.config.enable_source_api,
            source_token=self.config.source_token,
            source_base_dir=self.config.source_base_dir,
        )

        run_console = None
        interactive = sys.stdout.isatty() and not self.config.reload
        if self.config.console is not False and interactive:
            try:
                from machinable.console import run_console
            except ImportError as ex:
                if self.config.console:  # explicitly requested, so fail loudly
                    raise ImportError(
                        "The machinable console requires textual. "
                        "Install with: pip install 'machinable[console]' "
                        "or launch with console=false."
                    ) from ex
                print(
                    "Running headless; install the terminal console with: "
                    "pip install 'machinable[console]'",
                    file=sys.stderr,
                )
        if run_console is not None:
            self._run_with_console(app, uvicorn, run_console)
            return

        uvicorn.run(
            app,
            host=self.config.host,
            port=self.config.port,
            reload=self.config.reload,
            log_level=self.config.log_level,
        )

    def _run_with_console(self, app: FastAPI, uvicorn, run_console) -> None:
        config = uvicorn.Config(
            app,
            host=self.config.host,
            port=self.config.port,
            log_level=self.config.log_level,
        )
        server = uvicorn.Server(config)
        thread = threading.Thread(target=server.run, daemon=True)
        thread.start()
        # let uvicorn bind before the console's first requests
        while not server.started and thread.is_alive():
            time.sleep(0.05)

        def stop_server() -> None:
            server.should_exit = True

        try:
            run_console(
                url=f"http://{self.config.host}:{self.config.port}",
                token=self.config.api_token,
                on_quit=stop_server,
            )
        finally:
            server.should_exit = True
            thread.join(timeout=5)
