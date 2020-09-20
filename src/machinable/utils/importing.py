import importlib
import inspect
import os

from machinable.registration import Registration
from machinable.utils.formatting import exception_to_str

from ..utils.formatting import exception_to_str


def resolve_instance(arg, instance_type, default_path=""):
    if not (isinstance(arg, str) and arg.startswith("@")):
        return None

    if arg.startswith("@/"):
        module_name = arg.replace("@/", "")
    else:
        # if relative path @example insert default path
        module_name = arg.replace("@", os.path.join(default_path, ""), 1)

    module_name = module_name.replace("/", ".")
    module_name = module_name.rstrip(".")

    try:
        instance_type.set_latest(None)
        module = importlib.import_module(module_name)
        importlib.reload(module)

        instance = instance_type.latest()
        if isinstance(instance, instance_type):
            instance._resolved_by_expression = arg
            instance._resolved_module_name = module_name
            return instance

        raise ValueError(
            f"Could not find any {instance_type.__name__} in module {module_name}"
        )
    except ImportError as e:
        raise ImportError(
            f"Could not import module @{module_name} "
            f"The following exception occurred: {exception_to_str(e)}. "
        )


def resolve_instance_from_code(code, instance_type):
    try:
        instance_type.set_latest(None)
        exec(code)

        instance = instance_type.latest()
        if isinstance(instance, instance_type):
            instance._resolved_by_code = code
            return instance

        raise ValueError(f"Could not find any {instance_type.__name__} in code")
    except Exception as e:
        raise ImportError(
            f"Could not evaluate code. The following exception occurred: {exception_to_str(e)}. "
        )


class ModuleClass:
    def __init__(self, module_name, args=None, baseclass=None, allow_overrides=True):
        self.module_name = module_name
        self.args = args
        self.baseclass = baseclass
        self.default_class = None
        self.allow_overrides = allow_overrides

    def load(self, instantiate=True, default=None):
        if default is None:
            default = self.default_class

        if self.allow_overrides:
            registration = Registration.get()
            on_before_component_import = registration.on_before_component_import(
                module=self.module_name, baseclass=self.baseclass, default=default
            )
            if on_before_component_import is not None:
                return on_before_component_import

        module_class = None
        try:
            module = importlib.import_module(self.module_name)
            try:
                # reload if we are in interactive environments like jupyter
                get_ipython().__class__.__name__
                importlib.reload(module)
            except NameError:
                pass

            for candidate, class_ in inspect.getmembers(module, inspect.isclass):
                if self.baseclass is not None and not issubclass(
                    class_, self.baseclass
                ):
                    continue

                if class_.__module__ == self.module_name:
                    module_class = class_
                    break

            if module_class is None:
                module_class = AttributeError(
                    f"Could not load module class from module '{self.module_name}'. "
                    f"Make sure the module contains a class that inherits from "
                    f"the baseclass 'machinable.{self.baseclass.__name__}'"
                )
        except ImportError as e:
            if default is None:
                module_class = ImportError(
                    f"Could not import module '{self.module_name}' "
                    f"that is specified in the machinable.yaml. "
                    f"The following exception occurred: {exception_to_str(e)}. "
                    f"If the module is a directory, consider creating an __init__.py."
                )

        if self.allow_overrides:
            on_component_import = registration.on_component_import(
                component_candidate=module_class,
                module=self.module_name,
                baseclass=self.baseclass,
                default=default,
            )
            if on_component_import is not None:
                return on_component_import

        if isinstance(module_class, (ImportError, AttributeError)):
            raise module_class

        if module_class is None:
            module_class = default

        if not instantiate:
            return module_class

        if self.args is None:
            return module_class()

        return module_class(**self.args)

    def name(self):
        class_ = self.load(instantiate=False)
        return class_.__name__

    def __call__(self, *args, **kwargs):
        class_ = self.load(instantiate=False)
        return class_(*args, **kwargs)

    def __repr__(self):
        return f"ModuleClass(module={self.module_name}, baseclass={self.baseclass})"
