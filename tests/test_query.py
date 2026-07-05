# Note that most query testing can be found in test_interface_modifiers
from machinable import Execution, get


def test_query_from_directory(tmp_storage):
    t = Execution.make("dummy").launch()
    t2 = get.from_directory(t.local_directory())
    assert t == t2


def test_query_by_id(tmp_storage):
    t = Execution.make("dummy").launch()
    t2 = get.by_id(t.uuid)
    assert t == t2
    t3 = get.by_id("nonexistent")
    assert t3 is None
