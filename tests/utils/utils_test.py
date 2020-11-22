import pytest

from machinable.utils.utils import call_with_context, is_valid_module_path


def test_is_valid_module_path():
    assert is_valid_module_path("test") is True
    assert is_valid_module_path("test.valid") is True
    assert is_valid_module_path("test$.invalid") is False
    assert is_valid_module_path("test..invalid") is False


def test_call_with_context():
    assert call_with_context(lambda: True) is True
    assert call_with_context(lambda: True, test="test") is True
    assert call_with_context(lambda test: test, test="test") == "test"
    assert call_with_context(
        lambda test1, test2: (test1, test2), test1="test2", test2="test1"
    ) == ("test2", "test1")
    with pytest.raises(ValueError):
        assert call_with_context(lambda unknown: unknown, test="test")

    class T:
        def f(self, a):
            return a

        @staticmethod
        def s(a):
            return a

    assert call_with_context(T().f, a="test") == "test"
    assert call_with_context(T().s, a="test") == "test"
