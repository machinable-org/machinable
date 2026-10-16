"""Subprocess worker: serves a single project's API behind the gateway.

Launched by the gateway as ``python -m machinable.api.worker --project DIR
--port N`` using the interpreter requested for that project (e.g. its ``.venv``),
so the project runs with its own dependencies and an isolated module namespace.
The worker is just the ordinary single-project app (`create_app`); the gateway
reverse-proxies REST requests to it. It admits only requests carrying the secret
the gateway passes in ``MACHINABLE_WORKER_SECRET``, so other local users cannot
call it on loopback.
"""

from __future__ import annotations

import argparse
import os


def main() -> None:
    parser = argparse.ArgumentParser(prog="machinable.api.worker")
    parser.add_argument("--project", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--log-level", default="warning")
    args = parser.parse_args()

    import uvicorn

    from machinable.api.app import create_app
    from machinable.api.auth import WORKER_SECRET_ENV

    secret = os.environ.pop(WORKER_SECRET_ENV, None)
    if not secret:
        parser.error(
            f"{WORKER_SECRET_ENV} is not set; workers are spawned by the gateway"
        )
    app = create_app(project_dir=args.project, worker_secret=secret)
    uvicorn.run(app, host=args.host, port=args.port, log_level=args.log_level)


if __name__ == "__main__":
    main()
