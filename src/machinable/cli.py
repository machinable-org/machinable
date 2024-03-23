from typing import TYPE_CHECKING, Dict, List, Optional, Tuple

import sys

from machinable.project import Project
from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import ElementType, VersionType


def parse(args: List) -> tuple:
    kwargs = []
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
        if arg.startswith("**kwargs="):
            kwargs.append(
                OmegaConf.to_container(OmegaConf.from_dotlist([arg[2:]]))[
                    "kwargs"
                ]
            )
        elif "=" in arg:
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
            methods.append((len(elements), arg[2:]))
        else:
            # module
            _push(elements, dotlist, version)
            dotlist = []
            version = []
            # auto-complete `.project` -> `interface.project`
            if arg.startswith("."):
                arg = "interface" + arg
            elements.append([arg])
            if len(elements) - 1 > len(kwargs):
                kwargs.append({})
            if len(elements) - 1 != len(kwargs):
                raise ValueError(f"Multiple **kwargs for {arg}")

    _push(elements, dotlist, version)
    if len(elements) > len(kwargs):
        kwargs.append({})
    if len(elements) != len(kwargs):
        raise ValueError(f"Multiple **kwargs for last interface")

    return elements, kwargs, methods


def from_cli(args: Optional[List] = None) -> "VersionType":
    if args is None:
        args = sys.argv[1:]

    elements, _, _ = parse(args)

    return sum(elements, [])


def main(args: Optional[List] = None):
    import machinable

    if args is None:
        args = Project.get().provider().on_parse_cli()
        if isinstance(args, int):
            # user implemented CLI, forward exit code
            return args

    if len(args) == 0:
        print("\nhelp")
        print("\nversion")
        print("\nget")
        return 0

    action, args = args[0], args[1:]

    if action == "help":
        h = "get"
        if len(args) > 0:
            h = args[0]

        if h == "get":
            print("\nmachinable get [element_module...] [version...] --method")
            print("\nExample:")
            print(
                "\tmachinable get my_component ~ver arg=1 nested.arg=2 --launch\n"
            )
            return 0
        elif h == "version":
            print("\nmachinable version")
            return 0
        else:
            print("Unrecognized option")
            return 128

    if action == "version":
        version = machinable.get_version()
        print(version)
        return 0

    if action.startswith("get"):
        get = machinable.get
        if action != "get":
            get = getattr(get, action.split(".")[-1])

        elements, kwargs, methods = parse(args)
        contexts = []
        component = None
        for i, (module, *version) in enumerate(elements):
            element = get(module, version, **kwargs[i])
            if i == len(elements) - 1:
                component = element
            else:
                contexts.append(element.__enter__())

        if component is None:
            raise ValueError("You have to provide at least one interface")

        for i, method in methods:
            # check if cli_{method} exists before falling back on {method}
            target = getattr(
                component, f"cli_{method}", getattr(component, method)
            )
            if callable(target):
                target()
            else:
                print(target)

        for context in reversed(contexts):
            context.__exit__()

        return 0

    print("Invalid argument")
    return 128
