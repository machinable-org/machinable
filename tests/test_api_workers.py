"""One gateway, several projects, each in its own environment."""

import os
import shutil
import subprocess
import sysconfig
import textwrap
import time

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")
pytest.importorskip("websockets")
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from machinable.api.app import create_app

SAMPLES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "samples", "project")

PROBE = """
import os
import sys

from machinable import Interface, Project


class Probe(Interface):
    def where(self):
        import envmark
        import neighbour

        return {
            "env": envmark.NAME,
            "prefix": sys.prefix,
            "cwd": os.getcwd(),
            "neighbour": neighbour.NAME,
        }

    def claims(self):
        return dict(Project.get().claims or {})
"""

NAP = """
import time

from pydantic import BaseModel

from machinable import Interface


class Nap(Interface):
    class Config(BaseModel):
        seconds: float = 1.0

    def __call__(self):
        end = time.monotonic() + self.config.seconds
        while time.monotonic() < end:
            time.sleep(0.05)
"""

ROUTER = """
from fastapi import APIRouter, WebSocket

import neighbour

router = APIRouter()


@router.get("/info")
def info():
    import envmark

    return {"env": envmark.NAME, "neighbour": neighbour.NAME}


@router.websocket("/bye")
async def bye(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("bye")
    await websocket.close(code=4401, reason="token expired")


@router.websocket("/echo")
async def echo(websocket: WebSocket):
    await websocket.accept()
    while True:
        message = await websocket.receive()
        if message["type"] == "websocket.disconnect":
            return
        if message.get("bytes") is not None:
            await websocket.send_bytes(message["bytes"][::-1])
        else:
            await websocket.send_text(message["text"].upper())
"""


def _make_env(directory, name: str) -> str:
    """A ``.venv`` with its own ``envmark`` on top of this environment."""
    import venv

    venv.EnvBuilder(with_pip=False, symlinks=os.name != "nt").create(directory)
    bindir = "Scripts" if os.name == "nt" else "bin"
    python = os.path.join(
        directory, bindir, "python" + (".exe" if os.name == "nt" else "")
    )
    purelib = subprocess.check_output(
        [python, "-c", "import sysconfig; print(sysconfig.get_paths()['purelib'])"],
        text=True,
    ).strip()
    with open(os.path.join(purelib, "envmark.py"), "w") as f:
        f.write(f"NAME = {name!r}\n")
    # this environment's packages after the env's own (and their .pth files,
    # e.g. an editable machinable), so nothing is downloaded
    ours = sysconfig.get_paths()["purelib"]
    with open(os.path.join(purelib, "zz_machinable_tests.pth"), "w") as f:
        f.write(f"import site; site.addsitedir({ours!r})\n")
    return python


def _make_project(directory, name: str) -> str:
    os.makedirs(os.path.join(directory, "api"))
    with open(os.path.join(directory, "probe.py"), "w") as f:
        f.write(textwrap.dedent(PROBE))
    with open(os.path.join(directory, "nap.py"), "w") as f:
        f.write(textwrap.dedent(NAP))
    # a sibling module imported by name, as a package's modules do
    with open(os.path.join(directory, "neighbour.py"), "w") as f:
        f.write(f"NAME = {name!r}\n")
    with open(os.path.join(directory, "api", "probe.py"), "w") as f:
        f.write(textwrap.dedent(ROUTER))
    for module in ("sidebar.py", "sidebar.widget.js"):
        shutil.copy(os.path.join(SAMPLES, module), directory)
    return _make_env(os.path.join(directory, ".venv"), name)


@pytest.fixture(scope="module")
def root(tmp_path_factory):
    return _make_root(tmp_path_factory.mktemp("workers"))


def _make_root(base):
    root = base / "projects"
    pythons = {}
    try:
        for name in ("alpha", "beta"):
            pythons[name] = _make_project(str(root / name), name)
    except Exception as ex:  # noqa: BLE001
        pytest.skip(f"cannot create a project environment here: {ex}")
    # the gateway's own folder holds a module of the sibling's name, which
    # must not shadow the project's
    home = base / "home"
    home.mkdir()
    (home / "neighbour.py").write_text("NAME = 'gateway'\n")
    return {"root": str(root), "home": str(home), "pythons": pythons}


def _project(root, name):
    return os.path.join(root["root"], name)


def _app(root, **kwargs):
    kwargs.setdefault("project_roots", [root["root"]])
    return create_app(project_dir=root["home"], **kwargs)


@pytest.fixture(scope="module")
def gateway(root):
    # served from a folder with a module of the projects' sibling's name
    with pytest.MonkeyPatch.context() as mp:
        mp.chdir(root["home"])
        with TestClient(_app(root, project_default_python=True)) as client:
            yield client


def _call(client, name, method, headers=None, **params):
    return client.post(
        "/v1/interfaces/call",
        params={"project": name, **params},
        json={"target": "probe", "method": method, "version": [], "meta": {}},
        headers=headers or {},
    )


