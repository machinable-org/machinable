import os
import shutil

import numpy as np
from machinable.observer import Observer
from machinable import execute, Task, Engine
from helpers import fake_observation_config


def test_observer_storage():
    obs = Observer(fake_observation_config())

    # storage
    obs.store('test.txt', 'test me')
    f = os.path.join(obs.config['group'], obs.config['uid'], 'storage', 'test.txt')
    assert obs.filesystem.readtext(f) == 'test me'
    obs.store('test.npy', np.ones([5]))
    obs.store('test.p', np.ones([5]))
    obs.store('test.json', [1, 2, 3])
    obs.store('dir/test.txt', 'subdirectory')
    f = os.path.join(obs.config['group'], obs.config['uid'], 'storage', 'dir/test.txt')
    assert obs.filesystem.readtext(f) == 'subdirectory'
    f = os.path.join(obs.config['group'], obs.config['uid'], 'storage.json')
    obs.store('test', True)
    assert obs.filesystem.readtext(f) == '{"test": true}'
    obs.store('bla', 1)
    assert obs.filesystem.readtext(f) == '{"test": true, "bla": 1}'

    # observations
    obs.record['test'] = 1
    assert obs.record['test'] == 1

    # log
    obs.log.info('test')


def test_records_timing():
    e = Engine(os.path.abspath('test_project'))
    execute(Task().component('timings'), engine=e)


def test_output_redirection(capsys):
    storage = './observations/test_data/output_redirection'

    for mode in ['SYS_AND_FILE', 'FILE_ONLY', 'DISCARD']:
        if os.path.exists(storage):
            shutil.rmtree(storage, ignore_errors=True)

        print('non-captured')
        o = Observer({'uid': '654321', 'storage': storage, 'output_redirection': mode})
        print('captured')
        o.destroy()
        print('non-captured-again')
        if mode == 'DISCARD':
            assert not os.path.isfile(os.path.join(storage, '654321/output.log'))
        else:
            with open(os.path.join(storage, '654321/output.log'), 'r') as f:
                assert f.read() == 'captured\n'

        assert capsys.readouterr().out == {
            'SYS_AND_FILE': "non-captured\ncaptured\nnon-captured-again\n",
            'FILE_ONLY': "non-captured\nnon-captured-again\n",
            'DISCARD': "non-captured\nnon-captured-again\n"
        }[mode]
