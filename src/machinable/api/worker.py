"""Subprocess worker: serves a single project's API behind the gateway.

Launched by the gateway as ``python -m machinable.api.worker --project DIR
--port N`` using the interpreter requested for that project (e.g. its ``.venv``),
so the project runs with its own dependencies and an isolated module namespace.
The worker is just the ordinary single-project app (`create_app`); the gateway
reverse-proxies REST requests to it.
"""

from __future__ import annotations

import argparse


def main() -> None:
    parser = argparse.ArgumentParser(prog="machinable.api.worker")
    parser.add_argument("--project", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--log-level", default="warning")
    args = parser.parse_args()

    import uvicorn

    from machinable.api.app import create_app

    app = create_app(project_dir=args.project)
    uvicorn.run(app, host=args.host, port=args.port, log_level=args.log_level)


if __name__ == "__main__":
    main()
