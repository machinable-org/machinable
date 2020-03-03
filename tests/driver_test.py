import os

from machinable import Engine
import machinable as ml


def test_local_driver():
    e = Engine(os.path.abspath('test_project'))
    t = ml.Task().component('thenode', 'thechildren').repeat(2)
    ml.execute(t, driver=None, engine=e)


def test_ray_driver():
    e = Engine(os.path.abspath('test_project'))
    t = ml.Task().component('thenode', 'thechildren').repeat(2)
    ml.execute(t, driver='ray', engine=e)


def test_multiprocessing_driver():
    e = Engine(os.path.abspath('test_project'))
    t = ml.Task().component('thenode', 'thechildren').repeat(5)
    ml.execute(t, driver='multiprocessing:2', engine=e)
