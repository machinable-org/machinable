import machinable
from machinable.session import get
import pytest


def test_session():
    assert machinable.session.get("component", default=None) is None
    assert machinable.execute("session", project="./test_project").failures == 0
    assert machinable.session.get("component", default=None) is None
    with pytest.raises(ValueError):
        machinable.session.get("invalid", default=None)
    with pytest.raises(RuntimeError):
        get("component")
