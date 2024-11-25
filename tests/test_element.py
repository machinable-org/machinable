from typing import Optional

import sys

if sys.version_info <= (3, 8):
    from typing import Annotated
else:
    from typing_extensions import Annotated

from uuid import uuid4

import pydantic
import pytest
from machinable import Element, Project
from machinable.element import (
    compact,
    defaultversion,
    equalversion,
    extend,
    extract,
    normversion,
    transfer_to,
    uuid_to_id,
)
from machinable.errors import ConfigurationError
from machinable.utils import Connectable, file_hash
from omegaconf import OmegaConf
from pydantic.functional_validators import BeforeValidator


def test_element_defaults():
    with Project("./tests/samples/project") as project:
        Element.set_default("dummy")
        assert Element.instance().module == "dummy"
        assert Element.make().module == "machinable.element"

        dummy = Element.make("dummy")
        assert dummy.module == "dummy"
        dummy.as_default()
        assert Element.instance().module == "dummy"
        assert Element.make().module == "machinable.element"
        Element.default = None
        assert Element.instance().module == "machinable.element"

    # in session
    class InSession(Element):
        Config = {"a": 1}

        def in_session(self):
            return True

    Element.default = [InSession, {"a": 2}]
    q = Element.instance()
    assert q.module == "__session__InSession"
    assert q.config.a == 2
    assert q.in_session()
    assert Element.make().module == "machinable.element"
    Element.set_default(InSession, {"a": -1})
    assert Element.instance().config.a == -1
    Element.default = None


def test_element_instantiation():
    with Project("./tests/samples/project") as project:
        with pytest.raises(ModuleNotFoundError):
            project.element("non.existing", Element)
        with pytest.raises(ConfigurationError):
            project.element("empty", Element)
        element = project.element("basic")
        assert element.hello() == "there"
        from_model = Element.from_model(element.__model__)
        assert from_model.hello() == "there"
        # prevents circular instantiation
        assert isinstance(Element.make("machinable"), Element)
        assert isinstance(Element.make("machinable.element"), Element)

        # on_instantiate
        assert (
            Element.make("line").msg_set_during_instantiation == "hello world"
        )


def test_element_lineage():
    with Project("./tests/samples/project") as project:
        element = Element.instance("basic")
        assert element.lineage == (
            "machinable.component",
            "machinable.interface",
            "machinable.element",
        )
        element = Element.instance("line")
        assert element.lineage == (
            "dummy",
            "machinable.component",
            "machinable.interface",
            "machinable.element",
        )

        class T(Element):
            pass

        assert T().lineage == ("machinable.element",)


def test_element_transfer():
    src = Element("dummy")
    target = Element("test")
    assert src.id != target.id
    transfered = transfer_to(src, target)
    assert transfered.id == transfered.id


