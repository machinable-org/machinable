from dataclasses import dataclass

import pydantic
import pytest
from machinable import Component, Project
from machinable.component import compact, extract, normversion
from machinable.errors import ConfigurationError
from machinable.types import ComponentType


def test_component_version():
    project = Project("./tests/samples/project")

    assert project.get_component("dummy", {"alpha": -1}).config.alpha == -1

    c = project.get_component("dummy", ({"a": 1}, {"a": 2, "b": 3})).config
    assert c["a"] == 2
    assert c["b"] == 3

    with pytest.raises(ConfigurationError):
        project.get_component("dummy", "~non-existent").config

    assert project.get_component("dummy", "~one").config.alpha == 1

    c = project.get_component("dummy", ("~three", "~one", "~two")).config
    assert c["alpha"] == 2
    assert c["beta"]["test"]

    # nested
    c = project.get_component("dummy", "~three:nested").config
    assert c["unaffected"] == "value"
    assert c["nested"] is None
    assert c["alpha"] == 4
    assert c["beta"] == "nested"
    assert "should_not_be" not in c

    c = project.get_component("dummy", ("~two", "~nested")).config
    assert c["alpha"] == 2
    assert c["nested"] is True

    c = project.get_component("dummy", "~three:nested:nestednested").config
    assert c["unaffected"] == "value"
    assert c["works"] is False
    assert c["alpha"] == 5
    assert c["beta"] == "overwritten"
    assert c["added"] == "value"

    # ingores None
    assert (
        project.get_component("dummy", (None, {"alpha": -1}, None)).config.alpha
        == -1
    )

    # flattening
    c = project.get_component(
        "components.flattened_notation",
        {
            "flat.merge": "merged",
            "more.nested.values": "here",
            "flat.can_also_save_space": "overwritten",
        },
    ).config
    assert "flat" in c
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["can_also_save_space"] == "overwritten"
    assert c["flat"]["merge"] == "merged"
    assert c["more"]["nested"]["values"] == "here"

    # versions
    c = project.get_component(
        "components.flattened_notation", "~flat_version"
    ).config
    assert "flat" in c
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["nested"] is False
    assert c["flat"]["version"] == 2

    # config methods
    c = project.get_component("components.configmethods").config
    assert c.method == "test"
    assert c.argmethod == "world"
    assert c.nested.method == "test"

    # test config introspection
    c = project.get_component(
        "components.flattened_notation", "~flat_version"
    ).config
    assert c._schematized_ is False
    assert c._lineage_ == ["components.inherited_flatness"]
    assert c._uses_ == {}
    assert c._component_ == "components.flattened_notation"
    assert c._version_ == ["~flat_version"]
    assert c._resolved_version_ == ["~flat_version"]
    assert c._slot_update_ == {}

    class IntrospectiveComponent(Component):
        def test(self):
            return self.config._version_

    assert IntrospectiveComponent({}).test() == []


def test_component_config_schema():
    class Basic(Component):
        class Config:
            hello: str
            world: float

    # detect missing values
    with pytest.raises(pydantic.error_wrappers.ValidationError):
        schema = Basic({}).config

    # casting
    schema = Basic({"hello": 1, "world": "0.1"})
    assert schema.config.hello == "1"
    assert schema.config.world == 0.1

    with pytest.raises(pydantic.error_wrappers.ValidationError):
        schema = Basic({"hello": 1, "world": "0.1"}, {"typo": 1}).config

    class Dataclass(Component):
        @dataclass
        class Config:
            test: str

    assert Dataclass({"test": 1}, {"test": 0.1}).config.test == "0.1"

    class Vector(pydantic.BaseModel):
        a: str
        b: float

    class Nesting(Component):
        class Config:
            value: Vector

    schema = Nesting({"value": {"a": 1, "b": 1}})
    assert schema.config.value.a == "1"
    assert schema.config.value.b == 1.0


def test_component_slots():
    project = Project("./tests/samples/project").connect()

    with pytest.raises(ConfigurationError):
        c = project.get_component(
            "components.slots", uses={"invalid": "dummy"}
        ).config

    assert (
        project.get_component(
            "components.slots", uses={"test": "dummy"}
        ).config.a
        == 1
    )
    c = project.get_component(
        "components.slots",
        version="~test",
        uses={"with_version": "components.slot_use"},
    ).config
    assert c.a == 0
    assert c.with_version.nested == "version"
    assert c.c == 4
    c = project.get_component(
        "components.slots",
        version="~ver",
        uses={"with_version": "components.slot_use"},
    ).config
    assert c.a == 2
    assert c.b == 3
    assert c.c == 1
    assert c.with_version.manipulate is False
    assert c.with_version.nested == "override"
    c = project.get_component(
        "components.slots",
        version="~ver",
        uses={"with_version": ["components.slot_use", {"manipulate": True}]},
    ).config
    assert c.a == 2
    assert c.b == 3
    assert c.c == 1
    assert c.with_version.manipulate is True
    assert c.with_version.nested == "manipulated"


def test_normversion():
    assert normversion([]) == []
    assert normversion("test") == ["test"]
    assert normversion({"test": 1}) == [{"test": 1}]
    assert normversion({}) == []
    assert normversion(None) == []
    assert normversion([None, {}]) == []
    assert normversion(("test", {})) == ["test"]
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
