import pytest

from machinable.config.interface import ConfigInterface
from machinable.project import Project
from machinable import Task

from machinable.task.parser import parse_task


def to_config(project, schedule):
    config = ConfigInterface(project.parse_config(), schedule.specification['version'])
    execution_plan = list(parse_task(schedule.specification))
    for job_id, (node, children, resources) in enumerate(execution_plan):
        node_config = config.get(node)
        children_config = config.get(children[0])

        if children_config is None:
            return node_config['args'], None

        return node_config['args'], children_config['args']


def test_versioning():
    test_project = Project('test_project')

    t = Task().component(('thenode', {'alpha': -1}))
    e, m = to_config(test_project, t)
    assert e['alpha'] == -1

    t = Task().component(('thenode', ({'a': 1}, {'a': 2, 'b': 3})))
    e, m = to_config(test_project, t)
    assert e['a'] == 2
    assert e['b'] == 3

    with pytest.raises(KeyError):
        t = Task().component(('thenode', '~non-existent'))
        e, m = to_config(test_project, t)

    t = Task().component(('thenode', '~one'), ('thechildren', '~two'))
    e, m = to_config(test_project, t)
    assert e['alpha'] == 1
    assert m['alpha'] == 2

    t = Task().component(('thenode', ('~three', '~one', '~two')))
    e, m = to_config(test_project, t)
    assert e['alpha'] == 2
    assert e['beta']['test']

    # nested
    t = Task().component(('thenode', ('~three', '~nested')))
    e, m = to_config(test_project, t)
    assert e['works']
    assert e['nested']
    assert e['alpha'] == 4
    assert e['beta'] == 'nested'

    t = Task().component(('thenode', ('~two', '~nested')))
    e, m = to_config(test_project, t)
    assert e['alpha'] == 2
    assert e['nested']

    t = Task().component(('thenode', ('~three', '~nested', '~nestednested')))
    e, m = to_config(test_project, t)
    assert e['works']
    assert e['alpha'] == 5
    assert e['q'] == -1
    assert e['beta'] == 'overwritten'
    assert e['added'] == 'value'

    # mixins
    t = Task().component(('thenode', '_trait_'), ('thechildren', '_extended_'))
    e, m = to_config(test_project, t)
    assert e['alpha'] == 0
    assert e['key']['very'] == 'powerful'
    assert m['alpha'] == 0
    assert m['key']['mixing'] == 'is'
