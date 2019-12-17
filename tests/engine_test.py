import os
from machinable.engine.history import get_history


def test_history():
    h = get_history(file='_test_history')
    h.reset()

    h.add('test')
    assert os.path.isfile(h.url)
    assert len(h) == 1
    h.add('test')
    assert len(h) == 1
    assert len(h.available()) == 0
    h.add('')
    h.add(' ')
    h.add('  ')
    assert len(h) == 1
    h.reset()
    # horizon
    for i in range(200):
        h.add(str(i))
    assert len(h) == 15
    assert sum(map(int, h.data)) == 2880

    h2 = get_history(reload=True, file='_test_history')
    assert len(h2) == 15
    h2.add('')
    assert len(h2) == 15
