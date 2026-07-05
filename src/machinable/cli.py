"""The ``machinable`` command-line interface."""

import os
import sys
from typing import TYPE_CHECKING, cast

from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.types import VersionType


def parse(args: list) -> tuple:
    """Parse CLI arguments into elements, kwargs, and method calls."""
    kwargs = []
    methods = []
    elements = []
    dotlist = []
    version = []

    def _parse_dotlist():
        if len(dotlist) == 0:
            return
        _ver = {}
        container = cast(dict, OmegaConf.to_container(OmegaConf.from_dotlist(dotlist)))
        for k, v in container.items():
            key = str(k)
            if key.startswith("**"):
                kwargs[-1][key[2:]] = v
            else:
                _ver[key] = v
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


def from_cli(args: list | None = None) -> "VersionType":
    """Parse CLI-style arguments into a compact version list."""
    if args is None:
        args = sys.argv[1:]

    elements, _, _ = parse(args)

    return sum(elements, [])


def _run_mcp(args: list) -> int:
    """Launch the research MCP server (stdio by default).

    ``machinable mcp [--project DIR] [--token T] [--read-only]
    [--http --host H --port P]``
    """
    project = os.getcwd()
    token = None
    read_only = False
    transport = "stdio"
    host, port = "127.0.0.1", 8765

    it = iter(args)
    for arg in it:
        if arg == "--project":
            project = next(it)
        elif arg == "--token":
            token = next(it)
        elif arg == "--read-only":
            read_only = True
        elif arg == "--http":
            transport = "http"
        elif arg == "--host":
            host = next(it)
        elif arg == "--port":
            port = int(next(it))

    from machinable.mcp.server import create_server

    server = create_server(project, token=token, read_only=read_only)
    if transport == "http":
        server.run(transport="http", host=host, port=port)
    else:
        server.run()
    return 0


def main(args: list | None = None):
    """Entry point of the ``machinable`` command."""
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
            print("\nmachinable get [interface_module...] [version...] --method")
            print("\nExample:")
            print("\tmachinable get my_interface ~ver arg=1 nested.arg=2 --launch\n")
            print("Methods accept arguments like versions do: --summary(top=3)")
            print("(quote the token if your shell parses parentheses)\n")
            return 0
        elif h == "version":
            print("\nmachinable version")
            return 0
        elif h == "fetch":
            print("\nmachinable fetch [module ...] [--project DIR]")
            print(
                "\nDownload declared remotes into interface/remotes/ without "
                "importing them,\nso the code can be inspected before it "
                "executes. Without arguments, fetches\nevery declared remote."
            )
            return 0
        else:
            print("Unrecognized option")
            return 128

    if action == "version":
        version = machinable.get_version()
        print(version)
        return 0

    if action == "mcp":
        return _run_mcp(args)

    if action == "dispatch":
        # `machinable dispatch [--foreground|--detach|--prepare] [--wait]
        # [--with-metadata] [--project DIR]`, the serverless mirror of
        # POST /v1/executions; DispatchRequest JSON on stdin (see
        # machinable.dispatch).
        from machinable.dispatch import main as dispatch_main

        return dispatch_main(args)

    if action == "migrate":
        # `machinable migrate [storage_directory]`: one-shot in-place upgrade
        # of a store to format v1 (id.json + updated_at; hidden → overlay).
        from machinable.migrate import migrate_store

        summary = migrate_store(args[0] if args else "./storage")
        print(
            f"Migrated {summary['directory']}: "
            f"{summary['upgraded']} upgraded, "
            f"{summary['already_v1']} already v1, "
            f"{summary['reindexed']} reindexed, "
            f"{summary['hidden']} hidden flags moved to overlay"
        )
        return 0

    if action == "fetch":
        # `machinable fetch [module ...] [--project DIR]`: download declared
        # remotes into interface/remotes/ WITHOUT importing them, so the code
        # can be inspected before it is ever executed (remote modules run
        # arbitrary code on import).
        project_dir = os.getcwd()
        modules = []
        it = iter(args)
        for arg in it:
            if arg == "--project":
                project_dir = next(it)
            else:
                modules.append(arg)
        sys.path.append(project_dir)
        from machinable.project import Project

        with Project(project_dir) as project:
            provider = project.provider()
            declared = provider.on_resolve_remotes() or {}
            if not modules:
                modules = list(declared)
            if not modules:
                print("No remotes declared (see Project.on_resolve_remotes)")
                return 0
            status = 0
            for module in modules:
                filename = provider.fetch_remote(module)
                if filename is None:
                    print(f"{module}: not a declared remote")
                    status = 1
                else:
                    print(f"{module} -> {filename}")
            return status

    if action == "touch":
        # `machinable touch <record_id>`: declare an out-of-band change so
        # updated_at (and the index) reflect it.
        if not args:
            print("Usage: machinable touch <record_id>")
            return 128
        sys.path.append(os.getcwd())
        from machinable.interface import Interface
        from machinable.project import Project

        with Project(os.getcwd()):
            interface = Interface.find_by_id(args[0], fetch=False)
            if interface is None:
                print(f"No record '{args[0]}' in the index")
                return 1
            interface.touch()
            print(f"Touched {interface.uuid}")
        return 0

    if action.startswith("get"):
        sys.path.append(os.getcwd())

        get = machinable.get
        if action != "get":
            get = getattr(get, action.split(".")[-1])

        elements, kwargs, methods = parse(args)
        contexts = []
        target_interface = None
        for i, (module, *version) in enumerate(elements):
            interface = get(module, version, **kwargs[i])
            if i == len(elements) - 1:
                target_interface = interface
            else:
                contexts.append(interface.__enter__())

        if target_interface is None:
            raise ValueError("You have to provide at least one interface")

        from machinable.config import match_method

        for i, method in methods:
            # `--method(a=1)` passes arguments, like `~version(a=1)`
            name, call_args = method, None
            if method.endswith(")"):
                matched = match_method(method)
                if matched is None:
                    print(f"Invalid method: --{method}")
                    return 128
                name, call_args = matched
            # check if cli_{name} exists before falling back on {name}
            target = getattr(
                target_interface,
                f"cli_{name}",
                getattr(target_interface, name),
            )
            if callable(target):
                try:
                    result = eval(  # pylint: disable=eval-used
                        "__target__(" + (call_args or "") + ")",
                        {"__target__": target},
                    )
                except (SyntaxError, TypeError) as _ex:
                    print(f"Invalid arguments in --{method}: {_ex}")
                    return 128
                # print returned values; fluent methods returning the
                # interface itself (e.g. --launch) stay quiet
                if result is not None and result is not target_interface:
                    print(result)
            else:
                print(target)

        for context in reversed(contexts):
            context.__exit__()

        return 0

    print("Invalid argument")
    return 128


if __name__ == "__main__":
    raise SystemExit(main())
