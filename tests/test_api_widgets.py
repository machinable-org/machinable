import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient

from machinable.api.app import create_app


@pytest.fixture()
def widget_client(tmp_storage):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path())
    with TestClient(app) as client:
        yield client


def test_widget_detection_and_asset_resolution(tmp_storage):
    from machinable import Interface
    from machinable.widget import is_widget, widget_css, widget_esm

    chart = Interface.make("chart")
    assert is_widget(type(chart))
    assert "render" in widget_esm(type(chart))  # inline ESM
    assert widget_css(type(chart)).strip().startswith(".machinable-chart")

    sidebar = Interface.make("sidebar")
    assert "title=" in widget_esm(type(sidebar))  # resolved from sibling .js file

    assert not is_widget(type(Interface.make("basic")))


def test_module_schema_exposes_widget(widget_client):
    schema = widget_client.get("/v1/project/chart").json()
    assert schema["widget"] is not None
    assert schema["widget"]["esm_url"] == "/v1/project/chart/widget/esm"
    assert schema["widget"]["css_url"] == "/v1/project/chart/widget/css"
    assert schema["widget"]["meta"]["defaultSize"] == [400, 300]

    # non-widget interface has no widget descriptor
    assert widget_client.get("/v1/project/basic").json()["widget"] is None

    flagged = {
        m["module"]: m["widget"]
        for m in widget_client.get("/v1/project").json()["modules"]
    }
    assert flagged.get("chart") is True
    assert flagged.get("basic") is False


def test_widget_asset_route(widget_client):
    esm = widget_client.get("/v1/project/chart/widget/esm")
    assert esm.status_code == 200
    assert esm.headers["content-type"].startswith("text/javascript")
    assert "render" in esm.text

    css = widget_client.get("/v1/project/chart/widget/css")
    assert css.status_code == 200
    assert css.headers["content-type"].startswith("text/css")

    # sibling-file ESM is served too
    sidebar = widget_client.get("/v1/project/sidebar/widget/esm")
    assert sidebar.status_code == 200 and "title=" in sidebar.text

    # non-widget module → 404
    assert widget_client.get("/v1/project/basic/widget/esm").status_code == 404


def test_widget_ws_get_and_readonly_set(widget_client):
    with widget_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "chart"})
        ws.receive_json()

        ws.send_json({"type": "widget_get", "id": "g"})
        state = ws.receive_json()
        assert state["type"] == "widget_state"
        assert state["payload"]["state"] == {"value": 42}

        # read-only widget rejects widget_set by default
        ws.send_json({"type": "widget_set", "id": "s", "changes": {"value": 1}})
        err = ws.receive_json()
        assert err["type"] == "error"


def test_widget_ws_mutable_set_and_push(widget_client):
    with widget_client.websocket_connect("/v1/interfaces/ws") as ws:
        ws.send_json({"type": "connect", "target": "sidebar"})
        ws.receive_json()

        ws.send_json({"type": "widget_set", "id": "s", "changes": {"title": "Hello"}})
        change = ws.receive_json()
        assert change["type"] == "widget_change"
        assert change["payload"]["changes"] == {"title": "Hello"}

        # server-originated push: notify() emits a widget_change, then returns —
        # exactly two frames (a widget_change push and the call result).
        ws.send_json({"type": "call", "id": "n", "method": "notify", "kwargs": {}})
        frames = [ws.receive_json() for _ in range(2)]
        by_type = {f["type"]: f for f in frames}
        assert by_type["widget_change"]["payload"]["changes"] == {"title": "pushed"}
        assert by_type["result"]["payload"] == "ok"


def test_widget_repr_mimebundle_in_notebook(tmp_storage):
    pytest.importorskip("anywidget")
    from machinable import Interface

    chart = Interface.make("chart")
    bundle = chart._repr_mimebundle_()
    data = bundle[0] if isinstance(bundle, tuple) else bundle
    assert "application/vnd.jupyter.widget-view+json" in data
