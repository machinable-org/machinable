"""Plain-config records: the rules, the plain writer's vectors, working copies.

See plans/plain-config-records.md and docs/design/format.md ("Plain writer").
"""

import json
import os
import sys
import textwrap

import pytest

from machinable import (
    Data,
    Execution,
    Index,
    Interface,
    PlainConfig,
    Project,
    Scope,
    Storage,
    get,
)
from machinable.corpus import PLAIN_MODULES, plain_record_vectors
from machinable.errors import IndexCollision, MachinableError
from machinable.plain import PlainConfigError, plain_record, project_root

# ------------------------------------------------------------------ fixtures


def _write_modules(directory, sources: dict[str, str]) -> None:
    for module, source in sources.items():
        if module.endswith(".py"):
            path = os.path.join(directory, *module.split("/"))
        else:
            path = os.path.join(directory, *module.split(".")) + ".py"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(source)


def _forget_modules(sources) -> None:
    for module in sources:
        name = module.removesuffix("/__init__.py").replace("/", ".")
        for loaded in [m for m in sys.modules if m == name or m.startswith(name)]:
            sys.modules.pop(loaded, None)


@pytest.fixture()
def home(tmp_path):
    """Connect project ``name`` (with the vectors' modules) over one storage/index."""
    stacks = []

    def connect(name: str, *, username: str = "corpus", modules=None):
        directory = tmp_path / "projects" / name
        directory.mkdir(parents=True, exist_ok=True)
        _write_modules(directory, {**PLAIN_MODULES, **(modules or {})})
        _forget_modules({**PLAIN_MODULES, **(modules or {})})
        project = Project(str(directory), username=username)
        storage = Storage(str(tmp_path / "storage"))
        index = Index({"database": str(tmp_path / "index.sqlite")})
        for context in (project, storage, index):
            context.__enter__()
        stacks.append((project, storage, index))
        return project

    yield connect
    while stacks:
        for context in reversed(stacks.pop()):
            context.__exit__()
    _forget_modules(PLAIN_MODULES)


def _module(home, name: str, source: str, project: str = "study") -> type:
    """Define interface module ``name`` in a connected project; its class."""
    home(project, modules={name: textwrap.dedent(source)})
    from machinable.project import import_interface

    return import_interface(Project.get().path(), name)


PLAIN = """
from machinable import Interface, PlainConfig


class Plain(Interface):
    class Config(PlainConfig):
        a: float
        b: str
"""

# --------------------------------------------------------- class-level rules


def _define(body: str, base: str = "Interface", config: str = "a: float"):
    """Define an interface class with a PlainConfig Config and ``body``."""
    namespace = {
        "Interface": Interface,
        "Data": Data,
        "PlainConfig": PlainConfig,
    }
    source = textwrap.dedent(
        f"""
        class Thing({base}):
            class Config(PlainConfig):
                {config}
        """
    ) + textwrap.indent(textwrap.dedent(body), "    ")
    exec(source, namespace)  # noqa: S102 - the class definition under test
    return namespace["Thing"]


@pytest.mark.parametrize(
    "hook",
    [
        "on_before_configure(self, config)",
        "on_configure(self)",
        "on_after_configure(self)",
        "on_instantiate(self)",
        "on_compute_predicate(self)",
        "on_before_materialize(self)",
        "on_materialize(self)",
        "on_after_materialize(self)",
        "on_commit(self)",
        "compute_predicate(self)",
        "catalog_identity_key(self)",
    ],
)
def test_overriding_a_hook_fails_at_class_definition(hook):
    name = hook.partition("(")[0]
    with pytest.raises(PlainConfigError, match=f"{name} not overridden"):
        _define(f"def {hook}:\n    return {{}}\n")


def test_overriding_parent_fails_at_class_definition():
    with pytest.raises(PlainConfigError, match="parent not overridden"):
        _define("@property\ndef parent(self):\n    return None\n", base="Data")


def test_a_hook_overridden_in_a_base_class_counts():
    class Base(Interface):
        def on_configure(self):
            pass

    with pytest.raises(PlainConfigError, match="on_configure"):

        class Thing(Base):
            class Config(PlainConfig):
                a: float


