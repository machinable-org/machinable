import os

from pydantic import BaseModel

from machinable import Execution, Interface, Project, Scope, get
from machinable.collection import InterfaceCollection
from machinable.interface import (
    belongs_to,
    belongs_to_many,
    cachable,
    has_many,
    has_one,
)
from machinable.utils import load_file, random_str


def test_interface_get():
    assert isinstance(get(), Interface)
    assert isinstance(get("machinable.scope"), Scope)
    # extensions
    a = Interface({"a": "a", "one": 1})
    b = get(a, {"a": "b"})
    assert b.config.a == "b"
    assert b.config.one == 1
    assert get(["machinable.interface", {"a": "a"}], [None]).config.a == "a"
    assert get(["machinable.interface", {"a": "a"}], [{"a": "b"}]).config.a == "b"


def test_interface_to_directory(tmp_path):
    Interface().to_directory(str(tmp_path / "test"))
    assert os.path.exists(str(tmp_path / "test" / ".machinable"))
    assert os.path.exists(str(tmp_path / "test" / "model.json"))
    assert not os.path.exists(str(tmp_path / "test" / "related"))

    i = Interface(derived_from=Interface(), uses=[Interface(), Interface()])
    i.materialize()
    i.to_directory(str(tmp_path / "test2"))
    assert load_file(str(tmp_path / "test2" / ".machinable")) == i.uuid
    assert (
        load_file(str(tmp_path / "test2" / "related" / "uses"))
        == "\n".join([u.uuid for u in i.uses]) + "\n"
    )


def test_interface_to_dir_inverse_relations(tmp_storage):
    a = Interface({"slot": "a"}).materialize()
    b = Interface({"slot": "b"}, uses=a).materialize()

    assert a.used_by[0] == b

    def _related(interface, expected):
        x = sorted(
            [
                d
                for d in os.listdir(interface.local_directory("related"))
                if d != "metadata.jsonl"
                and not os.path.isdir(interface.local_directory("related", d))
            ]
        )
        assert x == expected

    _related(b, ["uses"])
    assert b.load_file(["related", "uses"]) == a.uuid + "\n"
    _related(a, ["used_by"])
    assert a.load_file(["related", "used_by"]) == b.uuid + "\n"

    c = b.derive().materialize()

    _related(b, ["derived", "uses"])
    assert b.load_file(["related", "derived"]) == c.uuid + "\n"
    _related(c, ["ancestor"])
    assert c.load_file(["related", "ancestor"]) == b.uuid + "\n"

    d = b.derive().materialize()
    assert b.load_file(["related", "derived"]) == c.uuid + "\n" + d.uuid + "\n"


def test_interface_from_directory(tmp_path):
    i = Interface().to_directory(str(tmp_path / "test"))
    assert Interface.from_directory(str(tmp_path / "test")).uuid == i.uuid


class C(Interface):
    @belongs_to(cached=False)
    def one_b():
        return B

    @belongs_to_many(key="test")
    def many_a():
        return A


class B(Interface):
    @belongs_to
    def one_a():
        return A

    @has_one
    def one_c():
        return C


class A(Interface):
    @has_many(collection=InterfaceCollection)
    def many_b():
        return B

    @has_many(key="test")
    def many_c():
        return C


def test_interface_relations(tmp_storage):
    a1, a2 = A(), A()
    b1, b2 = B(), B()
    c = C()

    a1.materialize()
    assert len(a1.many_b) == 0

    # has many
    a2.push_related("many_b", b1)
    a2.push_related("many_b", b2)
    a2.materialize()
    assert len(a2.many_b) == 2
    assert isinstance(a2.many_b, InterfaceCollection)
    assert b1.one_a == a2
    assert b2.one_a == a2
    a2._relation_cached = {}
    b1._relation_cached = {}
    assert len(a2.many_b) == 2
    assert isinstance(a2.many_b, InterfaceCollection)
    assert b1.one_a == a2
    assert b2.one_a == a2

    # has one
    c.push_related("one_b", b1)
    c.materialize()
    assert c.one_b == b1
    assert c.one_b.one_a == a2
    assert c.one_b.one_c == c

    # many to many
    c1, c2 = C(), C()
    c1.push_related("many_a", a1)
    c1.push_related("many_a", a2)
    c1.materialize()
    c2.push_related("many_a", a1)
    c2.push_related("many_a", a2)
    c2.materialize()
    c1._relation_cached = {}
    c2._relation_cached = {}
    assert len(c1.many_a) == 2
    assert len(c2.many_a) == 2
    a1._relation_cached = {}
    assert {v.uuid for v in a1.many_c} == {c1.uuid, c2.uuid}