def test_element_config():
    class Dummy(Element):
        class Config(pydantic.BaseModel):
            foo: float = pydantic.Field("???")
            test: int = 1

        def version_floaty(self):
            return {"foo": 0.1}

        def version_string(self):
            return {"foo": "test"}

    with pytest.raises(ConfigurationError):
        Dummy().config

    with pytest.raises(ValueError):
        Dummy({1: 1.0}).config

    with pytest.raises(ConfigurationError):
        Dummy({"foo": "test"}).config
        Dummy("~string").config

    assert Dummy({"foo": 1}).config.foo == 1.0
    assert Dummy([{"foo": 0.5}, "~floaty"]).config.foo == 0.1

    class Dummy(Element):
        class Config(pydantic.BaseModel):
            class Beta(pydantic.BaseModel):
                test: Optional[bool] = None

            beta: Beta = pydantic.Field(default_factory=Beta)
            a: int = pydantic.Field("through_config_method(1)")
            b: Optional[int] = None
            alpha: int = 0

        def version_one(self):
            return {"alpha": 1, "beta": {"test": True}}

        def version_two(self):
            return {"alpha": 2}

        def version_three(self):
            return {"alpha": 3}

        def version_custom(self, alpha=2):
            return {"alpha": alpha}

        def config_through_config_method(self, arg):
            return arg

    assert Dummy({"alpha": -1}).config.alpha == -1
    c = Dummy(({"a": 1}, {"a": 2, "b": 3})).config
    assert c["a"] == 2
    assert c["b"] == 3

    Dummy.Config = {
        "beta": {"test": None},
        "a": "through_config_method(1)",
        "b": None,
        "alpha": 0,
    }

    assert Dummy({"alpha": -1}).config.alpha == -1
    c = Dummy(({"a": 1}, {"a": 2, "b": 3})).config
    assert c["a"] == 2
    assert c["b"] == 3

    with pytest.raises(ConfigurationError):
        Dummy("~non-existent").config

    assert Dummy("~one").config.alpha == 1

    c = Dummy(("~three", "~one", "~two")).config
    assert c["alpha"] == 2
    assert c["beta"]["test"]

    assert Dummy("~custom").config.alpha == 2
    assert Dummy("~custom(3)").config.alpha == 3
    assert Dummy("~custom(alpha=5)").config.alpha == 5

    # multi-line
    ml = Dummy(
        """
        ~custom(
        alpha=10
        )
    """
    )
    assert ml.config.alpha == 10
    assert ml.version() == ["~custom(alpha=10)"]

    # ingores None
    assert Dummy((None, {"alpha": -1}, None)).config.alpha == -1

    # flattening
    assert Dummy({"beta.test": False}).config.beta.test is False

    class T(Element):
        pass

    t = T({"a.b": {"c.d": 1}, "q": 2, "f.g.p": -1})
    assert t.config.a.b["c.d"] == 1
    assert t.config.q == 2
    assert t.config.f.g.p == -1

    # config methods

    class Methods(Element):
        class Config(pydantic.BaseModel):
            class Nested(pydantic.BaseModel):
                method: str = "hello()"

            method: str = "hello()"
            argmethod: str = "arghello('world')"
            nested: Nested = pydantic.Field(default_factory=Nested)
            recursive: str = "recursive_call('test')"

        def config_hello(self):
            return "test"

        def config_arghello(self, arg):
            return arg

        def config_recursive_call(self, arg):
            return self.config.method + str(arg)

    c = Methods().config
    assert c.method == "test"
    assert c.argmethod == "world"
    assert c.recursive == "testtest"
    assert c.nested.method == "test"

    # introspection
    assert c._version_ == []
    assert c._update_ == {}
    assert c._default_["method"] == "hello()"

    # module
    assert Dummy().module == "tests.test_element"
    with Project("./tests/samples/project"):
        assert Element.instance("dummy").module == "dummy"

    # no-schema
    class NoSchema(Element):
        pass

    c = NoSchema({"a": 1, "b.c": 2})
    assert c.config.a == 1
    assert c.config.b.c == 2

    class NoSchemaDefault(Element):
        Config = {"a": 0}

    assert NoSchemaDefault().config.a == 0
    c = NoSchemaDefault({"a": 1, "b.c": 2})
    assert c.config.a == 1
    assert c.config.b.c == 2

    # false positive
    Methods({"method": "max(1,2)<0.1"}).config.method == "max(1,2)<0.1"


def test_element_lambdas():
    e = Element([lambda _: {"a": 2 * 3}])
    assert e.config.a == 6
    e = Element(lambda self: {"a": self.__module__})
    assert e.config.a == "machinable.element"
    assert e.version() == [{"a": "machinable.element"}]
    e = Element([{"a": 1}, lambda _: {"a": 2}])
    assert e.config.a == 2

    class T(Element):
        def version_test(self):
            return {"a": 3}

    assert T("~test").config.a == 3
    assert T(["~test", lambda _: {"a": 2}]).config.a == 2
    assert T([{"a": 1}, lambda c: c.version_test()]).config.a == 3


def test_element_config_schema():
    class Basic(Element):
        class Config(pydantic.BaseModel):
            hello: str = ""
            world: float = pydantic.Field("???")

    # detect missing values
    with pytest.raises(ConfigurationError):
        schema = Basic({}).config

    with pytest.raises(ConfigurationError):
        schema = Basic([{"hello": 1, "world": 0.1}, {"typo": 1}]).config

    class Dataclass(Element):
        class Config(pydantic.BaseModel):
            test: str = ""

    assert Dataclass([{"test": 1}, {"test": "0.1"}]).config.test == "0.1"

    class Vector(pydantic.BaseModel):
        a: str = ""
        b: float = 0.0

    class Nesting(Element):
        class Config(pydantic.BaseModel):
            value: Vector = pydantic.Field(default_factory=Vector)

    schema = Nesting({"value": {"a": "1", "b": 1}})
    assert schema.config.value.a == "1"
    assert schema.config.value.b == 1.0


def test_element_config_transform(tmp_path):
    class Test(Element):
        class Config(pydantic.BaseModel):
            test: str = "???"
            tf: Annotated[str, BeforeValidator(lambda x: x + x)] = "default"

    t = Test({"test": "me"})
    assert t.config.test == "me"
    assert t.config.tf == "defaultdefault"
    assert t.config._default_.tf == "default"
    t = Test({"test": "me", "tf": "hello"})
    assert t.config.test == "me"
    assert t.config.tf == "hellohello"
    assert t.config._default_.tf == "default"
    assert t.config._update_.tf == "hello"

    with open(tmp_path / "test.txt", "w") as f:
        f.write("test")

    class FileTest(Element):
        class Config(pydantic.BaseModel):
            file: Annotated[str, BeforeValidator(file_hash)] = "default"

    t = FileTest({"file": str(tmp_path / "test.txt")})
    assert t.config.file == "a71079d42853"
    assert t.config._default_.file == "default"
    assert t.config._update_.file == str(tmp_path / "test.txt")