def test_config_method_fails_at_class_definition():
    with pytest.raises(PlainConfigError, match="no config methods"):
        _define("def config_twice(self, x):\n    return 2 * x\n")


@pytest.mark.parametrize(
    "field, rule",
    [
        ("a: float = 1.0", "no defaults"),
        ("a: list[int] = Field(default_factory=list)", "no defaults"),
        ("a: str | None = None", "no defaults"),
        ("a: str = Field(alias='b')", "no aliases"),
        ("a: str = Field(validation_alias='b')", "no aliases"),
        ("a: str = Field(exclude=True)", "no exclusion"),
        ("a: str = MField(identifying=False)", "every field identifying"),
        ("a: tuple[int, int]", "JSON types"),
        ("a: set[int]", "JSON types"),
        ("a: Any", "JSON types"),
        ("a: datetime.datetime", "JSON types"),
        ("a: dict[int, str]", "JSON types"),
        ("a: Sub", "JSON types"),
    ],
)
def test_field_rules_fail_at_class_definition(field, rule):
    import datetime  # noqa: F401 - used by the exec'd source
    from typing import Any  # noqa: F401

    from pydantic import BaseModel, Field  # noqa: F401

    from machinable import Field as MField  # noqa: F401

    class Sub(BaseModel):  # noqa: F841 - a non-plain nested model
        x: int

    with pytest.raises(PlainConfigError, match=rule):
        exec(  # noqa: S102
            f"class Config(PlainConfig):\n    {field}\n",
            {**locals(), **globals()},
        )


def test_non_identifying_field_without_default_fails():
    from machinable import Field

    with pytest.raises(PlainConfigError, match="every field identifying"):

        class Config(PlainConfig):
            uri: str = Field(..., identifying=False)


@pytest.mark.parametrize(
    "decorator, rule",
    [
        (
            "@field_validator('a')\n    @classmethod\n    def v(cls, x):\n"
            "        return x",
            "no validators",
        ),
        (
            "@model_validator(mode='after')\n    def v(self):\n        return self",
            "no validators",
        ),
        (
            "@field_serializer('a')\n    def s(self, x):\n        return x",
            "no serializers",
        ),
        (
            "@computed_field\n    @property\n    def c(self) -> int:\n        return 1",
            "no computed fields",
        ),
    ],
)
def test_validators_and_serializers_fail_at_class_definition(decorator, rule):
    from pydantic import (  # noqa: F401 - used by the exec'd source
        computed_field,
        field_serializer,
        field_validator,
        model_validator,
    )

    with pytest.raises(PlainConfigError, match=rule):
        exec(  # noqa: S102
            f"class Config(PlainConfig):\n    a: int\n    {decorator}\n",
            {**locals(), **globals()},
        )


@pytest.mark.parametrize(
    "setting, rule",
    [
        ("strict=False", "strict"),
        ("strict=True, extra='allow'", "extra=forbid"),
        ("strict=True, extra='forbid', str_to_lower=True", "no transformation"),
    ],
)
def test_model_settings_fail_at_class_definition(setting, rule):
    from pydantic import ConfigDict  # noqa: F401

    with pytest.raises(PlainConfigError, match=rule):
        exec(  # noqa: S102
            "class Config(PlainConfig):\n"
            f"    model_config = ConfigDict({setting})\n"
            "    a: int\n",
            {**locals(), **globals()},
        )


def test_allowed_types_define():
    from typing import Literal

    class Sub(PlainConfig):
        x: int

    class Config(PlainConfig):
        s: str
        i: int
        f: float
        b: bool
        n: None
        o: str | None
        lit: Literal["a", 1, True]
        items: list[dict[str, list[float]]]
        bare: list
        mapping: dict
        sub: Sub
        subs: list[Sub]

    assert set(Config.model_fields) >= {"sub", "subs", "lit"}


def test_data_requires_a_plain_config():
    from pydantic import BaseModel

    with pytest.raises(PlainConfigError, match="Data is plain"):

        class Thing(Data):
            class Config(BaseModel):
                a: int = 1


