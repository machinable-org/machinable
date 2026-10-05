"""Serve and dial the machinable API over an iroh QUIC transport.

The API is addressed by a cryptographic key (iroh's ``EndpointId`` — the
design's ``NodeId``) instead of a host and port, so a headless or NAT'd host
is reachable from anywhere without port-forwarding, a VPN, or a TLS
certificate. See ``docs/design/iroh.md`` and
``docs/design/iroh-implementation-plan.md``.

The package *is* the serve interface (:class:`IrohServer`, a
:class:`~machinable.server.Server` subclass), so ``machinable get
machinable.iroh --launch`` starts a host. Importing the package pulls in
``machinable.server`` but **not** the native ``iroh`` binding — that stays
behind the ``machinable[iroh]`` extra and is required only when serving/dialing.
"""

from __future__ import annotations

import os
import sys

from machinable.server import Server

# the ALPN that identifies "the machinable HTTP API" on an iroh endpoint; the
# trailing integer versions the transport envelope, independent of the API's
# own PROTOCOL_VERSION (which versions the payloads).
ALPN = b"machinable/api/1"


def _require_iroh():
    """Import the ``iroh`` binding or raise with the install hint."""
    try:
        import iroh
    except ImportError as ex:  # pragma: no cover - exercised without the extra
        raise ImportError(
            "The iroh transport requires the iroh binding. "
            "Install with: pip install 'machinable[iroh]'"
        ) from ex
    return iroh


class IrohServer(Server):
    """Serve the machinable API over an iroh QUIC transport.

    Resolved by ``machinable get machinable.iroh`` (the interface is this
    package's module class); ``--launch`` starts serving::

        machinable get machinable.iroh identity=~/host.key relay=lan --launch

    The base :class:`~machinable.server.Server` config is inherited unchanged;
    only the iroh-specific options live here.
    """

    class Config(Server.Config):
        # secret-key path; defaults to the user/host config dir ("one machine,
        # one key"). Point elsewhere to pin a key into a project.
        identity: str | None = None
        # discovery/relay: "default" (public relay + DNS), "lan" (relay
        # disabled, direct data), "offline" (no relay/discovery; dial by full
        # address), or an https relay URL for a self-hosted relay.
        relay: str = "default"
        # unknown-peer policy: "auto" prompts + persists (degrades to "strict"
        # with no TTY); "strict" refuses any key not already approved.
        pairing: str = "auto"
        # endpoint ids to pre-approve on the allowlist before serving
        allow: list[str] = []
        # transport: False = v0 loopback pump (fully compatible); True = v1
        # native ASGI-over-iroh (no loopback, one process).
        native: bool = False

    def launch(self) -> None:
        """Serve the API over iroh, blocking until interrupted.

        The loopback API is bound to 127.0.0.1 and never network-exposed; the
        iroh allowlist is the authorization gate, so it runs **tokenless** (the
        v0 decision). Prints the endpoint id to hand to clients.
        """
        from machinable.api.app import create_app
        from machinable.iroh.allowlist import Allowlist, PairingPolicy
        from machinable.iroh.identity import load_identity
        from machinable.iroh.transport import serve_iroh

        # The loopback API is tokenless by default — the endpoint allowlist is the
        # authorization gate. The v1 native transport CAN inject the bearer header
        # itself, so it honors api_token (defense in depth, token never on the
        # wire); the v0 pump copies raw bytes and cannot inject, so it ignores it.
        token = self.config.api_token or None
        if token and not self.config.native:
            print(
                "iroh: api_token is ignored by the v0 pump transport (the "
                "allowlist is the gate); use native=true to enforce a token.",
                file=sys.stderr,
            )
            token = None

        app = create_app(
            project_dir=self.config.project or os.getcwd(),
            api_token=token,
            project_roots=list(self.config.project_roots or []),
            python_allowlist=list(self.config.python_allowlist or []),
            enable_source_api=self.config.enable_source_api,
            source_token=self.config.source_token,
            source_base_dir=self.config.source_base_dir,
            ambient_connections=self._ambient_connections(),
        )

        identity = load_identity(self.config.identity)
        allowlist = Allowlist.load()
        for peer in self.config.allow:
            allowlist.add(peer)
        policy = PairingPolicy(self.config.pairing, allowlist)

        serve_iroh(
            app,
            identity=identity,
            policy=policy,
            relay=self.config.relay,
            native=self.config.native,
            api_token=token,
            log_level=self.config.log_level,
        )

    # ── notebook/widget guards ──────────────────────────────────────────────
    # iroh serving is foreground-only; the inherited Server.start()/view()/
    # widget_state() would silently start a plain, tokenless HTTP server on
    # host:port with no iroh transport and no allowlist gating. Refuse instead.

    def start(self) -> str:
        """Refuse background/notebook serving (iroh serving is foreground-only)."""
        raise RuntimeError(
            "machinable.iroh serves over iroh in the foreground only. "
            "Use `machinable get machinable.iroh --launch` (launch()); "
            "start()/view()/display() would start a plain HTTP server with no "
            "iroh transport or allowlist."
        )

    def widget_state(self) -> dict:
        """Refuse widget rendering (there is no in-notebook iroh widget)."""
        raise RuntimeError(
            "machinable.iroh has no in-notebook widget; launch() it and "
            "dial the printed endpoint id from a client."
        )

    def endpoint_id(self) -> str:
        """This host's stable endpoint id (the dial address).

        The CLI prints the return value; callers get it programmatically.
        """
        from machinable.iroh.identity import load_identity

        return load_identity(self.config.identity).endpoint_id

    def list_peers(self) -> None:
        """Print the approved peers on the allowlist."""
        from machinable.iroh.allowlist import Allowlist

        peers = Allowlist.load().peers()
        for peer in peers:
            label = f" ({peer['label']})" if peer.get("label") else ""
            print(f"{peer['id']}{label}")
        if not peers:
            print("(no approved peers)")

    def approve(self, endpoint_id: str, label: str | None = None) -> None:
        """Add ``endpoint_id`` to the allowlist (offline management)."""
        from machinable.iroh.allowlist import Allowlist

        # the CLI's eval-based method grammar can pass an all-digit id as an int;
        # normalize so allowlist keys are always strings
        endpoint_id = str(endpoint_id)
        added = Allowlist.load().add(endpoint_id, label=label)
        print(f"{'approved' if added else 'already approved'} {endpoint_id}")

    def revoke(self, endpoint_id: str) -> None:
        """Remove ``endpoint_id`` from the allowlist (offline management)."""
        from machinable.iroh.allowlist import Allowlist

        endpoint_id = str(endpoint_id)
        removed = Allowlist.load().remove(endpoint_id)
        print(f"{'revoked' if removed else 'not found'} {endpoint_id}")


__all__ = ["ALPN", "IrohServer", "_require_iroh"]