def test_normversion():
    assert normversion([]) == []
    assert normversion("test") == ["test"]
    assert normversion({"test": 1}) == [{"test": 1}]
    assert normversion({}) == []
    assert normversion(None) == []
    assert normversion([None, {}]) == []
    assert normversion(("test", {})) == ["test"]
    assert isinstance(normversion(OmegaConf.create({"test": 1}))[0], dict)
    assert isinstance(
        normversion({"nested": OmegaConf.create({"test": 1})})[0]["nested"],
        dict,
    )
    with pytest.raises(ValueError):
        normversion({"invalid"})
    with pytest.raises(ValueError):
        normversion(["test", {"invalid"}])


def test_compact():
    assert compact("test") == ["test"]
    assert compact("test", "me") == ["test", "me"]
    assert compact("test", ("one", {}, "two")) == ["test", "one", "two"]
    with pytest.raises(ValueError):
        compact({"invalid"})
    assert compact(["test"]) == ["test"]
    assert compact(["test", "one"], ["two"]) == ["test", "one", "two"]
    assert compact(["test"], "one") == ["test", "one"]


def test_extract():
    assert extract(None) == (None, None)
    assert extract("test") == ("test", None)
    assert extract(["test"]) == ("test", None)
    assert extract(("test", "one")) == ("test", ["one"])
    with pytest.raises(ValueError):
        extract({"invalid"})
    with pytest.raises(ValueError):
        extract([{"invalid"}, "test"])
    with pytest.raises(ValueError):
        extract([])
    assert extract(OmegaConf.create(["test", {"test": 1}])) == (
        "test",
        [{"test": 1}],
    )


def test_defaultversion():
    assert defaultversion("test", ["example"], Element) == (
        "test",
        ["example"],
    )
    assert defaultversion(None, None, Element) == (None, [])


def test_equalversion():
    assert equalversion(None, None)
    assert equalversion([], None)
    assert equalversion(["~test", {"a": 2}], ("~test", {"a": 2}))
    assert equalversion([{}, {"a": 2}], (None, {"a": 2}))
    assert equalversion({"a": 1, "b": 2}, {"b": 2, "a": 1})
    assert not equalversion(
        ({"a": 1, "b": 2}, "test"), ("test", {"b": 2, "a": 1})
    )


def test_extend():
    assert extend("test") == ("test", None)
    assert extend(Element) == (Element, None)
    e = Element()
    assert extend(e) == ("machinable.element", [])
    assert extend(e, ["test"]) == ("machinable.element", ["test"])

    assert extend(["t", {"version": True}]) == ("t", [{"version": True}])
    assert extend(["t", {"a": "b"}], {"c": "d"}) == (
        "t",
        [{"a": "b"}, {"c": "d"}],
    )
    assert extend(["t", "a", "b"], "c") == ("t", ["a", "b", "c"])

    with pytest.raises(ValueError):
        extend(["t", ["a", "b"]], {"test"})

    with pytest.raises(ValueError):
        extend([], {"test"})

    with pytest.raises(ValueError):
        extend([{"not": "str"}], {"test"})


def test_uuid_to_id():
    assert len(uuid_to_id(uuid4().hex)) == 6


def test_connectable():
    class T(Connectable):
        pass

    for Dummy in [T, Element]:
        dummy_1 = Dummy()
        dummy_2 = Dummy()

        assert not Dummy.is_connected()
        assert not Dummy.is_connected()

        with dummy_1:
            assert Dummy.get() is dummy_1
            assert Dummy.is_connected()
        assert not Dummy.is_connected()
        assert Dummy.get() is not dummy_1
        assert Dummy.get() is not dummy_2

        dummy_1.__enter__()
        assert Dummy.is_connected()
        assert Dummy.get() is dummy_1
        with dummy_2:
            assert Dummy.get() is dummy_2
            assert Dummy.is_connected()
        assert Dummy.get() is dummy_1
        dummy_1.__exit__()
        assert not Dummy.is_connected()
        assert Dummy.get() is not dummy_1
        assert Dummy.get() is not dummy_2

        with dummy_1:
            with dummy_2:
                with Dummy() as dummy_3:
                    assert Dummy.get() is dummy_3
                    assert Dummy.is_connected()
                assert Dummy.is_connected()
                assert Dummy.get() is dummy_2
            assert Dummy.get() is dummy_1
        assert Dummy.get() is not dummy_1
        assert not Dummy.is_connected()


def test_element_attributes():
    t = Element()

    assert t.load_attribute("test") is None
    assert t.save_attribute("test", None) == "test"
    assert t.load_attribute("test") is None
    t.save_attribute("test", "hello")
    assert t.load_attribute("test") == "hello"
    assert t.save_attribute(["test", "me"], True) == "test/me"
    assert t.load_attribute("test/me")

    t = Element()
    assert t.load_attribute("test") is None
