import pytest
from machinable import Project
from machinable.errors import ConfigurationError


def test_component_version():
    project = Project("./tests/samples/project")

    data = project.parsed_config()

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
