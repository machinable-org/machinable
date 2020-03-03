import os
import machinable as ml
from machinable.engine import Engine


def test_decorator():
    @ml.execute
    def run(node, children, observer):
        observer.log.info('Custom training with learning_rate=' + str(node.config.a))
        assert children[0].config.alpha == 0
        raise ValueError('Sucessful execution')

    e = Engine(os.path.abspath('test_project'))

    t = ml.Task().component('thenode', 'thechildren')
    try:
        run(t, seed=1, engine=e)
        assert False
    except ValueError:
        pass
