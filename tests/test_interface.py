import os

import pytest
from machinable import Interface, Project, Schedule, Scope, get
from machinable.collection import ComponentCollection
from machinable.interface import belongs_to, belongs_to_many, has_many, has_one
from machinable.utils import load_file, random_str


def test_interface_get():
    assert isinstance(get(), Interface)
    assert isinstance(get("machinable.schedule"), Schedule)
    # extensions
    a = Interface({"a": "a", "one": 1})
    b = get(a, {"a": "b"})
    assert b.config.a == "b"
    assert b.config.one == 1
    assert get(["machinable.interface", {"a": "a"}], [None]).config.a == "a"
    assert (
        get(["machinable.interface", {"a": "a"}], [{"a": "b"}]).config.a == "b"
    )


def test_interface_to_directory(tmp_path):
    Interface().to_directory(str(tmp_path / "test"))
    assert os.path.exists(str(tmp_path / "test" / ".machinable"))
    assert os.path.exists(str(tmp_path / "test" / "model.json"))
    assert not os.path.exists(str(tmp_path / "test" / "related"))

    i = Interface(derived_from=Interface(), uses=[Interface(), Interface()])
    i.to_directory(str(tmp_path / "test2"))
    assert load_file(str(tmp_path / "test2" / ".machinable")) == i.uuid
    assert (
        load_file(str(tmp_path / "test2" / "related" / "uses"))
        == "\n".join([i.uuid for i in i.uses]) + "\n"
    )


def test_interface_to_directory_inverse_relations(tmp_storage):
    a = Interface()
    b = Interface(uses=a)
    b.commit()

    assert a.used_by[0] == b

    assert os.listdir(b.local_directory("related")) == ["uses"]
    assert b.load_file(["related", "uses"]) == a.uuid + "\n"
    assert os.listdir(a.local_directory("related")) == ["used_by"]
    assert a.load_file(["related", "used_by"]) == b.uuid + "\n"

    c = b.derive().commit()

    assert os.listdir(b.local_directory("related")) == ["uses", "derived"]
    assert b.load_file(["related", "derived"]) == c.uuid + "\n"
    assert os.listdir(c.local_directory("related")) == ["ancestor"]
    assert c.load_file(["related", "ancestor"]) == b.uuid + "\n"

    d = b.derive().commit()
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
    @has_many(collection=ComponentCollection)
    def many_b():
        return B

    @has_many(key="test")
    def many_c():
        return C


def test_interface_relations(tmp_storage):
    a1, a2 = A(), A()
    b1, b2 = B(), B()
    c = C()

    a1.commit()
    assert len(a1.many_b) == 0

    # has many
    a2.push_related("many_b", b1)
    a2.push_related("many_b", b2)
    a2.commit()
    assert len(a2.many_b) == 2
    assert isinstance(a2.many_b, ComponentCollection)
    assert b1.one_a == a2
    assert b2.one_a == a2
    a2._relation_cached = {}
    b1._relation_cached = {}
    assert len(a2.many_b) == 2
    assert isinstance(a2.many_b, ComponentCollection)
    assert b1.one_a == a2
    assert b2.one_a == a2

    # has one
    c.push_related("one_b", b1)
    c.commit()
    assert c.one_b == b1
    assert c.one_b.one_a == a2
    assert c.one_b.one_c == c

    # many to many
    c1, c2 = C(), C()
    c1.push_related("many_a", a1)
    c1.push_related("many_a", a2)
    c1.commit()
    c2.push_related("many_a", a1)
    c2.push_related("many_a", a2)
    c2.commit()
    c1._relation_cached = {}
    c2._relation_cached = {}
    assert len(c1.many_a) == 2
    assert len(c2.many_a) == 2
    a1._relation_cached = {}
    assert {v.uuid for v in a1.many_c} == {c1.uuid, c2.uuid}


