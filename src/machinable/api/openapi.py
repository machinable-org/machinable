"""Rich OpenAPI metadata so the running server is self-documenting.

The live ``/openapi.json`` (and ``/docs``, ``/redoc``) are the single source of
truth for the REST surface. The WebSocket protocol that
OpenAPI cannot express is described by ``GET /v1/protocol`` (see
``machinable.api.protocol``). The hand-written docs are generated from both.
"""

from __future__ import annotations

import machinable

API_SUMMARY = "Domain-agnostic remote-call, storage, and search API for machinable."

API_DESCRIPTION = """\
A **generic substrate** for driving `machinable.Interface` subclasses remotely:
transport (JSON control plane + binary data plane), a config/identity **index**
with **search**, and an Execution lifecycle. Each *interface* (a Python module in
the project) decides what bytes and method calls mean while machinable stays
use-case-agnostic.

### Conceptual model
- **Interface**: a materialized data node (config + identity). `InterfaceInfo`
  carries no lifecycle status.
- **Execution**: the only run-record with lifecycle (`is_active`, timestamps).
- **Project**: the unit a request binds to. Multiple projects (and Python
  interpreters) are served from one gateway.

### Discovering the full contract
- **REST**: this OpenAPI document (`/openapi.json`, `/docs`).
- **WebSocket protocol** (connect / call / stream / chunk upload / chunk read /
  event): `GET /v1/protocol` returns a machine-readable description, since
  OpenAPI cannot model WebSocket frames.

### Request routing (headers; query equivalents in parentheses)
- `X-Machinable-Project` (`?project=`): target project, must be under the
  server's allowlist; defaults to the launch project.
- `X-Machinable-User` (`X-Machinable-User`): attributes created interfaces
  (`created_by`); defaults to the server OS user.
- `X-Machinable-Python` (`?python=`): interpreter; a non-gateway interpreter is
  routed to a subprocess worker.
- `Authorization: Bearer <token>`: required when the server sets `api_token`
  (`/docs` and `/openapi.json` are exempt).

### Capability map
`remote_call`, `binary_upload`, `binary_read`, `config_search`, `create_by_id`,
`mutable_label`, `creator_attribution`, `multi_project`; see `/v1/protocol` for
the surfaces that expose each.
"""

API_TAGS = [
    {
        "name": "interfaces",
        "description": (
            "Create/attach interfaces, invoke methods, search by config, set the "
            "mutable label, read files, and the WebSocket data plane."
        ),
    },
    {
        "name": "executions",
        "description": "Dispatch runs and query Execution lifecycle status and output.",
    },
    {
        "name": "project",
        "description": "Discover Interface modules and reflect their Config schemas.",
    },
    {
        "name": "projects",
        "description": "List projects and interpreter workers the gateway serves.",
    },
    {
        "name": "source",
        "description": (
            "Read/write/create/rename/delete interface source files (opt-in, "
            "token-gated; confined to the project base directory)."
        ),
    },
    {
        "name": "meta",
        "description": (
            "Self-description: the WebSocket protocol, interface hooks, and "
            "capability map that OpenAPI cannot express."
        ),
    },
    {
        "name": "health",
        "description": "Server status, version, and active execution count.",
    },
]


def openapi_kwargs() -> dict:
    """Keyword arguments for the ``FastAPI`` constructor."""
    return {
        "title": "machinable API",
        "version": machinable.__version__,
        "summary": API_SUMMARY,
        "description": API_DESCRIPTION,
        "openapi_tags": API_TAGS,
        "contact": {
            "name": "machinable",
            "url": "https://machinable.org",
        },
        "license_info": {"name": "MIT"},
    }
