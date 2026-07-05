import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient

from machinable.api.app import create_app


@pytest.fixture()
def api_client(tmp_storage):
    from machinable.project import Project

    app = create_app(project_dir=Project.get().path())
    with TestClient(app) as client:
        yield client


def test_json_payload_single_encodes_native_values():
    """json_payload must serialize datetime/UUID/BaseModel to native JSON values, not
    double-encode them into quoted strings (regression: default=normjson)."""
    import uuid

    import arrow
    from pydantic import BaseModel

    from machinable.api._helpers import json_payload

    class M(BaseModel):
        x: int

    out = json_payload(
        {
            "when": arrow.get("2026-07-02T12:00:00"),
            "id": uuid.UUID("12345678-1234-5678-1234-567812345678"),
            "model": M(x=7),
        }
    )
    # a real object, not a JSON string
    assert isinstance(out["model"], dict) and out["model"] == {"x": 7}
    # datetime/UUID become plain strings (no embedded quotes from double-encoding)
    assert isinstance(out["when"], str) and not out["when"].startswith('"')
    assert isinstance(out["id"], str) and '"' not in out["id"]
    # a control: the whole structure is JSON-native (re-serializable without a hook)
    import json as _json

    _json.dumps(out)


def test_module_schema_version_methods(api_client):
    schema = api_client.get("/v1/project/versioned").json()
    by_name = {v["name"]: v for v in schema["version_methods"]}
    assert set(by_name) == {"large", "lr"}
    assert by_name["large"]["doc"] == "A large preset."
    assert by_name["lr"]["signature"] in ("(value=0.01)", "(value: float = 0.01)")
    assert set(schema["versions"]) == {"large", "lr"}


def test_resolve_dry_run(api_client):
    resp = api_client.post(
        "/v1/interfaces/resolve",
        json={"target": "versioned", "version": ["~large", {"lr": 0.5}]},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["config"]["layers"] == 12  # from ~large
    assert body["config"]["lr"] == 0.5  # from override
    assert "~large" in body["cli"]
    assert body["version"] == ["~large", {"lr": 0.5}]


def test_interface_info_carries_version_and_cli(api_client):
    created = api_client.post(
        "/v1/interfaces",
        json={"target": "versioned", "version": ["~large"]},
    ).json()
    assert created["version"] == ["~large"]
    assert created["cli"].startswith("versioned") and "~large" in created["cli"]


def test_provenance(api_client):
    uuid = api_client.post(
        "/v1/interfaces", json={"target": "versioned", "version": ["~large"]}
    ).json()["uuid"]
    prov = api_client.get(f"/v1/interfaces/{uuid}/provenance").json()
    # normalized node-link graph rooted at the interface
    assert prov["root"] == uuid
    assert "links" in prov and prov["truncated"] is False
    root = next(n for n in prov["nodes"] if n["uuid"] == uuid)
    # the root's recipe rides in attributes (== extra() + config layers + context)
    assert root["attributes"]["config_layers"]["resolved"]["layers"] == 12


def test_data_status(api_client):
    uuid = api_client.post("/v1/interfaces", json={"target": "view"}).json()["uuid"]
    data = api_client.get(f"/v1/interfaces/{uuid}/data").json()
    assert data["uuid"] == uuid
    assert data["mounted"] is True and data["available"] is True
    assert data["storage_uri"]


def test_related(api_client):
    uuid = api_client.post("/v1/interfaces", json={"target": "view"}).json()["uuid"]
    related = api_client.get(f"/v1/interfaces/{uuid}/related").json()
    assert related["uuid"] == uuid
    assert isinstance(related["related"], list)


def test_archive_excludes_from_search(api_client):
    uuid = api_client.post(
        "/v1/interfaces", json={"target": "view", "version": [{"duration": 7}]}
    ).json()["uuid"]
    found = api_client.post(
        "/v1/interfaces/search",
        json={"config": {"filters": [{"path": "duration", "op": "eq", "value": 7}]}},
    ).json()
    assert uuid in {i["id"] for i in found["items"]}

    assert api_client.post(f"/v1/interfaces/{uuid}/archive").status_code == 200
    gone = api_client.post(
        "/v1/interfaces/search",
        json={"config": {"filters": [{"path": "duration", "op": "eq", "value": 7}]}},
    ).json()
    assert uuid not in {i["id"] for i in gone["items"]}


def test_remotes(api_client):
    resp = api_client.get("/v1/project/remotes")
    assert resp.status_code == 200
    remotes = resp.json()["remotes"]
    # the sample project's provider declares these (the endpoint previously
    # read the base Project instead of the provider and always returned {})
    assert "!hello" in remotes
    assert isinstance(remotes["!multi"], list)
