from machinable import Interface, get
from machinable.scope import Scope


def test_scope_element():
    scope = Scope()
    assert scope() == {"unique_id": scope.uuid}
    assert Scope({"test": 1})() == {"test": 1}
    assert Scope([{"a": 1}, {"a": 2}])() == {"a": 2}


def test_scoping(tmp_storage):
    class T(Interface):
        Config = {"a": 1}

    e1 = get(T, {"a": 2}).commit()
    with Scope({"name": "test"}):
        e2 = get(T, {"a": 2}).commit()
        assert e2 != e1
    assert len(get(T, {"a": 2}).all()) == 2
    with Scope({"name": "test"}):
        assert get(T, {"a": 2}).commit() != e1

    e3 = get(T).commit()
    assert e1 != e2 != e3
    assert get(T, {"a": 2}) == e2
