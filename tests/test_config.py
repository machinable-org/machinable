import omegaconf
import pytest
from pydantic import BaseModel

from machinable.config import (
    from_interface,
    match_method,
    rewrite_config_methods,
    to_dict,
)
from machinable.errors import ConfigurationError


def test_config_from_interface():
    class Dummy:
        pass

    assert from_interface(Dummy) == ({}, None)

    class HasConf:
        class Config(BaseModel):
            q: int = 1

    assert from_interface(HasConf)[0]["q"] == 1
    assert from_interface(HasConf())[0]["q"] == 1


def test_config_rejects_non_pydantic():
    # plain dict / bare-class / dataclass Config are no longer supported
    class DictConf:
        Config = {"a": 2}

    with pytest.raises(ConfigurationError):
        from_interface(DictConf)

    class BareConf:
        class Config:
            a: int = 1

    with pytest.raises(ConfigurationError):
        from_interface(BareConf)


def test_match_method():
    assert match_method("find_me(a=1)") == ("find_me", "a=1")
    assert match_method("test(1)") == ("test", "1")
    # nested parentheses are allowed as long as they balance
    assert match_method("fit(bounds=(0, 1))") == ("fit", "bounds=(0, 1)")
    assert match_method("f(g(1), h=(2,))") == ("f", "g(1), h=(2,)")
    assert match_method("foo") is None
    assert match_method("ma$formed()") is None
    assert match_method("foo(1) < 1") is None
    assert match_method("foo(1) + bar(2)") is None
    assert match_method("foo(a=(1)") is None
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
