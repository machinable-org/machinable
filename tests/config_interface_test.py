from machinable.config.interface import ConfigInterface
from machinable.project import Project


def test_mixin_handler():
    test_project = Project('test_project')

    config = ConfigInterface(test_project.parse_config())

    t = config.get_component('mixexp', version=None, flags=None)['args']

    # preserved the config
    assert t['hello'] == 'there'

    # extended key update
    assert t['key']['extension'] == 'enabled'

    # mixin
    assert t['key']['overwritten'] == 'cool'

    # mixin inheritance
    assert t['key']['mixing'] == 'is'

    # mixin import
    assert t['imported'] == 'hello'
