import importlib

from ..utils.formatting import exception_to_str, msg


class Registration:

    instance = None

    @classmethod
    def get(cls):
        if cls.instance is not None:
            return cls.instance

        try:
            registration_module = importlib.import_module("_machinable")
            registration_class = getattr(registration_module, "Project", False)
            if registration_class:
                cls.instance = registration_class()
                return cls.instance
        except ImportError as e:
            if e.args and e.args[0] == "No module named '_machinable'":
                pass
            else:
                msg(
                    f"Could not import project registration. {e}\n{exception_to_str(e)}",
                    level="error",
                    color="fail",
                )

        cls.instance = Registration()
        return cls.instance

    def on_before_submit(self, execution):
        """Event triggered before submission of an execution

        Return False to prevent the execution

        # Arguments
        execution: machinable.Execution object
        """
        pass

    def on_submit(self, execution, is_resubmission):
        """Event triggered during submission of an execution

        Note that the execution has already been written and modifications
        have no effect. Use on_before_submission instead.

        # Arguments
        execution: machinable.Execution object
        is_resubmission: Boolean indicating whether execution is an existing resubmission
        """
        pass
