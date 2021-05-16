import pytest
import yaml
from machinable.config import from_file, from_string, parse, prefix
from machinable.errors import ConfigurationError


def test_config_loader():
    assert from_file("non-existent.yaml") is None
    assert from_file("non-existent.yaml", default=True) is True

    data = from_file("./tests/samples/project/machinable.yaml")

    # outsourcing $/
    assert data["outsource"]["outsourced_config"] == "success"

    # correct scientific notation parsing
    assert data["scientific"] == 5e-6

    # + includes
    assert data["outsourced_config"] == "success"
    assert data["appended"]["section"] is True

    with pytest.raises(ConfigurationError):
        assert from_string(yaml.dump({"+": "test"}))


def test_config_parser():
    bedrock = from_file(
        "./tests/samples/project/vendor/fooba/vendor/bedrock/machinable.yaml"
    )
    vendor = from_file("./tests/samples/project/vendor/fooba/machinable.yaml")
    data = from_file("./tests/samples/project/machinable.yaml")
    config = parse(
        data,
        prefix(
            parse(vendor, prefix(parse(bedrock), "vendor.bedrock")),
            "vendor.fooba",
        ),
    )

    # aliasing
    assert config["dummy"]["alias"] is None
    assert config["child"]["alias"] == "dummy_alias"

    # inheritance
    assert config["child"]["config"]["a"] == 2
    assert config["child"]["config"]["b"] == 3
    assert config["child"]["config"]["unaffected"] is True
    assert config["child"]["lineage"] == ["dummy"]

    assert config["inherit"]["config"]["blub"] == "bla"
    assert config["inherit"]["config"]["test"] == 123
    assert config["inherit"]["lineage"] == [
        "experiments.start",
        "experiments.start_parent",
    ]

    # kind
    assert config["dummy"]["kind"] == "components"
    assert config["components.flattened_notation"]["prefix"] == "components"

    # unflattening
    c = config["components.flattened_notation"]["config"]
    assert c["flat"]["nested"] is True
    assert c["inherited"]["flat"] == "value"
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["can_also_save_space"] == " "
