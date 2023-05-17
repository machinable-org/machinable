import os

from machinable import Interface, Project
from machinable.collection import ComponentCollection
from machinable.interface import belongs_to, has_many, has_one
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


def test_interface_relations(tmp_storage):
    class C(Interface):
        @belongs_to(cached=False)
        def one_b():
            return B

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

    a1, a2 = A(), A()
    b1, b2 = B(), B()
    c1, c2 = C(), C()

    a1.commit()
    assert len(a1.many_b) == 0

    a2.__related__["many_b"] = [b1, b2]
    a2.commit()
    assert len(a2.many_b) == 2
    assert isinstance(a2.many_b, ComponentCollection)
    assert b1.one_a == a2


def test_interface_commit(tmp_storage):
    with Project("./tests/samples/project"):
        Interface.make("interface.dummy").commit()