def test_plain_classes_are_marked():
    assert Data.__plain__ and not Interface.__plain__
    assert _define("pass\n").__plain__
    assert _define("pass\n", base="Data").__plain__

    class NoConfig(Data):
        pass

    assert NoConfig.__plain__


# ---------------------------------------------------------- runtime rules


@pytest.mark.parametrize(
    "version, rule",
    [
        (["~fast"], "no ~version"),
        (["~~sweep"], "no ~~axis"),
        ([{"a": 1.0}, {"b": "x"}], "one mapping"),
    ],
)
def test_version_must_be_one_mapping(home, version, rule):
    _module(home, "plain", PLAIN)
    interface = Interface.make("plain", version)
    with pytest.raises(PlainConfigError, match=rule):
        interface.materialize()


def test_non_strict_value_is_refused(home):
    _module(home, "plain", PLAIN)
    with pytest.raises(PlainConfigError, match="strict JSON types") as info:
        get("plain", {"a": 1, "b": "x"}).materialize()
    assert "1.0, not 1" in str(info.value)
    with pytest.raises(PlainConfigError, match="strict JSON types"):
        get("plain", {"a": 1.0, "b": 2}).materialize()
    with pytest.raises(PlainConfigError, match="strict JSON types"):
        get("plain", {"a": 1.0, "b": "x", "c": 3}).materialize()
    with pytest.raises(PlainConfigError, match="strict JSON types"):
        get("plain", {"a": 1.0}).materialize()


def test_non_finite_float_is_refused(home):
    _module(home, "plain", PLAIN)
    with pytest.raises(PlainConfigError, match="JSON values"):
        get("plain", {"a": float("nan"), "b": "x"}).materialize()


def test_interpolation_and_config_method_lookalikes_are_data(home):
    _module(home, "plain", PLAIN)
    interface = get("plain", {"a": 1.0, "b": "${a} and foo(1) and \\${a}"})
    interface.materialize()
    assert interface.config.b == "${a} and foo(1) and \\${a}"
    model = json.loads(open(interface.local_directory("model.json")).read())
    assert model["config"]["b"] == "${a} and foo(1) and \\${a}"
    reloaded = Interface.find_by_id(interface.uuid)
    assert reloaded.config.b == "${a} and foo(1) and \\${a}"
    assert reloaded.uuid == get("plain", {"a": 1.0, "b": model["config"]["b"]}).uuid


def test_scope_does_not_reach_the_predicate(home):
    _module(home, "plain", PLAIN)
    with Scope({"sweep": 7}):
        made = get("plain", {"a": 2.0, "b": "x"})
        made.materialize()
        assert made.predicate == {}
    assert made.__model__.predicate == {}
    assert made.context == []
    found = get("plain", {"a": 2.0, "b": "x"})
    assert found.uuid == made.uuid


def test_parent_is_the_project_root_with_a_storage_entered(home):
    _module(home, "plain", PLAIN)
    storage = Storage.get()
    storage.ensure_materialized()
    assert storage._entry is not None
    plain = get("plain", {"a": 3.0, "b": "x"}).materialize()
    root = Project.get().ensure_project_root()
    assert plain._resolve_index_entry().parent_id == root.record_id
    # an ordinary interface scopes under the storage entry
    ordinary = Interface().materialize()
    assert ordinary._resolve_index_entry().parent_id == storage._entry.record_id


def test_derived_record_is_refused(home):
    _module(home, "plain", PLAIN)
    ancestor = Interface().materialize()
    with pytest.raises(PlainConfigError, match="not derived"):
        ancestor.derive("plain", {"a": 1.0, "b": "x"}).materialize()


def test_relations_at_creation_are_refused(home):
    _module(home, "plain", PLAIN)
    other = Interface().materialize()
    plain = Interface.make("plain", {"a": 1.0, "b": "x"}, uses=[other])
    with pytest.raises(PlainConfigError, match="no relations at creation"):
        plain.materialize()


