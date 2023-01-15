from typing import Optional

from dataclasses import dataclass

import pydantic
import pytest
from machinable import Element, Execution, Experiment, Project, Storage, get
from machinable.config import Field, RequiredField
from machinable.element import (
    compact,
    defaultversion,
    equalversion,
    extract,
    idversion,
    normversion,
    resolve_custom_predicate,
    transfer_to,
)
from machinable.errors import ConfigurationError
from machinable.utils import Connectable
from omegaconf import OmegaConf


def test_element_get():
    assert isinstance(get(), Element)
    assert isinstance(get("machinable.storage.filesystem"), Storage)
    print(get("machinable.storage.filesystem", {"directory": "./test"}))


def test_element_defaults():
    with Project("./tests/samples/project") as project:
        Experiment.set_default("dummy")
        assert Experiment.instance().module == "dummy"
        assert Experiment.make().module == "machinable.experiment"

        hello = Experiment.get("hello")
        assert hello.module == "hello"
        hello.as_default()
        assert Experiment.instance().module == "hello"
        assert Experiment.make().module == "machinable.experiment"
        Experiment.default = None
        assert Experiment.instance().module == "machinable.experiment"


def test_element_instantiation():
    with Project("./tests/samples/project") as project:
        with pytest.raises(ModuleNotFoundError):
            project.element("non.existing", Experiment)
        with pytest.raises(ConfigurationError):
            project.element("empty", Experiment)
        experiment = project.element("basic")
        assert experiment.hello() == "there"
        from_model = Experiment.from_model(experiment.__model__)
        assert from_model.hello() == "there"
        # prevents circular instantiation
        assert isinstance(Experiment.make("machinable"), Experiment)
        assert isinstance(Experiment.make("machinable.experiment"), Experiment)

        # on_instantiate
        assert (
            Experiment.make("line").msg_set_during_instantiation
            == "hello world"
        )


def test_element_lineage():
    with Project("./tests/samples/project") as project:
        experiment = Experiment.instance("basic")
        assert experiment.lineage == (
            "machinable.experiment",
            "machinable.element",
        )
        experiment = Experiment.instance("line")
        assert experiment.lineage == (
            "dummy",
            "machinable.experiment",
            "machinable.element",
        )

        class T(Element):
            pass

        assert T().lineage == ("machinable.element",)


def test_element_transfer():
    src = Experiment("dummy")
    target = Experiment("test")
    assert src.experiment_id != target.experiment_id
    transfered = transfer_to(src, target)
    assert transfered.experiment_id == transfered.experiment_id


def test_element_config():
    class Dummy(Element):
        class Config:
            foo: float = RequiredField
            test: int = 1

        def version_floaty(self):
            return {"foo": 0.1}

        def version_string(self):
            return {"foo": "test"}

    with pytest.raises(ConfigurationError):
        Dummy().config

    with pytest.raises(ConfigurationError):
        Dummy({"foo": "test"}).config
        Dummy("~string").config

    assert Dummy({"foo": 1}).config.foo == 1.0
    assert Dummy([{"foo": 0.5}, "~floaty"]).config.foo == 0.1

    class Dummy(Element):
        @dataclass
        class Config:
            @dataclass
            class Beta:
                test: Optional[bool] = None

            beta: Beta = Field(default_factory=Beta)
            a: int = Field("through_config_method(1)")
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

    with pytest.raises(ConfigurationError):
        Dummy("~non-existent").config

    assert Dummy("~one").config.alpha == 1

    c = Dummy(("~three", "~one", "~two")).config
    assert c["alpha"] == 2
    assert c["beta"]["test"]

    assert Dummy("~custom").config.alpha == 2
    assert Dummy("~custom(3)").config.alpha == 3
    assert Dummy("~custom(alpha=5)").config.alpha == 5

    # ingores None
    assert Dummy((None, {"alpha": -1}, None)).config.alpha == -1

    # flattening
    assert Dummy({"beta.test": False}).config.beta.test is False

    # config methods

    class Methods(Element):
        class Config:
            @dataclass
            class Nested:
                method: str = "hello()"

            method: str = "hello()"
            argmethod: str = "arghello('world')"
            nested: Nested = Field(default_factory=Nested)
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
    assert c._raw_["method"] == "hello()"

    # module
    assert Dummy().module == "tests.test_element"
    with Project("./tests/samples/project"):
        assert Experiment.instance("dummy").module == "dummy"
        assert (
            Experiment.instance("interfaces.events_check").module
            == "interfaces.events_check"
        )


def test_component_config_schema():
    class Basic(Element):
        class Config:
            hello: str = ""
            world: float = RequiredField

    # detect missing values
    with pytest.raises(ConfigurationError):
        schema = Basic({}).config

    # casting
    schema = Basic({"hello": 1, "world": "0.1"})
    assert schema.config.hello == "1"
    assert schema.config.world == 0.1

    with pytest.raises(ConfigurationError):
        schema = Basic([{"hello": 1, "world": "0.1"}, {"typo": 1}]).config

    class Dataclass(Element):
        @dataclass
        class Config:
            test: str = ""

    assert Dataclass([{"test": 1}, {"test": 0.1}]).config.test == "0.1"

    class Vector(pydantic.BaseModel):
        a: str = ""
        b: float = 0.0

    class Nesting(Element):
        class Config:
            value: Vector = Field(default_factory=Vector)

    schema = Nesting({"value": {"a": 1, "b": 1}})
    assert schema.config.value.a == "1"
    assert schema.config.value.b == 1.0


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


