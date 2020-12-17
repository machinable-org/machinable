import inspect

from ...utils.importing import ModuleClass
from ...utils.utils import is_valid_variable_name

_register = {
    "submission": {},
    "component": {},
}

_used_attributes = {
    "submission": {
        "host",
        "model",
        "unique_id",
        "create",
        "timestamp",
        "code_diff",
        "code_backup",
        "serialize",
        "project_name",
        "_cache",
        "components",
        "is_finished",
        "submission_id",
        "seed",
        "submissions",
        "find_many",
        "started_at",
        "code_version",
        "file",
        "finished_at",
        "_model",
        "experiment_name",
        "ancestor",
        "view",
        "url",
        "find",
        "is_started",
        "engine",
    },
    "component": {
        "config",
        "started_at",
        "data",
        "is_started",
        "file",
        "status",
        "view",
        "output",
        "serialize",
        "flags",
        "get_records",
        "records",
        "is_finished",
        "is_incomplete",
        "state",
        "has_records",
        "_model",
        "finished_at",
        "create",
        "heartbeat_at",
        "components",
        "submission",
        "url",
        "_cache",
        "log",
        "component_id",
        "unique_id",
        "is_active",
        "tuning",
        "host",
        "engine",
    },
}


def get(view_type, instance, name=None):
    try:
        return _register[view_type][name](instance)
    except KeyError:
        return None


class Views:
    @classmethod
    def clear(cls, types=None):
        if types is None:
            types = ["submission", "component"]
        if isinstance(types, str):
            types = [types]
        for k in types:
            _register[k] = {}

    @classmethod
    def component(cls, view=None, *, name=None):
        if name is not None:
            if not is_valid_variable_name(name):
                raise ValueError(f"'{name}' is not a valid Python attribute name")

            if name in _used_attributes["component"]:
                raise ValueError(
                    f"Name '{name}' is an existing attribute of SubmissionComponent and cannot be used to bind the view."
                )

        def _decorate(f):
            if isinstance(f, str):
                f = ModuleClass(f, baseclass=SubmissionComponentView)
            else:
                if not inspect.isclass(f):
                    raise ValueError(f"View has to be a class")
            _register["component"][name] = f

            return f

        if view:
            return _decorate(view)

        return _decorate

    @classmethod
    def submission(cls, view=None, *, name=None):
        if name is not None:
            if not is_valid_variable_name(name):
                raise ValueError(f"'{name}' is not a valid Python attribute name")

            if name in _used_attributes["submission"]:
                raise ValueError(
                    f"Name '{name}' is an existing attribute of Submission and cannot be used to bind the view."
                )

        def _decorate(f):
            if isinstance(f, str):
                f = ModuleClass(f, baseclass=SubmissionView)
            else:
                if not inspect.isclass(f):
                    raise ValueError(f"View has to be a class")

            _register["submission"][name] = f

            return f

        if view:
            return _decorate(view)

        return _decorate


class SubmissionView:
    register = Views.submission

    def __init__(self, submission):
        from ..submission import Submission

        self.submission: Submission = Submission.create(submission)


class SubmissionComponentView:
    register = Views.component

    def __init__(self, submission, component: int = 0):
        from ..submission import Submission
        from ..component import SubmissionComponent

        if isinstance(submission, SubmissionComponent):
            self.submission: SubmissionComponent = submission
        else:
            self.submission: SubmissionComponent = Submission.find(
                submission, component=component, or_fail=True
            )