def test_other_parent_is_refused(home):
    _module(home, "plain", PLAIN)
    other = Interface().materialize()
    with pytest.raises(PlainConfigError, match="parent is the project root"):
        get("plain", {"a": 1.0, "b": "x"}).materialize(parent_id=other.uuid)


def test_session_module_is_refused(home):
    home("study")

    class Session(Interface):
        class Config(PlainConfig):
            a: float

    with pytest.raises(PlainConfigError, match="importable module"):
        Interface.make(Session, {"a": 1.0}).materialize()


def test_creator_and_time_are_the_writers(home):
    _module(home, "plain", PLAIN)
    plain = get("plain", {"a": 4.0, "b": "x"})
    plain.__model__.created_at_ns = 42
    plain.__model__.created_by = "uploader"
    plain.materialize()
    model = json.loads(open(plain.local_directory("model.json")).read())
    assert (model["created_at_ns"], model["created_by"]) == (42, "uploader")


def test_same_keys_resume_and_other_keys_collide(home, tmp_path):
    _module(home, "plain", PLAIN)
    made = get("plain", {"a": 5.0, "b": "x"})
    made.__model__.created_at_ns = 7
    made.materialize()
    directory = made.local_directory()

    # another index over the same storage resumes the record: same id and birth
    with Index({"database": str(tmp_path / "other.sqlite")}):
        again = get("plain", {"a": 5.0, "b": "x"}).materialize()
        assert again.uuid == made.uuid
        assert again.__model__.created_at_ns == 7

    # a header at the home with other keys is another record
    header = json.loads(open(os.path.join(directory, "id.json")).read())
    header["parent"] = "Pnotthisroot"
    with open(os.path.join(directory, "id.json"), "w") as f:
        json.dump(header, f)
    with Index({"database": str(tmp_path / "third.sqlite")}):
        with pytest.raises(IndexCollision):
            get("plain", {"a": 5.0, "b": "x"}).materialize()


def test_data_is_never_executed(home):
    home("data")
    record = get("captu_data.open_ephys", {"format": "x", "listing": "y"})
    assert isinstance(record, Data)
    with pytest.raises(MachinableError, match="never executed"):
        record.launch()
    with pytest.raises(MachinableError, match="never executed"):
        Execution().add(record)
    assert record.materialize().inherits == (
        "machinable.data",
        "machinable.interface",
    )


def test_data_project_root_matches_a_plain_writer(home):
    project = home("data")
    assert project.name() == "data"
    root = project.ensure_project_root()
    assert root.record_id == project_root("data")["record_id"]
    assert root.identity_key == project_root("data")["identity_key"]
    assert root.predicate_key == project_root("data")["predicate_key"]


# ------------------------------------------------------------------ vectors


def _corpus_vectors() -> list[dict]:
    from machinable.utils import load_file

    from .test_corpus import CORPUS

    path = os.path.join(CORPUS, "plain_records.json")
    if not os.path.isfile(path):
        from machinable.corpus import generate

        generate(CORPUS)
    return load_file(path)["vectors"]


def test_vectors_cover_the_cases():
    vectors = _corpus_vectors()
    assert vectors == json.loads(json.dumps(plain_record_vectors()))
    names = {v["name"] for v in vectors}
    assert names == {"float-heavy", "nested-unicode", "data-record"}
    data = next(v for v in vectors if v["name"] == "data-record")
    assert data["input"]["project"] == "data"
    assert "machinable.data" in data["input"]["inherits"]
    assert data["input"]["artifacts"]


