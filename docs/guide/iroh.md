# Serving over iroh

The [API server](./server.md) is normally reached over a TCP port. That is awkward
exactly where a lot of compute lives — a cluster login node or a GPU box with no
inbound-reachable IP, or a laptop behind NAT. The optional `machinable[iroh]`
extra serves the **same** API over [iroh](https://github.com/n0-computer/iroh)
QUIC, so a host is addressed by a **cryptographic key** instead of a host and
port: it prints an *endpoint id* on startup, and any paired client dials that key
from anywhere — no port-forwarding, VPN, or TLS certificate to manage.

Nothing about the API changes. The routes, models, WebSocket protocol, and
`PROTOCOL_VERSION` are identical; only the transport differs. Connections are
end-to-end encrypted and mutually authenticated on the keypair by construction,
so authorization becomes "is this key on the allowlist."

## Install

```bash
pip install 'machinable[iroh]'
```

The iroh binding is a native wheel but pure networking (no display, no system GUI
libraries), so it installs and runs on headless servers and in containers.

## Serving

The iroh server is an interface (`machinable.iroh`) that subclasses
`machinable.server`, so it launches through the [CLI](./cli.md) like any other:

```bash
machinable get machinable.iroh --launch
```

It prints the host's endpoint id — the address you hand to clients — and blocks:

```
machinable iroh endpoint: 296d9c7f5fedc48982be0f4f61f725cdf740de6597294479fee21093bce83ce3
  transport=pump pairing=auto relay=default
  dial this endpoint id from a paired client; Ctrl-C to stop.
```

Its `Config` adds the iroh-specific fields on top of the base
[server config](./server.md#launching):

| Field | Default | Purpose |
| --- | --- | --- |
| `identity` | `None` | secret-key path; defaults to a per-host config dir (see [Identity](#identity)) |
| `relay` | `"default"` | discovery/relay mode — `default`, `lan`, `offline`, or a relay URL ([below](#relay--discovery)) |
| `pairing` | `"auto"` | how unknown keys are handled — `auto` or `strict` ([below](#pairing--authorization)) |
| `allow` | `[]` | endpoint ids to pre-approve before serving |
| `native` | `False` | use the v1 native transport instead of the v0 pump ([below](#transports-pump-vs-native)) |

Example — a headless box that only admits two pre-approved keys, no prompting:

```bash
machinable get machinable.iroh \
  project="/data/project" \
  pairing=strict \
  allow='[296d9c7f…, 41f0aa22…]' \
  --launch
```

## Pairing & authorization

Because the peer is already authenticated by its key, authorization is just an
allowlist of endpoint ids. Two modes:

- **`auto`** (default) — trust-on-first-use. When an unapproved key connects, the
  operator is prompted at the terminal:

  ```
  iroh: connection from unapproved endpoint 41f0aa22…
        approve and remember this key? [y/N]
  ```

  Approving adds the key to the allowlist (persisted), so the prompt appears once
  per new key. When there is **no terminal** (an unattended or detached launch)
  `auto` degrades to `strict` and logs why — a headless deployment is safe by
  default. Seed the first key with `allow=[…]` for such hosts.
- **`strict`** — refuse any key not already on the allowlist, at the QUIC layer,
  before any request runs.

The allowlist is a small JSON file next to the identity. Manage it offline with
methods on the interface (they use the same `--method` [grammar](./cli.md) as any
interface):

```bash
machinable get machinable.iroh --endpoint_id        # print this host's id
machinable get machinable.iroh --list_peers         # approved keys
machinable get machinable.iroh --approve(41f0aa22…) # add a key
machinable get machinable.iroh --revoke(41f0aa22…)  # remove a key
```

## Relay & discovery

iroh finds the fastest path to a peer — a direct QUIC hole-punch when possible, an
encrypted relay as fallback — and resolves an endpoint id to a route via
discovery. The `relay` mode picks the policy:

| Mode | Discovery | Relay | Use when |
| --- | --- | --- | --- |
| `default` | n0 DNS | n0 public relay | the common case; dial by id from anywhere |
| *`https://…`* | n0 DNS | **your self-hosted relay** | you run your own relay |
| `lan` | n0 DNS | disabled | keep data off any relay (direct only) |
| `offline` | none | none | air-gapped; dial by full address only |

Traffic is end-to-end encrypted regardless — a relay only forwards ciphertext and
never sees plaintext.

::: tip No third parties at all
The iroh Python binding exposes no mDNS/local-discovery toggle, so `lan` still
uses n0 DNS to *resolve* ids (data stays off the relay). For a site that forbids
any third party in the path, use `offline` and dial the full address.
:::

## Dialing a host

### From the console

The [terminal console](./server.md#the-console) dials an iroh host by key with an
`iroh://` target (no token needed — the allowlist is the gate):

```bash
machinable console iroh://296d9c7f5fedc48982be0f4f61f725cdf740de6597294479fee21093bce83ce3
machinable console --node 296d9c7f… --relay lan
```

### From Python

machinable's own API client dials iroh too, so a notebook or another machinable
instance can reach a remote host. `iroh_transport` is a drop-in
[`httpx`](https://www.python-httpx.org/) transport:

```python
import httpx
from machinable.iroh.client import iroh_transport, connect_websocket
from machinable.iroh.identity import load_identity

me = load_identity()  # this machine's stable key (so the host can allowlist it)
endpoint = "296d9c7f5fedc48982be0f4f61f725cdf740de6597294479fee21093bce83ce3"

# HTTP routes
transport = iroh_transport(endpoint, identity=me, relay="default")
async with httpx.AsyncClient(base_url="http://iroh", transport=transport) as client:
    health = await client.get("/v1/health")

# WebSocket routes (the interface/execution sessions)
ws = await connect_websocket(endpoint, "/v1/interfaces/ws", identity=me)
async with ws:
    await ws.send('{"type": "connect", "target": "my_interface"}')
    print(await ws.recv())
```

Pass `identity=` a stable key so the host recognizes this client across runs;
without it an ephemeral key is used (the host must approve it each time under
`pairing=auto`).

## Identity

A host's secret key is created on first launch and reused, so its endpoint id is
stable. By default it lives in a per-host config directory — one machine, one key,
shared by every project served from it:

- Linux/macOS: `$XDG_CONFIG_HOME/machinable/iroh/secret.key` (or `~/.config/…`)
- Windows: `%APPDATA%\machinable\iroh\secret.key`

Set `identity=/path/to/key` (or `MACHINABLE_CONFIG_DIR`) to pin a key elsewhere,
e.g. to travel with a project. The key is written owner-only; never commit it.

## Transports: pump vs native

Two server implementations serve the identical API:

- **v0 pump** (default) — runs stock uvicorn on a loopback port (never exposed to
  the network) and copies bytes between each QUIC stream and a loopback
  connection. Fully compatible with zero API changes; the only cost is a loopback
  hop.
- **v1 native** (`native=true`) — drives the ASGI app directly over the stream, no
  second server and no loopback. It also injects the bearer token server-side, so
  when the API is token-protected the client never sends the token over the wire.

```bash
machinable get machinable.iroh native=true --launch
```

Both are tokenless by default (the endpoint allowlist is the authorization gate);
the loopback API is bound to `127.0.0.1` and never network-exposed.

## Relation to captu and other clients

The contract here — ALPN `machinable/api/1`, HTTP/WebSocket over the stream,
`PROTOCOL_VERSION`, and the endpoint-id allowlist — is machinable's own. Any
client that speaks it interoperates: the console and notebooks above, other
machinable instances, and external apps such as **captu**, which dials a
display-less machinable host by its endpoint id the same way it dials any paired
machine. machinable builds the generic transport; those clients fall out for free.
```
