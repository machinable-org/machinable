import pytest

from machinable import Submission
from machinable.submission import SubmissionComponentView, Views
from machinable.submission.views.views import _used_attributes


def test_allowed_attribute_list():
    e = Submission.find("./_test_data/storage/tttttt")
    a = (
        set(filter(lambda x: not x.startswith("__"), dir(e)))
        - _used_attributes["submission"]
    )
    assert len(a) == 0, f"Attribute list does not match: {a}"
    a = (
        set(filter(lambda x: not x.startswith("__"), dir(e.components.first())))
        - _used_attributes["component"]
    )
    assert len(a) == 0, f"Attribute list does not match: {a}"


def test_submission_views():
    @Views.submission
    class SubmissionView:
        def __init__(self, submission):
            self.submission = submission

        def forward(self):
            return self.submission.submission_id

        def ref(self):
            return self.forward()

    class ComponentView:
        def __init__(self, submission):
            self.submission = submission

        def forward(self):
            return self.submission.component_id

        def ref(self):
            return self.forward()

    SubmissionComponentView.register(ComponentView)

    @Views.component(name="custom")
    class ComponentWithName:
        def __init__(self, submission):
            self.submission = submission

        @property
        def test(self):
            return "hello"

    e = Submission.find("./_test_data/storage/tttttt")
    assert e.view.forward() == "tttttt"
    assert e.view.ref() == "tttttt"
    assert e.components.first().view.forward() == e.components.first().view.ref()
    assert e.components.first().custom.test == "hello"

    Views.clear()
    assert e.view is None
    assert e.components.first().view is None
    with pytest.raises(AttributeError):
        _ = e.components.first().custom

    with pytest.raises(ValueError):
        Views.component("existing attribute", name="data")

    with pytest.raises(ValueError):
        Views.submission("invalid attribute", name="$name")

    assert SubmissionView(e).forward() == e.submission_id
