from machinable.storage import View, get_experiment


def test_storage_view():
    @View.experiment
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

    View.component(ComponentView)

    e = get_experiment("./_test_data/storage/tttttt")
    assert e.view.forward() == "tttttt"
    assert e.view.ref() == "tttttt"
    assert e.components.first().view.forward() == e.components.first().view.ref()

    View.clear()
    assert e.view is None
    assert e.components.first().view is None