@pytest.mark.parametrize("name", ["float-heavy", "nested-unicode", "data-record"])
def test_python_materialization_reproduces_the_vectors(home, name):
    """Python's record of the same inputs, made by a real PlainConfig module."""
    vector = next(v for v in _corpus_vectors() if v["name"] == name)
    given, expect = vector["input"], vector["expect"]
    home(given["project"], username=given["created_by"])

    interface = get(given["module"], given["config"])
    interface.__model__.created_at_ns = given["created_at_ns"]
    interface.set_label(given["label"])
    interface.materialize()
    for path, content in given["artifacts"].items():
        target = interface.local_directory(path)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, "w", encoding="utf-8", newline="") as f:
            f.write(content)

    assert list(interface.inherits) == given["inherits"]
    assert interface.uuid == expect["record_id"]
    directory = interface.local_directory()
    storage_root = Storage.get().root()
    relative = os.path.relpath(directory, storage_root).replace(os.sep, "/")
    assert relative == expect["home"]

    def read(name: str) -> str:
        with open(os.path.join(directory, name), encoding="utf-8") as f:
            return f.read()

    assert read("id.json") == expect["id_json"]
    assert read("model.json") == expect["model_json"]
    assert read(".machinable") == expect["sentinel"]
    for path, content in given["artifacts"].items():
        assert read(path) == content
    assert not os.path.exists(os.path.join(directory, "dump.p"))


def _write_as_plain_writer(storage_root: str, vector: dict) -> str:
    """Write a record the way a non-Python plain writer does, in its order."""
    given, expect = vector["input"], vector["expect"]
    directory = os.path.join(storage_root, *expect["home"].split("/"))
    files = {
        **given["artifacts"],
        "model.json": expect["model_json"],
        "id.json": expect["id_json"],
        ".machinable": expect["sentinel"],
        "updated_at": "2026-01-01T00:00:00+00:00",
    }
    for name in expect["write_order"]:
        if name.startswith(".catalog/"):
            path = os.path.join(storage_root, *name.split("/"))
            content = expect["catalog_entry"]["content"]
        else:
            path = os.path.join(directory, *name.split("/"))
            content = files[name]
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(content)
    return directory


@pytest.mark.parametrize("name", ["float-heavy", "nested-unicode", "data-record"])
def test_a_record_written_from_the_vectors_reads_and_verifies(home, tmp_path, name):
    """Python takes a plain writer's record as its own: same keys, same id."""
    vector = next(v for v in _corpus_vectors() if v["name"] == name)
    given, expect = vector["input"], vector["expect"]
    home(given["project"], username=given["created_by"])
    storage = Storage.get()
    directory = _write_as_plain_writer(storage.root(), vector)

    index = Index.get()
    Project.get().ensure_project_root()
    index.ingest_directory(directory)
    entry = index.get_by_id(expect["record_id"])
    assert entry is not None
    assert (entry.identity_key, entry.predicate_key, entry.parent_id) == (
        expect["identity_key"],
        expect["predicate_key"],
        expect["parent"],
    )
    assert entry.label == given["label"]
    assert entry.created_by == given["created_by"]
    assert entry.created_at_ns == given["created_at_ns"]

    # the module imports here: its keys recompute to the header's (verify)
    loaded = Interface.find_by_id(expect["record_id"])
    assert type(loaded).__name__ != "Interface"
    assert loaded.catalog_identity_key() == expect["identity_key"]
    assert loaded.predicate_key == expect["predicate_key"]
    assert loaded.config_layers().resolved == given["config"]
    # get() finds the plain writer's record rather than making a second one
    assert get(given["module"], given["config"]).uuid == expect["record_id"]
    assert index.local_directory(expect["record_id"]) == directory
    assert not index.get_by_id(expect["record_id"]).bytes_missing


def test_a_record_written_from_the_vectors_resumes_in_a_fresh_index(home, tmp_path):
    """An index that never saw the record takes its id from its home."""
    vector = next(v for v in _corpus_vectors() if v["name"] == "data-record")
    given, expect = vector["input"], vector["expect"]
    home(given["project"])
    _write_as_plain_writer(Storage.get().root(), vector)
    record = get(given["module"], given["config"]).materialize()
    assert record.uuid == expect["record_id"]
    assert record.__model__.created_at_ns == given["created_at_ns"]


def test_the_catalog_names_a_plain_writers_record(home):
    vector = next(v for v in _corpus_vectors() if v["name"] == "data-record")
    home("data")
    _write_as_plain_writer(Storage.get().root(), vector)
    name = vector["expect"]["catalog_entry"]["name"]
    assert (
        name
        == f".catalog/{vector['input']['created_at_ns']:020d}-"
        + (vector["expect"]["record_id"])
    )
    with open(os.path.join(Storage.get().root(), *name.split("/"))) as f:
        assert f.read() == vector["expect"]["home"]


