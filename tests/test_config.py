import omegaconf
from machinable.config import (
    from_element,
    match_method,
    rewrite_config_methods,
    to_dict,
)


def test_config_from_element():
    class Dummy:
        pass

    assert from_element(Dummy) == ({}, None)

    class HasConf:
        class Config:
            q: int = 1

    assert from_element(HasConf)[0]["q"] == 1
    assert from_element(HasConf())[0]["q"] == 1

    class DictConf:
        Config = {"a": 2}

    assert from_element(DictConf)[0]["a"] == 2


def test_match_method():
    assert match_method("find_me(a=1)") == ("find_me", "a=1")
    assert match_method("test(1)") == ("test", "1")
    assert match_method("foo") is None
    assert match_method("ma$formed()") is None
    assert match_method("foo(1) < 1") is None
    assert match_method("foo(1) + bar(2)") is None
    assert match_method(" foo(1)") is None


def test_rewrite_config_methods():
    rewrite_config_methods({"test": "test_me(1)"}) == {
        "test": "${config_method:test_me,1}"
    }


def test_to_dict():
    assert to_dict({"a": 1}) == {"a": 1}
    assert to_dict(omegaconf.DictConfig({"a": 1})) == {"a": 1}
    assert to_dict(omegaconf.ListConfig([1, 2, 3])) == [1, 2, 3]
    assert to_dict({"a": omegaconf.DictConfig({"b": 1})}) == {"a": {"b": 1}}
    assert to_dict([1, 2, 3]) == [1, 2, 3]
    assert to_dict((1, 2, 3)) == (1, 2, 3)
    assert to_dict(1) == 1
    assert to_dict("foo") == "foo"
