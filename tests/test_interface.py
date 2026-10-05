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
from machinable.utils import id_from_uuid, load_file, random_str


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
    # the edge log is the only edge representation
    assert os.listdir(str(tmp_path / "test2" / "related")) == ["metadata.jsonl"]
    edges = load_file([str(tmp_path / "test2"), "related", "metadata.jsonl"])
    assert sorted(e["related_uuid"] for e in edges if e["fn"] == "uses") == sorted(
        u.uuid for u in i.uses
    )


def _edge_log(interface):
    return load_file([interface.local_directory(), "related", "metadata.jsonl"], [])


def _edge_pairs(interface, fn):
    """The ``fn`` edges in the interface's edge log, direction-agnostic."""
    return sorted(
        tuple(sorted((e["uuid"], e["related_uuid"])))
        for e in _edge_log(interface)
        if e["fn"] == fn
    )


def _pair(x, y):
    return tuple(sorted((x.uuid, y.uuid)))


def test_interface_to_dir_inverse_relations(tmp_storage):
    a = Interface({"slot": "a"}).materialize()
    b = Interface({"slot": "b"}, uses=a).materialize()

    assert a.used_by[0] == b

    # edges live in the edge log only; no per-relation mirror files
    for x in (a, b):
        assert os.listdir(x.local_directory("related")) == ["metadata.jsonl"]

    assert _edge_pairs(b, "uses") == [_pair(a, b)]
    assert _edge_pairs(a, "used_by") == [_pair(a, b)]

    c = b.derive().materialize()

    assert _edge_pairs(b, "derived") == [_pair(b, c)]
    assert _edge_pairs(c, "ancestor") == [_pair(b, c)]
    for x in (a, b, c):
        assert os.listdir(x.local_directory("related")) == ["metadata.jsonl"]

    d = b.derive().materialize()
    assert _edge_pairs(b, "derived") == sorted([_pair(b, c), _pair(b, d)])


def test_interface_relate_after_materialization_writes_only_the_edge_log(
    tmp_storage,
):
    a = Interface({"slot": "a"}).materialize()
    b = Interface({"slot": "b"}).materialize()
    b.relate("uses", a)

    for x in (a, b):
        assert os.listdir(x.local_directory("related")) == ["metadata.jsonl"]
    assert _edge_pairs(b, "uses") == [_pair(a, b)]
    assert _edge_pairs(a, "used_by") == [_pair(a, b)]


def test_interface_reads_stores_that_still_carry_relation_mirrors(tmp_storage):
    index = tmp_storage
    rel = "Interface.Interface.using"

    a = Interface({"slot": "a"}).materialize()
    b = Interface({"slot": "b"}, uses=a).materialize()
    a_uuid, b_uuid = a.uuid, b.uuid
    a_dir, b_dir = a.local_directory(), b.local_directory()

    def read():
        index.reindex()
        found = index.find_related(rel, b_uuid)
        return (
            [m.uuid for m in found or []],
            [m.uuid for m in Interface.find_by_id(b_uuid).uses],
            [m.uuid for m in Interface.find_by_id(a_uuid).used_by],
            _edge_log(a),
            _edge_log(b),
        )

    without_mirrors = read()
    assert without_mirrors[0] == [a_uuid]
    assert without_mirrors[1] == [a_uuid]
    assert without_mirrors[2] == [b_uuid]

    # hand-build the legacy layout: per-relation files and related/<id>/link
    related_b = os.path.join(b_dir, "related")
    related_a = os.path.join(a_dir, "related")
    with open(os.path.join(related_b, "uses"), "w") as f:
        f.write(a_uuid + "\n")
    with open(os.path.join(related_a, "used_by"), "w") as f:
        f.write(b_uuid + "\n")
    link_b = os.path.join(related_b, id_from_uuid(a_uuid))
    os.makedirs(link_b)
    with open(os.path.join(link_b, "link"), "w") as f:
        f.write("../../" + a_uuid)
    link_a = os.path.join(related_a, id_from_uuid(b_uuid))
    os.makedirs(link_a)
    try:
        os.symlink("../../" + b_uuid, os.path.join(link_a, "link"))
    except OSError:  # symlinks unavailable
        with open(os.path.join(link_a, "link"), "w") as f:
            f.write("../../" + b_uuid)

    assert read() == without_mirrors


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
    assert t.test2() == 200
    t.cached(True)
    assert t.test2() == 300
    assert t.test2() == 300
    counts["test2"] = -1
    assert t.test2() == 300
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
