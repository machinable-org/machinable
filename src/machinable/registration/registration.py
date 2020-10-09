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

    def on_before_storage_creation(self, execution):
        """Event triggered right before the storage is created

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

    def on_before_component_import(self, module, baseclass, default):
        """Event triggered before a component is imported from a module

        You can prevent the import and return a component from this method to be used instead.

        # Arguments
        module: String, the module path that is about to be imported
        baseclass: The component baseclass (either Component or Mixin)
        default: Optional default component that will be used if import fails
        """
        pass

    def on_component_import(self, component_candidate, module, baseclass, default):
        """Event triggered during component import from a module

        You can override the component candidate by returning a component from this method.

        # Arguments
        component_candidate: Imported component candidate.
          Can also be instance of ImportError if the import failed or AttributeError if
          the imported module did not contain a component which allows you to implement
          a custom exception behaviour.
        module: String, the module path that is about to be imported
        baseclass: The component baseclass (either Component or Mixin)
        default: Optional default component that will be used if import fails
        """
        pass

    def default_resources(self, engine, component, components):
        """Allows to specify global default resources"""
        return None
