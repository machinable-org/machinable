import os
import shutil
import sys

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")
from fastapi.testclient import TestClient

from machinable.api.app import create_app
from machinable.api.isolation import (
    is_python_allowed,
    normalize_python,
    resolve_interpreter,
)


class _Req:
    def __init__(self, params=None, headers=None):
        from starlette.datastructures import Headers, QueryParams

        self.query_params = QueryParams(params or {})
        self.headers = Headers(headers or {})


def test_interpreter_resolution_and_security(tmp_path):
    # selector precedence: query → header → None
    assert resolve_interpreter(_Req({"python": "/a"})) == "/a"
    assert resolve_interpreter(_Req(headers={"X-Machinable-Python": "/b"})) == "/b"
    assert resolve_interpreter(_Req()) is None

    gateway = normalize_python(sys.executable)
    proj = str(tmp_path)
    # gateway interpreter always allowed; arbitrary one only via allowlist
    assert is_python_allowed(sys.executable, proj, gateway, [])
    assert not is_python_allowed("/usr/bin/python3", proj, gateway, [])
    assert is_python_allowed("/usr/bin/python3", proj, gateway, ["/usr/bin/python3"])


def test_subprocess_worker_serves_project(tmp_path):
    proj = str(tmp_path / "p")
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )

    app = create_app(project_dir=proj, python_allowlist=[sys.executable])
    # force the subprocess path even though the worker uses the same interpreter
    # (no second venv in CI): make the gateway not recognise sys.executable.
    with TestClient(app) as client:
        app.state.gateway_python = "/nonexistent/python"

        # in-process baseline (no ?python) → no worker, no proxy header
        local = client.get("/v1/project")
        assert local.status_code == 200
        assert "x-machinable-worker" not in {k.lower() for k in local.headers}

        # ?python=<this interpreter> → spawned subprocess worker, proxied response
        resp = client.get(f"/v1/project?python={sys.executable}")
        assert resp.status_code == 200
        assert resp.headers.get("X-Machinable-Worker")  # served by a worker process
        modules = {m["module"] for m in resp.json()["modules"]}
        assert "basic" in modules

        # the worker is registered in the gateway's registry
        assert app.state.workers.listing()
        worker = app.state.workers.listing()[0]
        assert worker["directory"] == proj
        assert os.path.normcase(worker["python"]) == normalize_python(sys.executable)

        # a disallowed interpreter is rejected
        bad = client.get("/v1/project?python=/definitely/not/allowed/python")
        assert bad.status_code == 403
