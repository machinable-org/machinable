import pytest

from machinable.storage import get_experiment
from machinable.storage.views import StorageView


def test_storage_views():
    @StorageView.experiment
    class ExperimentView:
        def forward(self):
            return self.experiment_id

        def ref(self):
            return self.view.forward()

    class ComponentView:
        def forward(self):
            return self.component_id

        def ref(self):
            return self.view.forward()

    StorageView.component(ComponentView)

    @StorageView.component(name="custom")
    class ComponentWithName:
        @property
        def test(self):
            return "hello"

    e = get_experiment("./_test_data/storage/tttttt")
    assert e.view.forward() == "tttttt"
    assert e.view.ref() == "tttttt"
    assert e.components.first().view.forward() == e.components.first().view.ref()
    assert e.components.first()._custom_.test == "hello"

    StorageView.clear()
    assert e.view is None
    assert e.components.first().view is None
    with pytest.raises(AttributeError):
        _ = e.components.first()._custom_
