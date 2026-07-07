"""Web client: served SDK assets, the demo page, the dev shim, and the
anywidget shell."""

import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient

from machinable.api.app import create_app


def _app(**kwargs):
    from machinable.project import Project

    return create_app(project_dir=Project.get().path(), **kwargs)


def test_widget_sdk_assets_served(tmp_storage):
    with TestClient(_app()) as client:
        js = client.get("/widget-sdk.js")
        assert js.status_code == 200
        assert js.headers["content-type"].startswith("text/javascript")
        # the public surface survives bundling
        assert "createAdapter" in js.text and "render" in js.text

        # conditional requests via ETag
        etag = js.headers["ETag"]
        cached = client.get("/widget-sdk.js", headers={"If-None-Match": etag})
        assert cached.status_code == 304

        css = client.get("/widget-sdk.css")
        assert css.status_code == 200
        assert css.headers["content-type"].startswith("text/css")

        page = client.get("/widget")
        assert page.status_code == 200
        assert "/widget-sdk.js" in page.text


def test_widget_sdk_public_when_token_set(tmp_storage):
    with TestClient(_app(api_token="sekrit")) as client:
        # static code is served without auth, data routes still require it
        assert client.get("/widget-sdk.js").status_code == 200
        assert client.get("/widget-sdk.css").status_code == 200
        assert client.get("/widget").status_code == 200
        assert client.get("/v1/health").status_code == 401


def test_widget_sdk_dev_shim(tmp_storage):
    with TestClient(_app(sdk_dev="http://localhost:5173")) as client:
        shim = client.get("/widget-sdk.js")
        assert shim.status_code == 200
        assert '"http://localhost:5173/@vite/client"' in shim.text
        assert 'from "http://localhost:5173/src/main.ts"' in shim.text
        assert shim.headers["Cache-Control"] == "no-store"

        css = client.get("/widget-sdk.css")
        assert "dev server" in css.text  # empty sheet, never the stale build


def test_server_is_the_web_client_widget(tmp_storage):
    from machinable.server import Server
    from machinable.widget import is_widget, widget_css, widget_esm

    assert is_widget(Server)
    esm = widget_esm(Server)
    assert esm and "render" in esm
    assert widget_css(Server)

    # displaying a remote handle renders the run browser against it
    handle = Server({"url": "http://cluster:8000", "api_token": "t"})
    assert handle.widget_state() == {
        "url": "http://cluster:8000",
        "token": "t",
        "view": "list",
    }


def test_interface_and_collection_widget_views(tmp_storage):
    pytest.importorskip("anywidget")
    from machinable import Interface
    from machinable.server import Server

    # the connected Server is the handle every widget renders against
    with Server({"url": "http://x:1"}) as server:
        assert Server.get() is server

        # `.widget()` on an interface → the ItemView, targeted by module + version
        view = Interface.instance("dummy", {"a": 5}).widget()
        assert view.url == "http://x:1"
        assert view.view == "item"
        assert view.target == "dummy"
        assert view.version == [{"a": 5}]
        assert "render" in view._esm

        # `.widget()` on a collection → the run browser (ListView)
        listing = Interface.instance("dummy").all().widget()
        assert listing.view == "list"
        assert not hasattr(listing, "target")

        # a remote handle has nothing to start
        with pytest.raises(RuntimeError):
            server.start()


def test_kernel_embedded_server(tmp_storage):
    pytest.importorskip("uvicorn")
    import httpx

    from machinable import get
    from machinable.server import Server

    # a record created with the notebook's AMBIENT connections (the tmp
    # Storage/Index of this test context) …
    run = get("basic").launch()

    with Server({"port": 0, "log_level": "warning", "console": False}) as server:
        url = server.start()
        assert url.startswith("http://127.0.0.1:")
        assert server.running and server.url == url
        health = httpx.get(f"{url}/v1/health", timeout=5)
        assert health.status_code == 200

        # … is visible through the in-process server: requests re-enter the
        # caller's ambient Storage/Index instead of the project defaults
        found = httpx.post(
            f"{url}/v1/interfaces/search", json={"module": "basic"}, timeout=5
        ).json()
        assert any(item["id"] == run.uuid for item in found["items"])

        # start() is idempotent while running
        assert server.start() == url
        server.stop()
        assert not server.running


def test_display_protocol_renders_web_client(tmp_storage):
    pytest.importorskip("anywidget")
    pytest.importorskip("uvicorn")
    from machinable import Interface
    from machinable.server import Server

    # no Server connected: display connects a kernel-local default …
    assert not Server.connected()
    try:
        # `display(interface)` / a bare interface at cell end → the ItemView
        bundle = Interface.instance("dummy", {"a": 1})._repr_mimebundle_()
        assert bundle is not None
        data = bundle[0] if isinstance(bundle, tuple) else bundle
        assert "application/vnd.jupyter.widget-view+json" in data

        # … which is now the session's connected singleton
        server = Server.get()
        assert server.running

        # `display(collection)` → the run browser against the same server
        bundle = Interface.instance("dummy").all()._repr_mimebundle_()
        data = bundle[0] if isinstance(bundle, tuple) else bundle
        assert "application/vnd.jupyter.widget-view+json" in data
        assert Server.get() is server
    finally:
        # unwind the auto-connected default so other tests start clean
        server = Server.get()
        server.stop()
        server.__exit__(None, None, None)
