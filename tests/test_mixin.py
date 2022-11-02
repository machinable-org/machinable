import pytest
from machinable import Element, Project


def test_mixins():
    with Project("./tests/samples/project"):
        element = Element.make("mixins.example")
        assert element.say() == "hello, world"
        assert element.say_bound() == "success"
        assert element.test.bound_hello() == "success"

        with pytest.raises(AttributeError):
            element.bla()
