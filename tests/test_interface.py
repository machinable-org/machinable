import os

from machinable import Interface, Project, get
from machinable.collection import ComponentCollection
from machinable.interface import belongs_to, belongs_to_many, has_many, has_one
from machinable.utils import load_file


def test_interface_to_directory(tmp_path):
    Interface().to_directory(str(tmp_path / "test"))
    assert os.path.exists(str(tmp_path / "test" / ".machinable"))
    assert os.path.exists(str(tmp_path / "test" / "model.json"))
    assert not os.path.exists(str(tmp_path / "test" / "related"))

    i = Interface(derived_from=Interface())
    i.use([Interface(), Interface()])
    i.to_directory(str(tmp_path / "test2"))
    assert load_file(str(tmp_path / "test2" / ".machinable")) == i.uuid
    assert (
        load_file(str(tmp_path / "test2" / "related" / "uses"))
        == "\n".join([i.uuid for i in i.uses]) + "\n"
    )


def test_interface_from_directory(tmp_path):
    i = Interface().to_directory(str(tmp_path / "test"))
    assert Interface.from_directory(str(tmp_path / "test")).uuid == i.uuid


def test_interface_relations(tmp_storage):
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

    a1, a2 = A(), A()
    b1, b2 = B(), B()
    c = C()

    a1.commit()
    assert len(a1.many_b) == 0

    # has many
    a2.__related__["many_b"] = [b1, b2]
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
    c.__related__["one_b"] = b1
    c.commit()
    assert c.one_b == b1
    assert c.one_b.one_a == a2
    assert c.one_b.one_c == c

    # many to many
    c1, c2 = C(), C()
    c1.__related__["many_a"] = [a1, a2]
    c1.commit()
    c2.__related__["many_a"] = [a1, a2]
    c2.commit()
    c1._relation_cached = {}
    c2._relation_cached = {}
    assert len(c1.many_a) == 2
    assert len(c2.many_a) == 2
    a1._relation_cached = {}
    assert set([v.uuid for v in a1.many_c]) == set([c1.uuid, c2.uuid])


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


def test_element_interactive_session(tmp_storage):
    class T(Interface):
        def is_valid(self):
            return True

    t = get(T)
    assert t.module == "__session__T"
    assert t.__model__._dump is not None

    # default launch
    t.launch()
    # serialization
    exec(t.dispatch_code(inline=False) + "\nassert component__.is_valid()")
    # retrieval
    assert t.id == get(T).id
