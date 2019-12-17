import os
import machinable as ml


def test_config_method():
    ml.execute('configmethods', engine=ml.Engine(os.path.abspath('test_project')))
