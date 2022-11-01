from typing import Dict

import argparse
import sys


def cli() -> Dict:
    from omegaconf import OmegaConf

    return OmegaConf.to_container(OmegaConf.from_cli())


class Cli:
    def __init__(self, argv=None):
        if argv is None:
            argv = sys.argv
        self.argv = argv
        parser = argparse.ArgumentParser(
            description="machinable",
            usage="""machinable <command> [<args>]

                version    Displays the machinable version
                vendor     Manage vendor dependencies
            """,
        )
        parser.add_argument("command", help="Command to run")
        args = parser.parse_args(self.argv[1:2])

        if not hasattr(self, args.command):
            print("Unrecognized command")
            parser.print_help()
            exit(1)
        getattr(self, args.command)()

    def version(self):
        from machinable import get_version as get_machinable_version

        print(get_machinable_version())

    def vendor(self):
        parser = argparse.ArgumentParser(
            description="Manage vendor dependencies"
        )

        parser.add_argument("--project", default="")
        args = parser.parse_args(self.argv[2:])

        from machinable.project import Project, fetch_vendors

        project = Project(args.project if args.project != "" else None)
        fetch_vendors(project)
        print("Dependencies have been successfully fetched")


if __name__ == "__main__":
    Cli()
