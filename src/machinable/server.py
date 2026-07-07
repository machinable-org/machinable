"""machinable API server Interface.

The ``Server`` doubles as launchpad and connection handle, with ordinary
machinable semantics: ``with Server(...):`` connects it, ``Server.get()``
retrieves the connected instance, and the web client renders against it —
``display(interface)`` in a notebook goes through ``Server.get().view()``.
When its config carries a ``url``, the instance is a handle on a *remote*
server; otherwise :meth:`start` serves in-process (a notebook kernel) and
:meth:`launch` in the foreground (the CLI/terminal path).
"""

from __future__ import annotations

import json
import os
import sys
import threading
import time
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

from pydantic import BaseModel

from machinable.utils import serialize
from machinable.widget import Widget

if TYPE_CHECKING:
    from fastapi import FastAPI

# the docs site publishes the current web-client build (see docs/package.json)
_ASSET_FALLBACK_BASE = "https://machinable.org"


def ensure_web_asset(name: str) -> str | None:
    """Absolute path of a web-client asset, fetching the published build if absent.

    The bundle is not committed: releases ship it inside the wheel, and the
    docs site publishes the current build for repo checkouts — downloaded here
    once on first use, so a git install works without the npm toolchain.
    Returns ``None`` when unavailable (offline); build locally with
    ``npm run build`` in ``web/sdk``.
    """
    path = Path(__file__).resolve().parent / "assets" / name
    if path.is_file():
        return str(path)
    try:
        import urllib.request

        path.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(  # noqa: S310 - fixed https base
            f"{_ASSET_FALLBACK_BASE}/{name}", timeout=10
        ) as response:
            data = response.read()
        path.write_bytes(data)
        return str(path)
    except OSError:
        return None


