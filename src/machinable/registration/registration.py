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

    def experiment_directory(self):
        """
        Overwrites the default experiment directory.
        """
        return None
