from typing import TYPE_CHECKING, Dict, List, Optional, Tuple

import sys

from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import ElementType


def cli() -> Dict:
    from omegaconf import OmegaConf

    return OmegaConf.to_container(OmegaConf.from_cli())


def parse(args: List) -> Tuple[List["ElementType"], str]:
    elements = []
    method = None
    dotlist = []
    version = None
    for arg in args:
        if "=" in arg:
            # dotlist
            if not isinstance(version, list):
                raise ValueError(f"Update {arg} has to follow a module.")
            dotlist.append(arg)
        elif arg.startswith("~"):
            # version
            if not isinstance(version, list):
                raise ValueError(f"Version {arg} has to follow a module.")
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
            if isinstance(version, list):
                # parse prior version
                if len(dotlist) > 0:
                    version.append(
                        OmegaConf.to_container(OmegaConf.from_dotlist(dotlist))
                    )
                    dotlist = []
                elements[-1].extend(version)

            version = []
            elements.append([arg])

    if isinstance(version, list):
        # parse prior version
        if len(dotlist) > 0:
            version.append(
                OmegaConf.to_container(OmegaConf.from_dotlist(dotlist))
            )
            dotlist = []
        elements[-1].extend(version)

    return elements, method


def main(args: Optional[List] = None):
    import machinable

    if args is None:
        args = sys.argv[1:]
    elements, method = parse(args)

    if len(elements) == 0:
        if method == "version":
            version = machinable.get_version()
            print(version)
            return version

        return None

    experiment = None
    for module, *version in elements:
        element = machinable.get(module, version)
        element.__enter__()
        if isinstance(element, machinable.Experiment):
            experiment = element

    if experiment is None:
        raise ValueError("You have to provide an experiment")

    target = getattr(experiment, method)

    return target()
