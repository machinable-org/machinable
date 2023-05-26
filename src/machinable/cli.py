from typing import TYPE_CHECKING, Dict, List, Optional, Tuple

import sys

from machinable.project import Project
from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import ElementType, VersionType


def parse(args: List) -> Tuple[List["ElementType"], str]:
    methods = []
    elements = []
    dotlist = []
    version = []

    def _push(_elements, _dotlist, _version):
        if len(dotlist) > 0:
            _version.append(
                OmegaConf.to_container(OmegaConf.from_dotlist(_dotlist))
            )

        if len(_version) > 0:
            if len(_elements) > 0:
                _elements[-1].extend(_version)
            else:
                _elements.append(_version)

    for arg in args:
        if "=" in arg:
            # dotlist
            dotlist.append(arg)
        elif arg.startswith("~"):
            # version
            if len(dotlist) > 0:
                # parse preceding dotlist
                version.append(
                    OmegaConf.to_container(OmegaConf.from_dotlist(dotlist))
                )
                dotlist = []
            version.append(arg)
        elif arg.startswith("--"):
            # method
            methods.append(arg[2:])
        else:
            # module
            _push(elements, dotlist, version)
            dotlist = []
            version = []
            elements.append([arg])

    _push(elements, dotlist, version)

    return elements, methods


def from_cli(args: Optional[List] = None) -> "VersionType":
    if args is None:
        args = sys.argv[1:]

    elements, _ = parse(args)

    return sum(elements, [])


def main(args: Optional[List] = None):
    import machinable

    if args is None:
        args = Project.get().provider().on_parse_cli()
        if isinstance(args, int):
            # user implemented CLI, forward exit code
            return args

    elements, methods = parse(args)

    if len(elements) == 0 and len(methods) <= 1:
        method = methods[0] if len(methods) == 1 else None
        if method == "version":
            version = machinable.get_version()
            print(version)
            return 0

        if method == "help" or method is None:
            print("\nmachinable [element_module...] [version...] --method")
            print("\nExample:")
            print(
                "\tmachinable my_component ~ver arg=1 nested.arg=2 --launch\n"
            )
            return 0

        print("Invalid argument: ", method)
        return 128

    contexts = []
    component = None
    for module, *version in elements:
        element = machinable.get(module, version)
        contexts.append(element.__enter__())
        if isinstance(element, machinable.Component):
            component = element

    if component is None:
        raise ValueError("You have to provide an component")

    for method in methods:
        # check if cli_{method} exists before falling back on {method}
        target = getattr(component, f"cli_{method}", getattr(component, method))
        target()

    for context in reversed(contexts):
        context.__exit__()

    return 0
