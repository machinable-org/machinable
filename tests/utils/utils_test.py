from machinable.utils.utils import is_valid_module_path


def test_is_valid_module_path():
    assert is_valid_module_path("test") is True
    assert is_valid_module_path("test.valid") is True
    assert is_valid_module_path("test$.invalid") is False
    assert is_valid_module_path("test..invalid") is False
