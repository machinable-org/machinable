import pytest
from machinable.grouping import normgrouping, resolve_grouping


def test_normgrouping():
    assert normgrouping(None) == ""
    assert normgrouping("test") == "test"
    assert normgrouping("/test") == "test"
    assert normgrouping("/test/me") == "test/me"
    assert normgrouping("test/") == "test/"

    with pytest.raises(ValueError):
        normgrouping({"invalid"})


def test_resolve_grouping():
    assert resolve_grouping("test") == ("test", "test")
    assert resolve_grouping("/test%Y") != ("/test%Y", "/test%Y")
    assert resolve_grouping("/test/me") == ("test/me", "test/me")
