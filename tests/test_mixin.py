import pytest
from machinable import Element, Project


def test_mixins():
    with Project("./tests/samples/project"):
        element = Element.make("mixins.example")
        assert element.say() == "hello, world"
        assert element.say_bound() == "success"
        assert element.__mixin__.calling_into_the_void() == "no response"
        assert element.test.bound_hello() == "success"
        assert element.dummy.name() == "dummy"

        with pytest.raises(AttributeError):
            element.bla()
        with pytest.raises(AttributeError):
            element.there("")