def test_http_reaches_each_projects_interpreter(root, gateway):
    for name in ("alpha", "beta"):
        project = _project(root, name)
        python = root["pythons"][name]
        resp = _call(gateway, project, "where", python=python)
        assert resp.status_code == 200, resp.text
        assert resp.headers["X-Machinable-Worker"]
        where = resp.json()["payload"]
        assert where["env"] == name
        assert os.path.normcase(where["prefix"]) == os.path.normcase(
            os.path.join(project, ".venv")
        )
        # the worker starts in its project: the sibling is the project's own,
        # not the gateway folder's module of the same name
        assert os.path.normcase(where["cwd"]) == os.path.normcase(project)
        assert where["neighbour"] == name
        # a project's own router imports its sibling at load time
        info = gateway.get(
            "/project/info", params={"project": project, "python": python}
        )
        assert info.json() == {"env": name, "neighbour": name}


def test_project_default_python(root, gateway):
    # the project is named, the interpreter is not: its own .venv serves it
    project = _project(root, "beta")
    resp = gateway.get("/project/info", headers={"X-Machinable-Project": project})
    assert resp.status_code == 200, resp.text
    assert resp.json() == {"env": "beta", "neighbour": "beta"}
    # without the setting, the gateway serves it in-process (no envmark here)
    with TestClient(_app(root)) as plain:
        resp = plain.get("/project/info", headers={"X-Machinable-Project": project})
        assert resp.status_code == 404
        assert "x-machinable-worker" not in {k.lower() for k in resp.headers}
    # a project outside the roots is refused, never given an interpreter
    assert (
        gateway.get("/v1/project", params={"project": root["home"] + "x"}).status_code
        == 403
    )


def test_websockets_reach_the_worker(root, gateway):
    for name in ("alpha", "beta"):
        project = _project(root, name)
        python = root["pythons"][name]
        query = f"project={project}&python={python}"
        with gateway.websocket_connect(f"/v1/interfaces/ws?{query}") as ws:
            ws.send_json({"type": "connect", "id": "c", "target": "probe"})
            assert ws.receive_json()["type"] == "connected"
            ws.send_json({"type": "call", "id": "1", "method": "where"})
            result = ws.receive_json()
            assert result["type"] == "result", result
            assert result["payload"]["env"] == name

    # a widget over the gateway's socket, the interpreter by header
    project = _project(root, "alpha")
    with gateway.websocket_connect(
        "/v1/interfaces/ws",
        headers={
            "X-Machinable-Project": project,
            "X-Machinable-Python": root["pythons"]["alpha"],
        },
    ) as ws:
        ws.send_json({"type": "connect", "id": "c", "target": "sidebar"})
        assert ws.receive_json()["type"] == "connected"
        ws.send_json({"type": "widget_set", "id": "s", "changes": {"title": "Hi"}})
        change = ws.receive_json()
        assert change["type"] == "widget_change"
        assert change["payload"]["changes"] == {"title": "Hi"}
        # a push from the worker, outside a reply
        ws.send_json({"type": "call", "id": "n", "method": "notify", "kwargs": {}})
        frames = {f["type"]: f for f in (ws.receive_json(), ws.receive_json())}
        assert frames["widget_change"]["payload"]["changes"] == {"title": "pushed"}
        assert frames["result"]["payload"] == "ok"

    # text and binary frames both ways (project_default_python picks the env)
    with gateway.websocket_connect(f"/project/echo?project={project}") as ws:
        ws.send_text("hello")
        assert ws.receive_text() == "HELLO"
        ws.send_bytes(b"\x00\x01\x02")
        assert ws.receive_bytes() == b"\x02\x01\x00"

    # the worker's close code reaches the client
    with gateway.websocket_connect(f"/project/bye?project={project}") as ws:
        assert ws.receive_text() == "bye"
        with pytest.raises(WebSocketDisconnect) as closed:
            ws.receive_text()
        assert closed.value.code == 4401

    # an interpreter that is not permitted refuses the upgrade
    with pytest.raises(WebSocketDisconnect) as refused:
        with gateway.websocket_connect(
            f"/v1/interfaces/ws?project={project}&python=/not/allowed/python"
        ) as ws:
            ws.receive_json()
    assert refused.value.code == 1008