def test_interface_related(tmp_storage):
    with Project("./tests/samples/project") as p:
        i = Interface.make("dummy")
        i.push_related("project", p)
        i.launch()
    assert i.related().all() == [p, i.execution]
    child = i.derive().launch()
    assert i.related().all() == [p, child, i.execution]
    assert child.related().all() == [i, child.execution]

    assert len(i.related(deep=True)) == 5

    grandchild = Interface(derived_from=child).commit()
    assert child.derived.all() == [grandchild]
    assert child.related().all() == [grandchild, i, child.execution]
    assert len(i.related(deep=True)) == 6


def test_interface_commit(tmp_storage):
    with Project("./tests/samples/project"):
        Interface.make("interface.dummy").commit()


def tes_interface_save_file(tmp_storage):
    component = Interface().commit()
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
        Config = {"c": 1}

    root = Interface().commit()

    child1 = root.derive(T).commit()
    child2 = root.derive(T, {"c": 2}).commit()

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
    get("interface.dummy").commit()
    assert len(Interface().all()) == 0
    assert list(get("interface.dummy").all()) == [get("interface.dummy")]
    get("interface.dummy", {"a": 1}).commit()
    assert len(Interface().all()) == 0
    assert len(get("interface.dummy").all()) == 1
    assert len(get("interface.dummy", {"a": 1}).all()) == 1

    # new
    assert get("interface.dummy").is_committed()
    assert get("interface.dummy").new().is_committed() is False

    assert len(get().all()) == 0

    # a priori modifiers

    # all
    assert len(get.all()) == 2
    with Scope({"unique": True}):
        assert len(get.all()) == 0
        get("interface.dummy").commit()
        assert len(get.all()) == 1
    assert len(get.all()) == 3

    # new
    assert get.new("interface.dummy").is_committed() is False

    # or
    assert get.or_none("interface.dummy") is not None
    assert get.or_none("interface.dummy", {"a": 2}) is None
    assert get.or_fail("interface.dummy").is_committed()
    with pytest.raises(ValueError):
        get.or_fail("interface.dummy", {"a": 2})

    # preferring cached
    d1 = get.new("dummy").commit()
    d2 = get.new("dummy").launch()
    d3 = get.new("dummy").commit()
    assert get("dummy") == d3
    assert get.prefer_cached("dummy") == d2
    assert not get.prefer_cached("dummy", {"a": -100}).is_committed()

    project.__exit__()


def test_symlink_relations(tmp_storage):
    project = Project("./tests/samples/project").__enter__()

    component = get("dummy").launch()
    assert os.path.isfile(
        component.execution.component_directory("link", ".machinable")
    )

    project.__exit__()


def test_interface_hash(tmp_storage):
    assert Interface().hash == 12 * "0"

    a = Interface().commit()
    b = Interface({"a": 1}).commit()

    assert a.hash != b.hash

    c = Interface({"a": 1}).commit()
    assert b.hash == c.hash


def test_interface_uuid(tmp_storage):
    dummy = Interface().commit()
    directory = dummy.local_directory()

    # replace uuid with random male-formed string
    model = dummy.load_file("model.json")
    model["uuid"] = new_uuid = random_str(len(model["uuid"]))
    dummy.save_file("model.json", model)

    del dummy

    dummy = Interface.from_directory(directory)

    assert dummy.uuid == new_uuid
    assert dummy.timestamp == 0
    assert str(dummy.created_at()).startswith("1970-01-01")


def test_interface_find_by_hash(tmp_storage):
    dummy = Interface({"a": 1}).commit()
    dummy2 = Interface().commit()
    dummy3 = Interface().commit()

    assert dummy.hash != dummy2.hash
    assert dummy2.hash == dummy3.hash
    assert dummy2.uuid != dummy3.uuid

    assert Interface.find_by_hash(dummy.hash)[0] == dummy
    assert len(Interface.find_by_hash(dummy2.hash)) == 2
