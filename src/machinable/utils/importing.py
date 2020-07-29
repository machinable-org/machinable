import importlib
import os

from ..utils.formatting import exception_to_str


def resolve_instance(arg, instance_type, default_path=""):
    if not (isinstance(arg, str) and arg.startswith("@")):
        return None

    if arg.startswith("@/"):
        origin = None
        module_name = arg.replace("@/", "")
    else:
        # if relative path @example insert default path
        origin = arg[1:].replace(".", "/")
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
            if origin:
                instance._resolved_module_origin = origin
            return instance

        raise ValueError(
            f"Could not find any {instance_type.__name__} in module {module_name}"
        )
    except ImportError as e:
        raise ImportError(
            f"Could not import module @{module_name} "
            f"The following exception occurred: {exception_to_str(e)}. "
        )
