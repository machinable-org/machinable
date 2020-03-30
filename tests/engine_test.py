import os
from machinable.engine.history import get_history
from machinable.engine.settings import get_settings


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


def test_settings():
    q = get_settings(file='./observations/test_data/not-existing')
    assert not q['cache']['imports']

    # empty file
    open('./observations/test_data/empty', 'w').close()
    q = get_settings(file='./observations/test_data/empty')
    assert not q['cache']['imports']
