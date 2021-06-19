import argparse
import sys


class Cli:
    def __init__(self, argv=None):
        if argv is None:
            argv = sys.argv
        self.argv = argv
        parser = argparse.ArgumentParser(
            description="machinable",
            usage="""machinable <command> [<args>]

                version    Displays the machinable version
                server     Launch a machinable server
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
        from machinable.utils import get_machinable_version

        print(get_machinable_version())

    def server(self):
        import uvicorn
        from machinable.server.server import server

        parser = argparse.ArgumentParser(
            description="Launch a machinable server"
        )

        parser.add_argument("--host", default="127.0.0.1", help="Host")
        parser.add_argument("--port", default=5000, help="Port")
        parser.add_argument("--log-level", default="info", help="Log level")
        parser.add_argument("--app", action="store_true")
        args = parser.parse_args(self.argv[2:])

        if args.app:
            import webbrowser

            webbrowser.open("http://app.machinable.org/", new=0, autoraise=True)

        uvicorn.run(
            server, host=args.host, port=args.port, log_level=args.log_level
        )

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
