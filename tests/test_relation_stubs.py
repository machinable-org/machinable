"""Records of a module that does not import here load as stubs through relations.

One storage and index shared by several projects (a server serving several
package versions): project ``a`` runs ``pipe``, project ``b`` runs ``fit`` and
cannot import ``pipe``, project ``both`` imports both.
"""

import sys

import pytest

from machinable import Index, Interface, Project, Storage
from machinable.errors import NotFound
from machinable.interface import resolve_uses

PIPE = """
from machinable import Interface
from pydantic import BaseModel


class Pipe(Interface):
    class Config(BaseModel):
        seed: int = 0

    def __call__(self):
        self.save_file("sorting.json", {"seed": self.config.seed})
"""

FIT = """
from machinable import Interface
from pydantic import BaseModel


class Fit(Interface):
    class Config(BaseModel):
        k: int = 1

    def __call__(self):
        self.save_file("fit.json", {"k": self.config.k})
"""


@pytest.fixture()
def home(tmp_path):
    for name, files in {
        "a": {"pipe.py": PIPE},
        "b": {"fit.py": FIT},
        "both": {"pipe.py": PIPE, "fit.py": FIT},
    }.items():
        (tmp_path / name).mkdir()
        for filename, source in files.items():
            (tmp_path / name / filename).write_text(source)

    def connect(project: str):
        # a fresh interpreter per project: nothing of another project imported
        for module in ("pipe", "fit"):
            sys.modules.pop(module, None)
        stack = Project(str(tmp_path / project))
        stack.__enter__()
        storage = Storage(str(tmp_path / "storage"))
        storage.__enter__()
        index = Index({"database": str(tmp_path / "index.sqlite")})
        index.__enter__()
        return [index, storage, stack]

    opened: list = []

    def enter(project: str):
        while opened:
            opened.pop(0).__exit__()
        opened.extend(connect(project))

    yield enter
    while opened:
        opened.pop(0).__exit__()
    for module in ("pipe", "fit"):
        sys.modules.pop(module, None)


def _sort(home, seed=1) -> str:
    home("a")
    run = Interface.make("pipe", {"seed": seed}).launch()
    return run.uuid


def _uses(graph) -> list:
    return sorted((e.source, e.target) for e in graph.links if e.rel == "uses")


def test_find_by_id_raises_unless_asked_for_a_stub(home):
    sort = _sort(home)
    home("b")
    with pytest.raises(ModuleNotFoundError):
        Interface.find_by_id(sort)
    with pytest.raises(ModuleNotFoundError):
        Interface.find_by_id(sort, fetch=False)

    for fetch in (True, False):
        stub = Interface.find_by_id(sort, fetch=fetch, stub=True)
        assert type(stub) is Interface
        assert stub.uuid == sort
        assert stub.module == "pipe"
        assert stub.version() == [{"seed": 1}]
        assert stub.config.seed == 1
        assert stub.load_file("sorting.json") == {"seed": 1}
        assert stub.is_mounted()


def test_uses_and_provenance_read_back_where_the_module_does_not_import(home):
    sort = _sort(home)
    home("b")
    fit = Interface.make(
        "fit", {"k": 1}, uses=Interface.find_by_id(sort, stub=True)
    ).launch()
    fit_uuid = fit.uuid

    # a later process of project b
    home("b")
    loaded = Interface.find_by_id(fit_uuid, fetch=False)
    assert loaded.module == "fit"
    used = loaded.uses.all()
    assert [u.uuid for u in used] == [sort]
    assert type(used[0]) is Interface and used[0].module == "pipe"
    assert used[0].config.seed == 1
    assert _uses(loaded.provenance()) == [(fit_uuid, sort)]
    assert sort in {u.uuid for u in loaded.related()}
    # and the inverse, from the stub
    assert [u.uuid for u in used[0].used_by] == [fit_uuid]


def test_unchanged_where_the_module_imports(home):
    sort = _sort(home)
    home("b")
    fit = Interface.make(
        "fit", {"k": 1}, uses=Interface.find_by_id(sort, stub=True)
    ).launch()
    fit_uuid = fit.uuid

    home("both")
    real = Interface.find_by_id(sort)
    assert type(real).__name__ == "Pipe"
    assert type(Interface.find_by_id(sort, stub=True)).__name__ == "Pipe"
    loaded = Interface.find_by_id(fit_uuid, fetch=False)
    assert type(loaded).__name__ == "Fit"
    assert [type(u).__name__ for u in loaded.uses] == ["Pipe"]
    assert _uses(loaded.provenance()) == [(fit_uuid, sort)]


def test_uses_is_not_identity(home):
    # relations are metadata on top of identity (docs/guide/relations.md)
    one, two = _sort(home, 1), _sort(home, 2)
    home("b")
    a = Interface.make("fit", {"k": 1}, uses=resolve_uses([one])).launch()
    b = Interface.make("fit", {"k": 1}, uses=resolve_uses([two])).launch()
    assert a.uuid == b.uuid
    with pytest.raises(NotFound):
        resolve_uses(["nosuchrunid"])


def test_a_run_made_under_another_index_is_found_in_the_storage(home, tmp_path):
    # node A's index made the run; node B has its own index over the same storage
    sort = _sort(home)
    home("b")
    with Index({"database": str(tmp_path / "other.sqlite")}) as other:
        assert other.get_by_id(sort) is None
        assert Interface.find_by_id(sort, stub=True) is None
        (used,) = resolve_uses([sort])
        assert type(used) is Interface and used.uuid == sort
        assert used.module == "pipe" and used.config.seed == 1
        # indexed as a reindex of it would: its run-record came with it
        assert other.get_by_id(sort) is not None
        assert len(used.executions) == 1
        fit = Interface.make("fit", {"k": 1}, uses=used).launch()
        loaded = Interface.find_by_id(fit.uuid, fetch=False)
        assert _uses(loaded.provenance()) == [(fit.uuid, sort)]
        with pytest.raises(NotFound):
            resolve_uses(["nosuchrunid"])
