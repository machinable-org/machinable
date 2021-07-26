import pytest
from machinable.group import normgroup, resolve_group


def test_normgroup():
    assert normgroup(None) == ""
    assert normgroup("test") == "test"
    assert normgroup("/test") == "test"
    assert normgroup("/test/me") == "test/me"
    assert normgroup("test/") == "test/"

    with pytest.raises(ValueError):
        normgroup({"invalid"})


def test_resolve_group():
    assert resolve_group("test") == ("test", "test")
    assert resolve_group("/test%Y") != ("/test%Y", "/test%Y")
    assert resolve_group("/test/me") == ("test/me", "test/me")
