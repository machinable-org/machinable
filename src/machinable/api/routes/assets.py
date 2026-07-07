"""Web-client assets: the served SDK bundle, the demo page, and the dev shim.

``GET /widget-sdk.js`` is the one stable URL every consumer imports (the demo
page, a Jupyter cell, downstream hosts). In production it serves the bundled
build shipped inside the wheel; with ``sdk_dev`` set it serves a tiny ESM shim
re-exporting from a running Vite dev server, so consumers keep their URL and
transparently get hot reload.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse

router = APIRouter(tags=["assets"])

# static code, no data: exempt from bearer auth (like /docs)
PUBLIC_PATHS = {"/widget-sdk.js", "/widget-sdk.css", "/widget"}

_MISSING_HINT = (
    "The widget SDK bundle is missing and the published build could not be "
    "fetched from machinable.org. In a development checkout run "
    "`npm install && npm run build` in web/sdk (or launch the server with "
    "sdk_dev=true for hot reload)."
)

_DEMO_PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>machinable</title>
<link rel="stylesheet" href="/widget-sdk.css" />
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #f7f6f2; }
  #root { max-width: 1024px; margin: 2rem auto; padding: 0 1rem; }
</style>
</head>
<body>
<div id="root"></div>
<script type="module">
  const sdk = await import('/widget-sdk.js');
  sdk.mount(document.getElementById('root'), { url: location.origin });
</script>
</body>
</html>
"""


def _asset(name: str) -> str | None:
    # ensure_web_asset falls back to the docs site's published build when the
    # local bundle was not built (repo checkout without the npm toolchain)
    from machinable.server import ensure_web_asset

    path = ensure_web_asset(name)
    if path is None:
        return None
    try:
        return Path(path).read_text(encoding="utf-8")
    except OSError:
        return None


def _dev_shim(dev_url: str) -> str:
    dev = dev_url.rstrip("/")
    return (
        f'import "{dev}/@vite/client";\n'
        f'export * from "{dev}/src/main.ts";\n'
        f'export {{ default }} from "{dev}/src/main.ts";\n'
    )


def _serve(source: str, media_type: str, request: Request) -> Response:
    etag = f'"{hashlib.md5(source.encode()).hexdigest()}"'  # noqa: S324 - cache key
    if request.headers.get("If-None-Match") == etag:
        return Response(status_code=304)
    return Response(content=source, media_type=media_type, headers={"ETag": etag})


@router.get("/widget-sdk.js", include_in_schema=False)
def widget_sdk_js(request: Request) -> Response:
    dev_url = getattr(request.app.state, "sdk_dev", None)
    if dev_url:
        return Response(
            content=_dev_shim(dev_url),
            media_type="text/javascript",
            headers={"Cache-Control": "no-store"},
        )
    source = _asset("widget-sdk.js")
    if source is None:
        raise HTTPException(status_code=404, detail=_MISSING_HINT)
    return _serve(source, "text/javascript", request)


@router.get("/widget-sdk.css", include_in_schema=False)
def widget_sdk_css(request: Request) -> Response:
    if getattr(request.app.state, "sdk_dev", None):
        # in dev mode Vite injects styles through the JS modules; serve an
        # empty sheet so the built one cannot conflict with hot-reloaded styles
        return Response(
            content="/* styles are injected by the dev server */\n",
            media_type="text/css",
            headers={"Cache-Control": "no-store"},
        )
    source = _asset("widget-sdk.css")
    if source is None:
        raise HTTPException(status_code=404, detail=_MISSING_HINT)
    return _serve(source, "text/css", request)


@router.get("/widget", include_in_schema=False)
def widget_page() -> HTMLResponse:
    """The web client, mounted against this server."""
    return HTMLResponse(content=_DEMO_PAGE)