def test_interface_related(tmp_storage, tmp_path):
    # a *distinctly named* second project: same-named projects are the same
    # project by design (location-free identity discriminates by name), and
    # this test's intent is relations across two genuinely different projects
    import shutil

    other = tmp_path / "related-project"
    shutil.copytree(
        "tests/samples/project", other, ignore=shutil.ignore_patterns("storage")
    )
    with Project(str(other)) as p:
        i = Interface.make("dummy")
        i.push_related("project", p)
        i.launch()
    assert i.related().all() == [p, i.execution]
    child = i.derive().launch()
    assert i.related().all() == [p, child, i.execution]
    assert child.related().all() == [i, child.execution]

    # transitive closure of reachable nodes, excluding self:
    # {p, child, i.exec, child.exec}
    # (manifest capture is disabled in tests; see conftest._no_manifest_capture)
    assert len(i.related(deep=True)) == 4

    grandchild = Interface(derived_from=child).materialize()
    assert child.derived.all() == [grandchild]
    assert child.related().all() == [grandchild, i, child.execution]
    # now also reaches grandchild
    assert len(i.related(deep=True)) == 5


def test_interface_commit(tmp_storage):
    with Project("./tests/samples/project"):
        Interface.make("interface.dummy").materialize()

    i = Interface()
    assert not i.is_materialized()
    i.materialize()
    assert i.is_materialized()


def tes_interface_save_file(tmp_storage):
    component = Interface().materialize()
    # save and load
    component.save_file("test.txt", "hello")
    assert component.load_file("test.txt") == "hello"
    component.save_file("floaty", 1.0)
    assert component.load_file("floaty") == "1.0"
    uncommitted = Interface()
    uncommitted.save_file("test", "deferred")
    assert uncommitted.load_data("test") == "deferred"


