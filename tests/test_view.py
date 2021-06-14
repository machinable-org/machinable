import pytest
from machinable import Project, View
from machinable.errors import ConfigurationError, MachinableError


def test_view():
    Project("./tests/samples/project").connect()
    with pytest.raises(ModuleNotFoundError):
        View.make("non.existing", None)
    with pytest.raises(ConfigurationError):
        View.make("views.empty", None)
    with pytest.raises(MachinableError):
        View.make("views.invalid", None)
    view = View.make("views.basic", 1)
    assert view.element == 1