def test_defaultversion():
    assert defaultversion("test", ["example"], Experiment) == (
        "test",
        ["example"],
    )
    assert defaultversion(None, None, Experiment) == (None, [])


def test_equalversion():
    assert equalversion(None, None)
    assert equalversion([], None)
    assert equalversion(["~test", {"a": 2}], ("~test", {"a": 2}))
    assert equalversion([{}, {"a": 2}], (None, {"a": 2}))
    assert equalversion({"a": 1, "b": 2}, {"b": 2, "a": 1})
    assert not equalversion(
        ({"a": 1, "b": 2}, "test"), ("test", {"b": 2, "a": 1})
    )


def test_idversion():
    assert idversion(None) == idversion([])
    assert idversion(["~test", {"a": 2}]) == ["~test", {"a": 2}]
    assert idversion(["~test_", {"a": 2}]) == [{"a": 2}]
    assert idversion(["~test_", {"a_": 2}]) == []
    assert idversion(
        [
            {"b": 1, "a_": 2},
            "~test_",
        ]
    ) == [{"b": 1}]
    assert idversion(
        [
            {"b": {"c": 3, "d_": 42}, "a_": 2},
            "~test_",
        ]
    ) == [{"b": {"c": 3}}]
    assert idversion(
        {
            "b": {"c": 3, "d_": 42, "f": "~t_", "g": {"n": 1, "q_": 2}},
            "a_": 2,
            "_y": "y_",
        }
    ) == [{"b": {"c": 3, "f": "~t_", "g": {"n": 1}}, "_y": "y_"}]
    assert idversion({"a": 1, "a_": 2, "_a": 3}) == [{"a": 1, "_a": 3}]


def test_resolve_custom_predicate():
    class T:
        def __init__(self, predicate):
            self.predicate = predicate

        def on_compute_predicate(self):
            return self.predicate

    assert resolve_custom_predicate(
        "test, *", T({"a*": "1", "b": "2", "c*": "3"})
    ) == ["test", "a", "c"]
    assert resolve_custom_predicate("test,*", T(None)) == ["test"]
    assert resolve_custom_predicate("* , t", T({})) == ["t"]
    assert resolve_custom_predicate("t,*", T({"a": "1"})) == ["t"]


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
        assert not Dummy.is_connected(), mode


# sub-class relations
class CustomExperiment(Experiment):
    pass


class CustomExecution(Execution):
    pass


def test_element_relations(tmp_storage):
    with Project("./tests/samples/project"):

        experiment = Experiment().group_as("test/group")
        execution = Execution().add(experiment)
        execution.dispatch()

        experiment_clone = Experiment.from_storage(experiment.storage_id)
        assert experiment.experiment_id == experiment_clone.experiment_id

        # experiment <-> execution
        assert int(execution.timestamp) == int(experiment.launch.timestamp)
        assert (
            experiment.experiment_id == execution.experiments[0].experiment_id
        )
        # group <-> execution
        assert experiment.group.path == "test/group"
        assert experiment.group.pattern == "test/group"
        assert experiment.group.experiments[0].timestamp == experiment.timestamp

        # invalidate cache and reconstruct
        experiment.__related__ = {}
        execution.__related__ = {}
        # experiment <-> execution
        assert int(execution.timestamp) == int(experiment.launch.timestamp)
        assert (
            experiment.experiment_id == execution.experiments[0].experiment_id
        )
        # group <-> execution
        assert experiment.group.path == "test/group"
        assert experiment.group.experiments[0].timestamp == experiment.timestamp

        experiment = CustomExperiment()
        execution = CustomExecution().add(experiment)
        execution.dispatch()
        experiment.__related__ = {}
        execution.__related__ = {}
        experiment.launch == execution
        experiment.__related__ = {}
        execution.__related__ = {}
        execution.experiments[0] == experiment


def test_element_search(tmp_storage):
    with Project("./tests/samples/project"):
        exp1 = Experiment.make("dummy", {"a": 1})
        exp1.launch()
        exp2 = Experiment.make("dummy", {"a": 2})
        exp2.launch()
        assert Experiment.find(exp1.experiment_id).timestamp == exp1.timestamp
        assert Experiment.find_by_predicate("non-existing").empty()
        assert (
            Experiment.find_by_predicate("dummy", predicate=None).count() == 2
        )
        # singleton
        assert (
            Experiment.singleton("dummy", {"a": 2}).timestamp == exp2.timestamp
        )
        assert (
            Experiment.singleton("dummy", {"a": 2, "ignore_me_": 3}).timestamp
            == exp2.timestamp
        )
        assert (
            Experiment.singleton("dummy", {"a": 2}).timestamp == exp2.timestamp
        )
        n = Experiment.singleton("dummy", {"a": 3})
        n.launch()
        assert n.experiment_id != exp2.experiment_id
        assert (
            n.experiment_id
            == Experiment.singleton("dummy", {"a": 3}).experiment_id
        )


def test_element_interface(tmp_storage):
    experiment = Experiment()
    experiment.launch()
    # save and load
    experiment.save_file("test.txt", "hello")
    assert experiment.load_file("test.txt") == "hello"
    experiment.save_data("floaty", 1.0)
    assert experiment.load_data("floaty") == "1.0"
    uncommitted = Element()
    uncommitted.save_data("test", "deferred")
    assert uncommitted.load_data("test") == "deferred"
