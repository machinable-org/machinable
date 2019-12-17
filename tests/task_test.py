import os
import machinable as ml
from machinable.task.parser import parse_task
from machinable.config.interface import ConfigInterface
from machinable.project import Project
from machinable.engine import Engine


def seeding_test(spec):
    assert len(set([e.flags['GLOBAL_SEED'] for e, _, _ in spec])) == 1  # repeats share same GLOBAL_SEED
    assert len(set([e.flags['SEED'] for e, _, _ in spec])) > 1  # has unique SEED


def test_task_parser():
    # repeat behaviour
    t = ml.Task().component('test')
    assert len(list(parse_task(t.specification))) == 1
    t = ml.Task().component('test').repeat(1)
    assert len(list(parse_task(t.specification))) == 1

    t = ml.Task().component('test').repeat(5)
    spec = list(parse_task(t.specification))
    assert len(spec) == 5
    seeding_test(spec)

    t = ml.Task().component(('test', '~v'), ('test', '~v')).repeat(3)
    spec = list(parse_task(t.specification))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Task().component('test').repeat(3).split(2)
    spec = list(parse_task(t.specification))
    assert len(spec) == 6
    seeding_test(spec)

    t = ml.Task().component(('test', [{'a': i} for i in range(3)]))
    spec = list(parse_task(t.specification))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Task().component(('test', [{'a': i} for i in range(3)])).repeat(3)
    spec = list(parse_task(t.specification))
    assert len(spec) == 9
    seeding_test(spec)

    t = ml.Task().component('test', ('test', [{'a': i} for i in range(3)]))
    spec = list(parse_task(t.specification))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Task().component('test', [('test', [{'a': i} for i in range(3)]), ('test', [{'a': i} for i in range(3)])])
    spec = list(parse_task(t.specification))
    assert len(spec) == 9
    seeding_test(spec)

    t = ml.Task().component('test', ('test', [{'sub': lr} for lr in range(5)]))
    spec = list(parse_task(t.specification))
    assert len(spec) == 5
    seeding_test(spec)


def test_execution_modes():
    e = Engine(os.path.abspath('test_project'))

    # dry run
    t = ml.Task().component('dryrun').dry(verbosity=5)
    assert t.specification.get('dry')['arguments']['verbosity'] == 5
    ml.execute(t, engine=e)

    t = ml.Task().component('thenode').confirm(timeout=10)
    assert t.specification.get('confirm')['arguments']['timeout'] == 10


def test_task_export():
    e = Engine(os.path.abspath('test_project'), mode='DEFAULT')
    ml.execute(ml.Task().component('nodes.observations', 'export_model').export(overwrite=True),
               storage='./observations/test_data',
               engine=e)


def test_task_config():
    e = Engine(os.path.abspath('test_project'))

    test_project = Project('test_project')
    config = test_project.parse_config()

    t = ml.Task().component(('nodes.observations', {'attr': 'node'}), ('workers.interactive', {'id': 2}))
    node, children, resources = list(parse_task(t.specification))[0]
    conf = ConfigInterface(config, t.specification['version'])
    node_config = conf.get(node)['args']
    child_config = conf.get(children[0])['args']

    assert node_config['attr'] == 'node'
    assert child_config['attr'] == 'worker'

    t = ml.Task().component(('nodes.observations', {'attr': 'node'}), ('workers.interactive', {'id': 2})).version('~test')
    node, children, resources = list(parse_task(t.specification))[0]
    conf = ConfigInterface(config, t.specification['version'])
    node_config = conf.get(node)['args']
    assert node_config['version'] == 0
    child_config = conf.get(children[0])['args']
    assert child_config['version'] == 1

