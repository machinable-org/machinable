import machinable
import pytest


def test_session():
    assert machinable.get("component") is None
    assert machinable.execute("session", project="./test_project").failures == 0
    assert machinable.get("component") is None
    with pytest.raises(ValueError):
        machinable.get("invalid")