class Server(Widget):
    """HTTP/WebSocket API server for the connected project."""

    kind = "Server"
    # displaying a Server renders the web client shell against it
    _esm = Path("assets/widget-sdk.js")
    _css = Path("assets/widget-sdk.css")

    class Config(BaseModel):
        # a remote server this instance is a HANDLE on — no local serving;
        # widgets and views render against it
        url: str | None = None
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
        # source API: reading is always served (inspection); WRITING project
        # .py files is remote code execution, so it is disabled by default and
        # requires a token when enabled.
        enable_source_api: bool = False
        source_token: str | None = None
        source_base_dir: str | None = None
        # web-client SDK dev mode (hot reload): a URL of a running Vite dev
        # server, or true to spawn `npm run dev` in web/sdk (dev checkout only).
        sdk_dev: bool | str = False

    @classmethod
    def ensure(cls) -> Server:
        """The connected server, connecting a kernel-local default when none is.

        The zero-setup path behind ``display(interface)``: an in-process
        default (free port, quiet logs) is connected once and reused for the
        session. Connect your own (``with Server(...):`` or
        ``Server(...).__enter__()``) to override.
        """
        connected = cls.connected()
        if connected:
            return connected[-1]
        server = cast(
            "Server",
            cls.make(
                "machinable.server",
                {"port": 0, "log_level": "warning", "console": False},
            ),
        )
        server.__enter__()  # the session's default connection
        return server

    @property
    def url(self) -> str | None:
        """The server's base URL: the remote handle, or the running instance."""
        if self.config.url:
            return str(self.config.url).rstrip("/")
        background = getattr(self, "_background", None)
        if background is not None:
            return background["url"]
        return None

    # ── views (the web client against this server) ─────────────────────────────

    def widget_state(self) -> dict:
        """Displaying a Server renders the web client's run browser on it."""
        return {
            "url": self.url or f"http://{self.config.host}:{self.config.port}",
            "token": self.config.api_token,
            "view": "list",
        }

    def _anywidget_view(self):
        ensure_web_asset("widget-sdk.js")
        ensure_web_asset("widget-sdk.css")
        return super()._anywidget_view()

    def view(
        self,
        *,
        view: str = "list",
        target: str | None = None,
        version: Any = None,
        height: str | None = None,
    ):
        """An anywidget rendering of the web client against this server.

        ``view="item"`` opens one interface (``target`` + compact ``version``);
        ``view="list"`` the run browser. A local instance is started on demand
        (:meth:`start`); a ``url``-configured handle renders remotely.
        """
        try:
            import anywidget
            import traitlets
        except ImportError as ex:
            raise ImportError(
                "Notebook rendering requires anywidget. "
                "Install with: pip install 'machinable[widgets]'"
            ) from ex
        from machinable.widget import widget_css, widget_esm

        ensure_web_asset("widget-sdk.js")
        ensure_web_asset("widget-sdk.css")
        url = self.url or self.start()
        state: dict[str, Any] = {
            "url": url,
            "token": self.config.api_token,
            "view": view,
        }
        if target:
            state["target"] = target
        if version is not None:
            # compact version → plain JSON (OmegaConf nodes etc. normalized)
            state["version"] = json.loads(json.dumps(version, default=serialize))
        if height:
            state["height"] = height

        attrs: dict[str, Any] = {
            "_esm": widget_esm(type(self)) or "",
            "_css": widget_css(type(self)) or "",
        }
        for key, value in state.items():
            attrs[key] = traitlets.Any(value).tag(sync=True)
        view_cls = type("MachinableWebClientView", (anywidget.AnyWidget,), attrs)
        return view_cls()

    @staticmethod
    def _require_uvicorn():
        try:
            import uvicorn
        except ImportError as ex:
            raise ImportError(
                "uvicorn is required to launch the machinable API server. "
                "Install with: pip install 'machinable[api]'"
            ) from ex
        return uvicorn

    @staticmethod
    def _ambient_connections() -> list[dict]:
        """Specs of the caller's connected Storage/Index (re-entered per request).

        An in-process server (a notebook kernel) must see the same records as
        the surrounding code; a terminal launch has no ambient connections and
        yields an empty list.
        """
        from machinable.index import Index
        from machinable.storage import Storage

        specs: list[dict] = []
        for kind in (Storage, Index):
            for element in kind.connected():
                if element.module:
                    specs.append(
                        {"target": element.module, "version": element.version()}
                    )
        return specs

    def _build_app(self, sdk_dev_url: str | None = None) -> FastAPI:
        from machinable.api.app import create_app

        return create_app(
            project_dir=self.config.project or os.getcwd(),
            api_token=self.config.api_token,
            project_roots=list(self.config.project_roots or []),
            python_allowlist=list(self.config.python_allowlist or []),
            enable_source_api=self.config.enable_source_api,
            source_token=self.config.source_token,
            source_base_dir=self.config.source_base_dir,
            sdk_dev=sdk_dev_url,
            ambient_connections=self._ambient_connections(),
        )

    # ── background serving (kernel-embedded / programmatic) ────────────────────

    @property
    def running(self) -> bool:
        """Whether a background server started by :meth:`start` is alive."""
        background = getattr(self, "_background", None)
        return background is not None and background["thread"].is_alive()

    def start(self) -> str:
        """Serve in a daemon thread of this process; returns the base URL.

        Powers ``.widget()`` in notebooks: uvicorn runs inside the kernel (a
        ``port`` of 0 picks a free one) and inherits the caller's ambient
        Storage/Index connections, so the client shows the same records as the
        surrounding code. Idempotent while running; the server dies with the
        process or via :meth:`stop`.
        """
        if self.config.url:
            raise RuntimeError(
                f"This Server is a handle on {self.config.url} — nothing to start"
            )
        if self.running:
            return getattr(self, "_background")["url"]
        uvicorn = self._require_uvicorn()

        app = self._build_app()
        config = uvicorn.Config(
            app,
            host=self.config.host,
            port=self.config.port,
            log_level=self.config.log_level,
        )
        server = uvicorn.Server(config)
        thread = threading.Thread(target=server.run, daemon=True)
        thread.start()
        for _ in range(200):
            if server.started or not thread.is_alive():
                break
            time.sleep(0.05)
        if not server.started:
            raise RuntimeError("The API server failed to start")
        bound = server.servers[0].sockets[0].getsockname()[1]
        url = f"http://{self.config.host}:{bound}"
        self._background = {"server": server, "thread": thread, "url": url}
        return url

    def stop(self) -> None:
        """Stop a background server started by :meth:`start`."""
        background = getattr(self, "_background", None)
        if background is None:
            return
        background["server"].should_exit = True
        background["thread"].join(timeout=5)
        self._background = None

    # ── foreground serving (the CLI/terminal path) ──────────────────────────────

    def launch(self) -> None:  # ty: ignore[invalid-method-override]
        """Start uvicorn, attaching the terminal console when configured."""
        uvicorn = self._require_uvicorn()

        sdk_dev_url: str | None = None
        self._sdk_dev_process = None
        if isinstance(self.config.sdk_dev, str) and self.config.sdk_dev:
            sdk_dev_url = self.config.sdk_dev
        elif self.config.sdk_dev is True:
            sdk_dev_url = self._spawn_sdk_dev_server()

        app = self._build_app(sdk_dev_url)

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
        try:
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
        finally:
            if self._sdk_dev_process is not None:
                self._sdk_dev_process.terminate()

    # 5174: one off vite's default, which is usually taken by another dev server
    def _spawn_sdk_dev_server(self, port: int = 5174) -> str:
        """Start `npm run dev` in web/sdk (dev checkout) and wait for the port.

        When the port already serves the SDK source (an earlier or manually
        started dev server), it is reused instead of spawned again.
        """
        import shutil
        import socket
        import subprocess
        from pathlib import Path

        import machinable

        url = f"http://127.0.0.1:{port}"
        if self._sdk_dev_alive(url):
            print(f"widget-sdk dev server: {url} (reused)", file=sys.stderr)
            return url

        sdk_dir = Path(machinable.__file__).resolve().parents[2] / "web" / "sdk"
        if not (sdk_dir / "package.json").is_file():
            raise FileNotFoundError(
                "sdk_dev=true requires a machinable development checkout "
                f"(web/sdk not found at {sdk_dir}). Point sdk_dev at a running "
                "Vite dev server URL instead."
            )
        npm = shutil.which("npm")
        if npm is None:
            raise FileNotFoundError("sdk_dev=true requires npm on the PATH")
        # --host 127.0.0.1 pins vite to IPv4 so probe/shim/consumers agree
        # (plain `localhost` may resolve to ::1 on Windows)
        self._sdk_dev_process = subprocess.Popen(
            [
                npm,
                "run",
                "dev",
                "--",
                "--port",
                str(port),
                "--strictPort",
                "--host",
                "127.0.0.1",
            ],
            cwd=str(sdk_dir),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        for _ in range(200):  # up to ~20s for the first cold start
            with socket.socket() as probe:
                probe.settimeout(0.1)
                if probe.connect_ex(("127.0.0.1", port)) == 0:
                    break
            if self._sdk_dev_process.poll() is not None:
                raise RuntimeError(
                    "The SDK dev server exited during startup (is port "
                    f"{port} taken by another process?)"
                )
            time.sleep(0.1)
        else:
            self._sdk_dev_process.terminate()
            raise RuntimeError(f"The SDK dev server did not open port {port}")
        print(f"widget-sdk dev server: {url} (hot reload)", file=sys.stderr)
        return url

    @staticmethod
    def _sdk_dev_alive(url: str) -> bool:
        """Whether ``url`` already serves the SDK source (a Vite dev server)."""
        import urllib.error
        import urllib.request

        try:
            with urllib.request.urlopen(f"{url}/src/main.ts", timeout=1) as response:
                return response.status == 200
        except (urllib.error.URLError, OSError, ValueError):
            return False

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
