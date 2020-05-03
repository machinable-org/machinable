import pytest

from machinable.config.parser import parse_mixins, parse_reference


def test_parse_reference():
    root = {
        "test": 1,
        "me": {
            "nested": 2,
            "deep": {"structure": 3, "with": {"nested": 4, "to": "check"}},
        },
        "key": "nested",
        "hello": {"world": "with"},
        "list": ["great", "stuff", "beautiful"],
    }
    this = root["me"]

    assert parse_reference("$self.nested", root, this) == 2
    assert parse_reference("$.test", root, this) == 1

    assert parse_reference("$.me[$.key]", root, this) == 2

    assert parse_reference("$.list[$self.nested]", root, this) == "beautiful"
    assert parse_reference("$.list[$.me[nested]]", root, this) == "beautiful"
    assert parse_reference("$.list[$.me[$.key]]", root, this) == "beautiful"

    assert parse_reference("$self.deep[$.hello[world]][$.key]", root, this) == 4
    assert parse_reference("$self.deep[$.hello[world]].to", root, this) == "check"


def test_parse_mixins():
    assert parse_mixins(None) == []

    with pytest.raises(ValueError):
        parse_mixins({})

    # converts str into list
    assert parse_mixins("mixin")[0]["name"] == "mixin"

    # attributes
    assert parse_mixins("+.import.project")[0]["attribute"] == "_import_project_"
    assert parse_mixins("module.path")[0]["attribute"] == "_module_path_"
    assert parse_mixins("invalid$name")[0]["valid_attribute"] is False
