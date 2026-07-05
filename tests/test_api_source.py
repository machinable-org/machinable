import os

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("aiofiles")
from fastapi.testclient import TestClient

from machinable.api.app import create_app

TOKEN = "s3cr3t"
AUTH = {"Authorization": f"Bearer {TOKEN}"}

WIDGET = (
    "from pydantic import BaseModel\n\n"
    "from machinable import Interface\n\n\n"
    "class Widget(Interface):\n"
    "    class Config(BaseModel):\n"
    "        size: int = 1\n"
)


@pytest.fixture()
def source_client(tmp_storage):
    from machinable.project import Project

    app = create_app(
        project_dir=Project.get().path(),
        enable_source_api=True,
        source_token=TOKEN,
    )
    with TestClient(app) as client:
        yield client


def test_source_disabled_by_default(tmp_storage):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path())
    with TestClient(app) as client:
        assert client.get("/v1/source", headers=AUTH).status_code == 403


def test_source_requires_auth(source_client):
    assert source_client.get("/v1/source").status_code == 401
    bad = source_client.get("/v1/source", headers={"Authorization": "Bearer nope"})
    assert bad.status_code == 401


def test_source_list_and_read_etag(source_client):
    listing = source_client.get("/v1/source", headers=AUTH).json()
    by_path = {f["path"]: f for f in listing["files"]}
    assert "basic.py" in by_path
    assert by_path["basic.py"]["module"] == "basic"

    resp = source_client.get("/v1/source/basic.py", headers=AUTH)
    assert resp.status_code == 200
    payload = resp.json()
    assert "class Basic" in payload["content"]
    assert resp.headers["ETag"].strip('"') == payload["etag"]

    assert source_client.get("/v1/source/missing.py", headers=AUTH).status_code == 404


def test_source_bad_extension_rejected(source_client):
    r = source_client.put("/v1/source/notes.txt", headers=AUTH, json={"content": "x"})
    assert r.status_code == 400


def test_source_path_helpers_confine_and_map(tmp_path):
    from fastapi import HTTPException

    from machinable.api.source import file_to_module, safe_resolve

    base = os.path.realpath(tmp_path)
    assert safe_resolve(base, "a/b.py") == os.path.realpath(
        os.path.join(base, "a", "b.py")
    )
    # paths that escape the base must be rejected
    for bad in ["../x.py", "a/../../x.py", "", "..\\x.py"]:
        with pytest.raises(HTTPException):
            safe_resolve(base, bad)
    # a leading-slash path is treated as relative and stays confined under base
    confined = safe_resolve(base, "/etc/passwd")
    assert confined == base or confined.startswith(base + os.sep)

    assert file_to_module("pkg/mod.py") == "pkg.mod"
    assert file_to_module("pkg/__init__.py") == "pkg"
    assert file_to_module("mod.py") == "mod"


def test_source_create_edit_conditional(source_client):
    created = source_client.put(
        "/v1/source/widget.py", headers=AUTH, json={"content": WIDGET}
    )
    assert created.status_code == 201
    assert created.json()["created"] is True
    etag = created.json()["etag"]

    # create-only: If-None-Match:* fails when the file already exists
    conflict = source_client.put(
        "/v1/source/widget.py",
        headers={**AUTH, "If-None-Match": "*"},
        json={"content": WIDGET},
    )
    assert conflict.status_code == 412

    # stale If-Match → 412
    stale = source_client.put(
        "/v1/source/widget.py",
        headers={**AUTH, "If-Match": '"deadbeef"'},
        json={"content": WIDGET + "# x\n"},
    )
    assert stale.status_code == 412

    # correct If-Match → 200
    ok = source_client.put(
        "/v1/source/widget.py",
        headers={**AUTH, "If-Match": f'"{etag}"'},
        json={"content": WIDGET + "# edit\n"},
    )
    assert ok.status_code == 200

    # the new interface is discoverable (import re-reads from disk)
    modules = {m["module"] for m in source_client.get("/v1/project").json()["modules"]}
    assert "widget" in modules


def test_source_edit_evicts_stale_cache(source_client):
    source_client.put("/v1/source/widget.py", headers=AUTH, json={"content": WIDGET})
    created = source_client.post("/v1/interfaces", json={"target": "widget"})
    assert created.status_code == 200
    uuid = created.json()["uuid"]
    assert any(i["uuid"] == uuid for i in source_client.get("/v1/interfaces").json())

    # editing the source must drop the cached instance built from the old class
    source_client.put(
        "/v1/source/widget.py", headers=AUTH, json={"content": WIDGET + "# v2\n"}
    )
    after = source_client.get("/v1/interfaces").json()
    assert not any(i["uuid"] == uuid for i in after)


def test_source_move_and_delete(source_client):
    source_client.put("/v1/source/tmp_mod.py", headers=AUTH, json={"content": WIDGET})

    moved = source_client.post(
        "/v1/source/move",
        headers=AUTH,
        json={"from": "tmp_mod.py", "to": "renamed_mod.py"},
    )
    assert moved.status_code == 200
    assert moved.json()["module"] == "renamed_mod"
    gone = source_client.get("/v1/source/tmp_mod.py", headers=AUTH)
    assert gone.status_code == 404
    here = source_client.get("/v1/source/renamed_mod.py", headers=AUTH)
    assert here.status_code == 200

    # moving onto an existing file is a conflict
    dup = source_client.post(
        "/v1/source/move",
        headers=AUTH,
        json={"from": "renamed_mod.py", "to": "basic.py"},
    )
    assert dup.status_code == 409

    assert (
        source_client.delete("/v1/source/renamed_mod.py", headers=AUTH).status_code
        == 204
    )
    assert (
        source_client.delete("/v1/source/renamed_mod.py", headers=AUTH).status_code
        == 404
    )
