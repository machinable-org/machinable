# The web client

machinable ships a web UI for the full loop to connect, configure with a schema-driven editor and `~version` composer, preview the resolved config and its identity before anything runs, launch and track, browse past runs, and inspect provenance. It is a pure client of the [API server](./server.md), so everything it shows travels through the same HTTP contract as any other client.

## In the browser

Every running server serves the client at `/widget`:

```bash
machinable get machinable.server --launch
# then open http://127.0.0.1:8000/widget
```

The underlying ES module is served at `GET /widget-sdk.js` (styles at `/widget-sdk.css`), so any page can embed it:

```html
<div id="root"></div>
<script type="module">
  const sdk = await import('http://127.0.0.1:8000/widget-sdk.js');
  sdk.mount(document.getElementById('root'), { url: 'http://127.0.0.1:8000' });
</script>
```

The bundle is versioned with the server, in that a server always serves the client that matches its own API.

## In a notebook

Any interface displays the item widget (needs [anywidget](https://anywidget.dev), `machinable[widgets]`):

```python
from machinable import get

get("dummy", {"a": 5})     # last line of a cell → this interface's view
get("dummy").all()         # → the run browser over the project's records
```

The views render against the connected `Server`, with ordinary machinable connection semantics. With none connected, a kernel-local default is connected on first display as an API server started inside the kernel on a free port, inheriting the notebook's ambient `Storage`/`Index` connections so the widget shows exactly the records your code sees, with zero setup. The `Server` is both launchpad and handle:

```python
from machinable.server import Server

Server.get()                                   # the session's server (url, …)
with Server({"url": "http://cluster:8000"}):   # render against a remote server
    display(get("train"))

server = Server({"port": 8080}).__enter__()    # or pick your own local server
server.start()                                 # … stop()/start() to restart

Server.get()                                   # a Server displays as the run browser
```

## For downstream hosts

The client is built from a host-agnostic SDK (`web/sdk` in the repository): Svelte
components that are pure over a `WidgetHostAdapter` interface (connect/trust,
introspect/resolve, dispatch/find/interrupt/call, catalog, provenance) plus a slot
system for host-supplied field renderers and result views. machinable bundles the
default HTTP adapter (`createAdapter(url, token)`); a downstream application can
implement the adapter against its own substrate and inject domain-specific inputs
without forking the SDK.

There is no npm package by design. Hosts consume the served bundle at runtime
(version-locked to the server), or vendor/alias the SDK source from a machinable
checkout during development.

## Developing the SDK

In a machinable checkout, `web/sdk` is a Vite project:

```bash
cd web/sdk
npm install
npm run build   # bundles into src/machinable/assets (the served artifact)
npm test
```

The built bundle is not committed. Releases build it into the wheel, and the
docs site publishes the current build at `machinable.org/widget-sdk.js`. A repo
checkout without the npm toolchain fetches it from there automatically on first
use.

For hot reload, let the server shim to a Vite dev server instead of the bundle:

```bash
machinable get machinable.server sdk_dev=true console=false --launch
# edit web/sdk/src — the open /widget page hot-reloads
```

`sdk_dev=true` spawns `npm run dev` itself (dev checkout only); alternatively pass
the URL of an already-running dev server, e.g. `sdk_dev="http://localhost:5173"`.
Consumers keep importing `/widget-sdk.js` in both modes.
