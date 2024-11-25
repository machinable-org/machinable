from typing import TYPE_CHECKING, List, Optional

import os
import sys

from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import VersionType


def parse(args: List) -> tuple:
    kwargs = []
    methods = []
    elements = []
    dotlist = []
    version = []

    def _parse_dotlist():
        if len(dotlist) == 0:
            return
        _ver = {}
        for k, v in OmegaConf.to_container(
            OmegaConf.from_dotlist(dotlist)
        ).items():
            if k.startswith("**"):
                kwargs[-1][k[2:]] = v
            else:
                _ver[k] = v
        version.append(_ver)

    def _push():
        if len(version) == 0:
            return

        if len(elements) > 0:
            elements[-1].extend(version)
        else:
            elements.append(version)

    for arg in args:
        if arg.startswith("~"):
            # version
            _parse_dotlist()
            dotlist = []
            version.append(arg)
        elif arg.startswith("--"):
            # method
            methods.append((len(elements), arg[2:]))
        elif "=" in arg:
            # dotlist
            dotlist.append(arg)
        else:
            # module
            _parse_dotlist()
            _push()
            dotlist = []
            version = []
            # auto-complete `.project` -> `interface.project`
            if arg.startswith("."):
                arg = "interface" + arg
            elements.append([arg])
            kwargs.append({})

    _parse_dotlist()
    _push()

    return elements, kwargs, methods


def from_cli(args: Optional[List] = None) -> "VersionType":
    if args is None:
        args = sys.argv[1:]

    elements, _, _ = parse(args)

    return sum(elements, [])


def main(args: Optional[List] = None):
    import machinable

    if args is None:
        args = sys.argv[1:]

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
        sys.path.append(os.getcwd())

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