def _dispatch(client, project, seconds):
    resp = client.post(
        "/v1/executions",
        params={"project": project},
        json={"interfaces": [{"target": "nap", "version": [{"seconds": seconds}]}]},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["uuid"]


def _until(predicate, timeout=20.0):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        value = predicate()
        if value:
            return value
        time.sleep(0.1)
    raise AssertionError("timed out")


def test_health_counts_a_workers_run(root, gateway):
    project = _project(root, "beta")
    uuid = _dispatch(gateway, project, 3.0)

    def counted():
        health = gateway.get("/v1/health").json()
        return health if health["executions_active"] == 1 else None

    health = _until(counted)
    assert health["active_executions"] == [uuid]
    (beta,) = [w for w in health["workers"] if w["directory"] == project]
    assert beta["responding"] is True
    assert beta["executions_active"] == 1
    assert beta["executions_running"] == 1
    # the gateway itself runs nothing
    assert health["executions_running"] == 0

    _until(
        lambda: (
            not gateway.get(
                f"/v1/executions/{uuid}", params={"project": project}
            ).json()["is_active"]
        )
    )
    assert gateway.get("/v1/health").json()["executions_active"] == 0


def test_oidc_claims_reach_the_worker(root):
    pytest.importorskip("jwt")
    pytest.importorskip("cryptography")
    import jwt
    from cryptography.hazmat.primitives.asymmetric import rsa
    from jwt.algorithms import RSAAlgorithm

    issuer = "https://idp.example"
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    jwk = RSAAlgorithm.to_jwk(key.public_key(), as_dict=True)
    jwk.update(kid="k", use="sig", alg="RS256")

    def fetch(url):
        if url.endswith("/.well-known/openid-configuration"):
            return {"issuer": issuer, "jwks_uri": f"{issuer}/keys"}
        return {"keys": [jwk]}

    now = int(time.time())
    claims = {
        "iss": issuer,
        "aud": "api",
        "sub": "alice-id",
        "iat": now,
        "exp": now + 3600,
        "roles": ["lab", "admin"],
    }
    auth = {
        "Authorization": "Bearer "
        + jwt.encode(claims, key, algorithm="RS256", headers={"kid": "k"})
    }
    app = _app(
        root,
        project_default_python=True,
        oidc_issuer=issuer,
        oidc_audience="api",
        oidc_fetch=fetch,
        oidc_leeway=0,
    )
    project = _project(root, "alpha")
    with TestClient(app) as client:
        # a client cannot claim claims
        spoofed = {**auth, "X-Machinable-Claims": '{"roles": ["root"]}'}
        resp = _call(client, project, "claims", headers=spoofed)
        assert resp.status_code == 200, resp.text
        assert resp.headers["X-Machinable-Worker"]
        assert resp.json()["payload"] == claims
        # and over the gateway's socket
        with client.websocket_connect(
            f"/v1/interfaces/ws?project={project}", headers=auth
        ) as ws:
            ws.send_json({"type": "connect", "id": "c", "target": "probe"})
            assert ws.receive_json()["type"] == "connected"
            ws.send_json({"type": "call", "id": "1", "method": "claims"})
            assert ws.receive_json()["payload"] == claims
        # a proxied socket still ends with its token (4401)
        short = jwt.encode(
            {**claims, "exp": int(time.time()) + 2},
            key,
            algorithm="RS256",
            headers={"kid": "k"},
        )
        with client.websocket_connect(
            f"/v1/interfaces/ws?project={project}",
            headers={"Authorization": f"Bearer {short}"},
        ) as ws:
            ws.send_json({"type": "ping", "id": "p"})
            assert ws.receive_json()["type"] == "pong"
            with pytest.raises(WebSocketDisconnect) as closed:
                ws.receive_json()
            assert closed.value.code == 4401


def test_worker_start_seconds(root):
    from machinable import Interface

    app = _app(root, project_default_python=True, worker_start_seconds=0.01)
    with TestClient(app) as client:
        resp = client.get("/v1/project", params={"project": _project(root, "alpha")})
        assert resp.status_code == 502
        assert "did not become ready in 0.01s" in resp.json()["detail"]
        assert app.state.workers.listing() == []

    server = Interface.make(
        "machinable.server",
        {"worker_start_seconds": 90, "worker_idle_seconds": 600},
    )
    built = server._build_app()
    assert built.state.worker_start_seconds == 90
    assert built.state.worker_idle_seconds == 600
    assert built.state.project_default_python is False


def test_idle_workers_are_reaped_but_not_while_running(root, tmp_path):
    # projects of its own: no worker of another test shares their records
    root = _make_root(tmp_path)
    alpha, beta = _project(root, "alpha"), _project(root, "beta")
    app = _app(root, project_default_python=True, worker_idle_seconds=0.5)
    with TestClient(app) as client:
        first = client.get("/v1/project", params={"project": alpha})
        assert first.status_code == 200
        pid = first.headers["X-Machinable-Worker"]
        uuid = _dispatch(client, beta, 3.0)

        # alpha has nothing to do and ends; beta runs and stays
        _until(lambda: [w["directory"] for w in app.state.workers.listing()] == [beta])
        time.sleep(1.0)
        assert [w["directory"] for w in app.state.workers.listing()] == [beta]
        assert client.get(f"/v1/executions/{uuid}", params={"project": beta}).json()[
            "is_active"
        ]

        # beta ends once its run finished
        _until(lambda: app.state.workers.listing() == [])
        assert client.get(f"/v1/executions/{uuid}", params={"project": beta}).json()[
            "is_finished"
        ]

        # the next request starts alpha again
        again = client.get("/v1/project", params={"project": alpha})
        assert again.status_code == 200
        assert again.headers["X-Machinable-Worker"] != pid
