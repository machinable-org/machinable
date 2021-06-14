from machinable.element import Connectable, Element


def test_element_views():
    element = Element()
    view = "tests.samples.project.views.basic"
    assert element[view].hello() == "there"
    assert element[view].get_state() is None
    element[view].set_state("test")
    assert element[view].get_state() == "test"
    assert element["!" + view].get_state() is None


def test_connectable():
    class Dummy(Connectable):
        pass

    dummy_1 = Dummy()
    dummy_2 = Dummy()

    with dummy_1:
        assert Dummy.get() is dummy_1
    assert Dummy.get() is not dummy_1
    assert Dummy.get() is not dummy_2

    dummy_1.connect()
    assert Dummy.get() is dummy_1
    with dummy_2:
        assert Dummy.get() is dummy_2
    assert Dummy.get() is dummy_1
    dummy_1.close()
    assert Dummy.get() is not dummy_1
    assert Dummy.get() is not dummy_2

    with dummy_1:
        with dummy_2:
            with Dummy() as dummy_3:
                assert Dummy.get() is dummy_3
                dummy_3.close()
                assert Dummy.get() is not dummy_3
                assert Dummy.get() is not dummy_2
                assert Dummy.get() is not dummy_1
            assert Dummy.get() is dummy_2
        assert Dummy.get() is dummy_1
    assert Dummy.get() is not dummy_1
