import os
import shutil

import machinable as ml
from machinable.engine import Engine


def generate_data(path=None, debug=False):
    # delete and re-create data directory
    if path is None:
        path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'test_data')

    if debug and os.path.exists(path):
        # do not re-generate if existing
        return path

    shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path)

    # run data generator
    e = Engine(os.path.abspath('test_project'))

    ml.execute(ml.Task().name('first').component(('nodes.observations', {'id': 1})).repeat(3), path, engine=e)
    ml.execute(ml.Task().name('second').component(('nodes.observations', {'id': 2}), 'thechildren').repeat(2), path,
               engine=e)
    # re-runs
    for i in range(3):
        ml.execute(ml.Task().name('third').component(('nodes.observations', {'id': 3, 'test': True})).repeat(4), path,
                   seed='tttttt', engine=e)

    ml.execute(ml.Task().name('corrupt').component(('nodes.observations', {'id': 4, 'corrupt': True})),
               path,
               seed='corupt',
               engine=e)

    return path
