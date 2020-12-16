class Registration:

    _instance = None

    @classmethod
    def reset(cls, instance=None):
        cls._instance = instance

    @classmethod
    def get(cls) -> "Registration":
        if not isinstance(cls._instance, Registration):
            cls._instance = cls()

        return cls._instance

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

    def on_before_component_construction(self):
        """Event triggered before the component is constructed.

        For example, if the component module requires environment variables etc. before initial construction,
        this event can be used to set them.

        # Arguments

        """

    # disable unless overridden
    on_before_component_construction._deactivated = True

    def on_before_component_import(self, module, baseclass, default):
        """Event triggered before a component is imported from a module

        You can prevent the import and return a component or an alternative module import path
        from this method to be used instead.

        # Arguments
        module: String, the module path that is about to be imported
        baseclass: The component baseclass (either Component or Mixin)
        default: Optional default component that will be used if import fails
        """

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

    def on_resolve_vendor(self, name, config, target):
        """Event triggered when vendor is resolved

        machinable attempts to fetch any vendor directories that
        are registered under the '+'-section in the machinable.yaml

        # Arguments
        name: The name of the vendor
        config: The vendor configuration from the machinable.yaml
        target: The target directory (may or may not exists yet)

        Return False to prevent the default automatic resolution
        """

    def host_information(self) -> dict:
        """Returned dictionary will be recorded as host information

        Note that explicitly registered host methods take precedence over returned data
        """
        return {}

    def default_resources(self, engine, component, components):
        """Allows to specify global default resources"""
        return None

    def default_code_backup(self, execution):
        """Allows to specify global default code backup settings"""
        return None
