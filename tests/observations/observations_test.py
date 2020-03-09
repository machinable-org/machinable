import shutil
import os
import pytest

import machinable as ml
from .generator import generate_data

observations_directory = None


def _setup(debug=False):
    global observations_directory
    # remove the local database
    config_directory = os.path.expanduser('~/.machinable')
    shutil.rmtree(config_directory, ignore_errors=True)
    os.makedirs(config_directory)
    # generate data
    observations_directory = generate_data(debug=debug)
    # delete some data
    shutil.rmtree(os.path.join(observations_directory, 'corupt'), ignore_errors=True)
    mlo = ml.Observations()
    mlo.reset()
    mlo.add(observations_directory)
    return mlo


def test_observations():
    mlo = _setup(debug=False)
    
    # storages
    mlo.reset()
    assert len(mlo.storages) == 0
    mlo.add(observations_directory)
    assert len(mlo.storages) == 1
    # re-add does not re-add
    for k in range(3):
        mlo.add(observations_directory)
    assert len(mlo.storages) == 1
    assert mlo.remove('never added') is None
    assert len(mlo.storages) == 1
    mlo.remove(observations_directory)
    assert len(mlo.storages) == 0
    mlo.add(observations_directory)

    # standard queries
    assert mlo.find('4NrOUdnAs6A5').config.test
    assert len(mlo.find_by_task('tttttt')) == 12
    assert len(mlo.find_by_task(['tttttt'])) == 12
    assert len(mlo.find_by_task_name('first')) == 3
    assert len(mlo.find_by_node_component('nodes.observations')) == len(mlo.find_all())
    assert len(mlo.find_by_most_recent_task()) == 12
    assert len(mlo.find_by_execution(mlo.find('tttttt').first().execution_id)) == 4
    assert len(mlo.find_by_execution(mlo.find('tttttt'))) == 4

    # query builder
    assert len(mlo.query.where_task('tttttt').rerun(1).get()) == 4

    # collections
    assert mlo.find_by_task('tttttt').where('config.to_test', 'observations').count() == 12


def test_observation_view():
    mlo = _setup(debug=False)
    observation = mlo.query.where_task('tttttt').rerun(1).first()
    assert observation.is_finished()
    assert observation.storage.endswith('/test_data')
    assert observation.execution_id == observation.task.execution_id
    assert observation.task.id == 'tttttt'
    assert observation.task.is_finished()
    assert observation.task.code_version.project.path is None
    assert observation.flags.NAME == 'nodes.observations'
    assert observation.config.to_test == 'observations'
    assert len(observation.children) == 0
    assert observation.store('data.json')['observation_id'] > 0
    assert observation.store('test') == 2
    assert observation.store('key') == 'value'
    assert 'test' in observation.store()
    assert len(observation.store()['$files'])
    assert len(observation.host) == 6
    assert len(observation.get_records_writer()) == 2
    # aliases
    o = mlo.find_by_task_name('second').first()
    assert o.custom_child_attribute.config.alpha == 0
    assert o.custom_child_attribute.component == 'thechildren'


def test_records_view():
    mlo = _setup(debug=False)
    obs = mlo.query.where_task('tttttt').rerun(1).first()
    records = obs.records
    assert len(records.query.where('constant', '>=', 40).get()) == 6
    # custom records scope
    custom = obs.get_records_writer('validation')
    assert custom.sum('iteration') == 15
    assert records.as_dataframe().size > 0


def test_collections():
    mlo = _setup(debug=False)
    task = mlo.query.where_task('tttttt').get()
    import numpy as np
    def o(x):
        return x.records.pluck('number')
    assert max(task.section(o, reduce=np.var)) > 0
    df = mlo.find_by_task('tttttt').as_dataframe()
    assert df.size == 12 * 12
    print(df.dtypes)
    obs = mlo.query.where_task('tttttt').first()
    num_elements = len(obs.records.pluck('number'))
    with pytest.raises(KeyError):
        obs.records.pluck('not_existing')
    nones = obs.records.pluck_or_none('not_existing')
    assert all([e is None for e in nones])
