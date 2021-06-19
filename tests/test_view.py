import pytest
from machinable import Experiment, Project
from machinable.errors import ConfigurationError, MachinableError
from machinable.view import from_element, get


def test_view():
    Project("./tests/samples/project").connect()
    with pytest.raises(ModuleNotFoundError):
        get("non.existing", Experiment)
    with pytest.raises(ConfigurationError):
        get("views.empty", Experiment)

    experiment = Experiment("dummy")
    with pytest.raises(MachinableError):
        from_element("views.invalid", experiment)

    view = from_element("views.basic", experiment)
    assert view.experiment_id == experiment.experiment_id
    assert view.hello() == "there"
