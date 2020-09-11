import importlib
import os

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