def test_plain_record_rejects_non_json():
    with pytest.raises(PlainConfigError):
        plain_record(
            project="p",
            module="m",
            config={"x": (1, 2)},
            inherits=[],
            created_at_ns=0,
            created_by=None,
        )


# ------------------------------------------------------------ working copies

READER = """
from machinable import Interface


class Reader(Interface):
    def __call__(self):
        data = self.uses[0]
        path = data.local_directory("Record Node 101", "structure.oebin")
        seen = {"path": path, "oebin": open(path).read()}
        seen["files"] = data.load_file("files.json")
        self.save_file("seen.json", seen)
"""


@pytest.fixture()
def data_record(home, tmp_path):
    """A data record whose home has only its header; its files in a folder."""
    vector = next(v for v in _corpus_vectors() if v["name"] == "data-record")
    given = vector["input"]
    home("data", modules={"reader": READER})
    record = get(given["module"], given["config"]).materialize()
    folder = tmp_path / "on-the-rig" / "2026-10-28_session"
    for path, content in given["artifacts"].items():
        target = folder / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    return record, str(folder), given


def test_a_run_reads_a_used_record_from_its_working_copy(data_record):
    record, folder, given = data_record
    assert not os.path.exists(record.local_directory("files.json"))

    run = Interface.make("reader", uses=[(record, folder)])
    run.launch()

    seen = run.load_file("seen.json")
    assert seen["path"] == os.path.join(folder, "Record Node 101", "structure.oebin")
    assert seen["oebin"] == given["artifacts"]["Record Node 101/structure.oebin"]
    assert seen["files"] == json.loads(given["artifacts"]["files.json"])

    # provenance names the record, never the path; the folder is only read
    with open(os.path.join(run.local_directory(), "related", "metadata.jsonl")) as f:
        log = f.read()
    assert record.uuid in log and folder not in log
    assert not os.path.exists(os.path.join(folder, "related"))
    assert sorted(os.listdir(folder)) == ["Record Node 101", "files.json"]
    # the path is this index's business: its private overlay
    private = Index.get().get_private(run.uuid)
    assert private["machinable.working_copies"] == {record.uuid: folder}

    # a run loaded again (another process) reads the used record there too
    again = Interface.find_by_id(run.uuid)
    (used,) = list(again.uses)
    assert used.local_directory("files.json") == os.path.join(folder, "files.json")


def test_a_working_copy_must_be_a_folder(data_record, tmp_path):
    record, _, _ = data_record
    with pytest.raises(MachinableError, match="not a directory"):
        Interface.make("reader", uses=[(record, str(tmp_path / "nowhere"))])


def test_dispatch_api_takes_working_copies(data_record):
    from fastapi.testclient import TestClient

    from machinable.api.app import create_app

    record, folder, given = data_record
    app = create_app(
        project_dir=Project.get().path(),
        ambient_connections=[
            {
                "target": "machinable.storage",
                "version": [{"directory": Storage.get().root()}],
            },
            {
                "target": "machinable.index",
                "version": [{"database": Index.get().config.database}],
            },
        ],
    )
    with TestClient(app) as client:
        response = client.post(
            "/v1/executions",
            json={
                "interfaces": [
                    {
                        "target": "reader",
                        "uses": [record.uuid],
                        "working_copy": {record.uuid: folder},
                    }
                ]
            },
        )
        assert response.status_code == 200, response.text
        (run_uuid,) = response.json()["interface_uuids"]

        import time

        deadline = time.monotonic() + 30
        run = Interface.find_by_id(run_uuid)
        while run.load_file("seen.json") is None and time.monotonic() < deadline:
            time.sleep(0.05)
        seen = run.load_file("seen.json")
        assert seen is not None
        assert seen["path"].startswith(folder)

        wrong = client.post(
            "/v1/executions",
            json={
                "interfaces": [
                    {"target": "reader", "working_copy": {record.uuid: folder}}
                ]
            },
        )
        assert wrong.status_code in (400, 422), wrong.text