def test_interface_derivatives(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            c: int = 1

    root = Interface().materialize()

    child1 = root.derive(T).materialize()
    child2 = root.derive(T, {"c": 2}).materialize()

    assert child1.ancestor == root
    assert child2.ancestor == root

    assert root.derive(T) == child1
    assert root.derive(T, {"c": 2}) == child2
    assert root.derive(T, {"c": -1}) != child1


def test_interface_modifiers(tmp_storage):
    project = Project("./tests/samples/project").__enter__()

    # a posterity modifier

    # all
    assert len(Interface().all()) == 0
    get("interface.dummy").materialize()
    assert len(Interface().all()) == 0
    assert list(get("interface.dummy").all()) == [get("interface.dummy")]
    get("interface.dummy", {"a": 1}).materialize()
    assert len(Interface().all()) == 0
    assert len(get("interface.dummy").all()) == 1
    assert len(get("interface.dummy", {"a": 1}).all()) == 1

    # new
    assert get("interface.dummy").is_materialized()
    assert get("interface.dummy").new().is_materialized() is False

    assert len(get().all()) == 0

    # a priori modifiers

    # all
    assert len(get.all()) == 2
    with Scope({"unique": True}):
        assert len(get.all()) == 0
        get("interface.dummy").materialize()
        assert len(get.all()) == 1
    assert len(get.all()) == 3

    # new
    assert get.new("interface.dummy").is_materialized() is False

    # hide
    c = get("interface.dummy")
    uid = c.uuid
    assert not c.hidden()
    c.hidden(True)
    assert get("interface.dummy").uuid != uid
    c.hidden(False)
    assert get("interface.dummy").uuid == uid

    project.__exit__()


# def test_symlink_relations(tmp_storage):
#     project = Project("./tests/samples/project").__enter__()

#     component = get("dummy").launch()
#     assert os.path.isfile(
#         component.execution.local_directory("related", component.id, "link")
#     )

#     project.__exit__()


def test_interface_hash(tmp_storage):
    assert Interface().hash is None

    a = Interface().materialize()
    b = Interface({"a": 1}).materialize()

    assert a.hash != b.hash

    c = Interface({"a": 1}).materialize()
    assert b.hash == c.hash


def test_interface_uuid(tmp_storage):
    dummy = Interface().materialize()
    directory = dummy.local_directory()

    # replace uuid with random male-formed string
    model = dummy.load_file("model.json")
    model["uuid"] = new_uuid = random_str(len(model["uuid"]))
    model.pop("created_at_ns", None)
    dummy.save_file("model.json", model)

    del dummy

    dummy = Interface.from_directory(directory)

    assert dummy.uuid == new_uuid
    assert dummy.timestamp == 0
    assert str(dummy.created_at()).startswith("1970-01-01")


def test_interface_find_by_fingerprint(tmp_storage):
    dummy = Interface({"a": 1}).materialize()
    dummy2 = Interface().materialize()
    dummy3 = Interface().materialize()

    assert dummy.hash != dummy2.hash
    assert dummy2.uuid == dummy3.uuid

    assert Interface.find_by_fingerprint(dummy.hash)[0] == dummy
    assert Interface.find_by_fingerprint(dummy2.hash)[0] == dummy2


def test_interface_find_by_id(tmp_storage):
    dummy = Interface({"a": 1}).materialize()
    dummy2 = Interface().materialize()
    dummy3 = Interface().materialize()

    assert dummy == Interface.find_by_id(dummy.uuid)
    assert dummy2 == Interface.find_by_id(dummy2.id)
    assert dummy3 == Interface.find_by_id(dummy3.id)


def test_interface_interfaces(tmp_storage):
    class T(Interface):
        def launch(self):
            get("dummy").launch()

    interfaces = T().interfaces
    assert len(interfaces) == 1
    assert interfaces[0].module == "dummy"


def test_interface_cachable(tmp_storage):
    counts = {
        "test": 0,
        "test2": 0,
        "test3": 0,
    }

    class T(Interface):
        @cachable(memory=False)
        def test(self):
            counts["test"] += 1
            return counts["test"]

        @cachable(file=False)
        def test2(self, a=0, k="test"):
            counts["test2"] += 1
            return counts["test2"] * 100 + a

    # not cached if not cached
    t = T()
    assert not t.cached()
    assert t.test() == 1
    assert t.test() == 2
    t.materialize()
    assert t.test2() == 100
    assert t.test2() == 100
    counts["test2"] = -1
    assert t.test2() == 100
    assert t.test2(5) == 5  # = (-1 + 1) * 100 + 5

    class C(Execution):
        @cachable()
        def test3(self, a=0, k="test"):
            counts["test3"] += 1
            return counts["test3"] * 100 + a

    c = C().materialize()
    assert not c.cached()
    assert c.test3() == 100
    assert c.test3() == 200

    c.launch()  # cache

    assert c.test3() == 300
    assert c.test3() == 300

    key = [k for k in c._cache if k.startswith(".cachable_")][0]
    del c._cache[key]
    os.remove(c.local_directory(key))
    assert c.test3() == 400
    assert c.test3() == 400

    assert c.test3(5) == 505
    assert c.test3(5) == 505

    assert c.test3(5, k="reset") == 605
    assert c.test3(5, k="reset") == 605

    assert c.test3() == 400
    assert c.test3(5) == 505

    # not jsonable disables cache
    assert c.test3(k=slice(1)) == 700
    assert c.test3(k=slice(1)) == 800

    # default-args
    class C(Execution):
        @cachable()
        def test(self, payload="default", a=1):
            return getattr(self, "latent", "test")

    c = C().launch()
    assert c.test(a=1) == "test"
    c.latent = "changed"
    assert c.test(a=1) == "test"
    assert c.test(payload="default", a=1) == "test"
    assert c.test(payload="default") == "test"
    assert c.test(a=2) == "changed"


def test_interface_update(tmp_storage):
    i = get("machinable.interface", {"a": 1}).materialize()
    r = get("machinable.interface", {"a": 1})
    assert r == i
    assert r.config._update_.a == 1
    assert r.config._default_ == {}
    assert r.config._version_ == [{"a": 1}]
