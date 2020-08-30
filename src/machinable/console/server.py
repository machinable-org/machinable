import webbrowser

import click
import uvicorn

from ..server.server import server as machinable_server


@click.command()
@click.option("--host", default="127.0.0.1", help="Host")
@click.option("--port", default=5000, help="Port")
@click.option("--log-level", default="info", help="Log level")
def server(host, port, log_level):
    uvicorn.run(machinable_server, host=host, port=port, log_level=log_level)


@click.command()
def app():
    host = "127.0.0.1"
    webbrowser.open("http://app.machinable.org/", new=0, autoraise=True)
    # todo: find free port and encode the endpoint via ?get request or #
    # todo: secure endpoint with token request
    uvicorn.run(machinable_server, host=host, port=5000, log_level="warning")
