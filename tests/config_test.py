import pytest

from machinable.config import parse_mixins


def test_parse_mixins():
    assert parse_mixins(None) == []

    with pytest.raises(ValueError):
        parse_mixins({})

    # converts str into list
    assert parse_mixins('mixin')[0]['name'] == 'mixin'

    # attributes
    assert parse_mixins('+.import.project')[0]['attribute'] == '_import_project_'
    assert parse_mixins('module.path')[0]['attribute'] == '_module_path_'
    assert parse_mixins('invalid$name')[0]['valid_attribute'] is False