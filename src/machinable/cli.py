from typing import TYPE_CHECKING, Dict, List, Optional, Tuple

import sys

from machinable.project import Project
from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import ElementType, VersionType


def parse(args: List) -> Tuple[List["ElementType"], str]:
    method = None
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
            method = arg[2:]
        else:
            # module
            _push(elements, dotlist, version)
            dotlist = []
            version = []
            elements.append([arg])

    _push(elements, dotlist, version)

    return elements, method


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

    elements, method = parse(args)

    if len(elements) == 0:
        if method == "version":
            version = machinable.get_version()
            print(version)
            return 0

        if method == "help" or method is None:
            print("\nmachinable [element_module...] [version...] --method")
            print("\nExample:")
            print(
                "\tmachinable my_experiment ~ver arg=1 nested.arg=2 --launch\n"
            )
            return 0

        print("Invalid argument: ", method)
        return 128

    experiment = None
    for module, *version in elements:
        element = machinable.get(module, version)
        element.__enter__()
        if isinstance(element, machinable.Experiment):
            experiment = element

    if experiment is None:
        raise ValueError("You have to provide an experiment")

    if method is None:
        print(experiment)
        return 0

    # check if cli_{method} exists before falling back on {method}
    target = getattr(experiment, f"cli_{method}", getattr(experiment, method))

    target()

    return 0
