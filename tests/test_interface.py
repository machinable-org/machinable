import os

import pytest
from machinable import Component, Interface, Project, Schedule, Scope, get
from machinable.collection import ComponentCollection
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

    def _related(interface, expected):
        x = sorted(os.listdir(interface.local_directory("related")))
        try:
            x.remove("metadata.jsonl")
        except:
            pass
        assert x == expected

    _related(b, ["uses"])
    assert b.load_file(["related", "uses"]) == a.uuid + "\n"
    _related(a, ["used_by"])
    assert a.load_file(["related", "used_by"]) == b.uuid + "\n"

    c = b.derive().commit()

    _related(b, ["derived", "uses"])
    assert b.load_file(["related", "derived"]) == c.uuid + "\n"
    _related(c, ["ancestor"])
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


def test_interface_related_iterator(tmp_storage):
    with Project("./tests/samples/project") as p:
        i = Interface.make("dummy")
        i.push_related("project", p)
        i.launch()
    assert len(list(i.related_iterator())) == 2
    it = i.related_iterator()
    interface, relation, seen = next(it)
    assert interface == p
    assert i.uuid in seen
    interface, relation, seen = next(it)
    assert interface == i.execution
    assert p.uuid in seen


def test_interface_commit(tmp_storage):
    with Project("./tests/samples/project"):
        Interface.make("interface.dummy").commit()

    i = Interface()
    assert not i.is_staged()
    i.commit()
    assert i.is_staged()


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

    # hide
    c = get("interface.dummy")
    uid = c.uuid
    assert not c.hidden()
    c.hidden(True)
    assert get("interface.dummy").uuid != uid
    c.hidden(False)
    assert get("interface.dummy").uuid == uid

    project.__exit__()


def test_symlink_relations(tmp_storage):
    project = Project("./tests/samples/project").__enter__()

    component = get("dummy").launch()
    assert os.path.isfile(component.execution.component_directory("link"))

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


def test_interface_find_by_id(tmp_storage):
    dummy = Interface({"a": 1}).commit()
    dummy2 = Interface().commit()
    dummy3 = Interface().commit()

    assert dummy == Interface.find_by_id(dummy.uuid)
    assert dummy2 == Interface.find_by_id(dummy2.id)
    assert dummy3 == Interface.find_by_id(dummy3.id)


def test_interface_future(tmp_storage):
    p = Project("./tests/samples/project").__enter__()

    class T(Interface):
        def test(self):
            c = get("dummy")
            assert c.future() is None
            assert len(c._futures_stack) == 0
            assert list(self._futures_stack) == [c.id]

            self.future() is None

            c.launch()
            assert c.future() is c
            assert len(self._futures_stack) == 0
            with get("machinable.execution").deferred() as execution:
                assert c.future() is None

            assert execution.executables[0] is c

            assert self.future() is self

    t = T()
    t.test()

    p.__exit__()


def test_interface_components(tmp_storage):
    class T(Interface):
        def launch(self):
            get("machinable.component").launch()

    assert len(T().components) == 1
    t = get("machinable.component")
    assert t == t.components[0]


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
    assert t.cached()
    assert t.test() == 1
    assert t.test() == 1
    t.commit()
    assert t.test2() == 100
    assert t.test2() == 100
    counts["test2"] = -1
    assert t.test2() == 100
    assert t.test2(5) == 5  # = (-1 + 1) * 100 + 5

    class C(Component):
        @cachable()
        def test3(self, a=0, k="test"):
            counts["test3"] += 1
            return counts["test3"] * 100 + a

    c = C().commit()
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
