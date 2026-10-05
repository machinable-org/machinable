"""Authorization for the iroh transport: an allowlist of endpoint ids.

A connecting peer is authenticated by its key at the QUIC layer; authorization
is then simply "is this key approved." Two pieces:

- :class:`Allowlist` — the persisted set of approved endpoint ids (a flat,
  documented JSON file, deliberately simple so another ecosystem such as captu
  can read/write it without a schema negotiation).
- :class:`PairingPolicy` — the decision made on an *unknown* peer, per the
  serve interface's ``pairing`` mode: ``strict`` refuses; ``auto`` prompts the
  operator (trust-on-first-use) and persists an approval.

The pairing decision is synchronous and may block on ``input()``; the
transport is expected to run it off the event loop (a thread executor) and the
policy serializes concurrent prompts so two dials never interleave on one
terminal.
"""

from __future__ import annotations

import json
import sys
import threading
from collections.abc import Callable
from datetime import UTC, datetime
from pathlib import Path

from machinable.iroh.identity import config_dir

# bumped only if the on-disk shape changes incompatibly
ALLOWLIST_VERSION = 1


def default_allowlist_path() -> Path:
    """Default location of the allowlist, next to the host identity."""
    return config_dir() / "iroh" / "allowlist.json"


class Allowlist:
    """A persisted set of approved endpoint ids.

    The file is a flat JSON object::

        {"version": 1, "peers": [{"id": "<hex>", "label": null,
                                  "added_at": "<iso8601>"}]}
    """

    def __init__(self, path: Path, peers: dict[str, dict]) -> None:
        self.path = path
        # id -> {label, added_at}
        self._peers = peers

    @classmethod
    def load(cls, path: str | Path | None = None) -> Allowlist:
        """Load the allowlist, returning an empty one when the file is absent."""
        file = Path(path).expanduser() if path is not None else default_allowlist_path()
        peers: dict[str, dict] = {}
        if file.is_file():
            data = json.loads(file.read_text(encoding="utf-8"))
            for entry in data.get("peers", []):
                pid = entry.get("id")
                if pid:
                    peers[pid] = {
                        "label": entry.get("label"),
                        "added_at": entry.get("added_at"),
                    }
        return cls(file, peers)

    def contains(self, endpoint_id: str) -> bool:
        """Whether ``endpoint_id`` is approved."""
        return endpoint_id in self._peers

    def ids(self) -> list[str]:
        """The approved endpoint ids, in insertion order."""
        return list(self._peers)

    def peers(self) -> list[dict]:
        """Full approved entries ({id, label, added_at})."""
        return [{"id": pid, **meta} for pid, meta in self._peers.items()]

    def add(self, endpoint_id: str, label: str | None = None) -> bool:
        """Approve ``endpoint_id`` and persist. Returns False if already present."""
        if endpoint_id in self._peers:
            return False
        self._peers[endpoint_id] = {
            "label": label,
            "added_at": datetime.now(UTC).isoformat(),
        }
        self.save()
        return True

    def remove(self, endpoint_id: str) -> bool:
        """Revoke ``endpoint_id`` and persist. Returns False if it was absent."""
        if endpoint_id not in self._peers:
            return False
        del self._peers[endpoint_id]
        self.save()
        return True

    def save(self) -> None:
        """Write the allowlist to disk (creating parent dirs)."""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "version": ALLOWLIST_VERSION,
            "peers": self.peers(),
        }
        self.path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


class PairingPolicy:
    """Decides whether an unknown peer may connect.

    Args:
        mode: ``"strict"`` (refuse unknown) or ``"auto"`` (prompt + persist).
        allowlist: the backing :class:`Allowlist`.
        prompt: injectable ``input``-like callable (for tests / non-terminal
            front ends); defaults to the builtin ``input``.
        is_tty: whether a terminal is attached; defaults to
            ``sys.stdin.isatty()``. When ``auto`` runs without a TTY it
            degrades to ``strict`` (a headless deployment is safe by default).
        log: injectable line logger for the degrade/decision notices.
    """

    def __init__(
        self,
        mode: str,
        allowlist: Allowlist,
        *,
        prompt: Callable[[str], str] = input,
        is_tty: bool | None = None,
        log: Callable[[str], None] | None = None,
    ) -> None:
        if mode not in ("strict", "auto"):
            raise ValueError(f"unknown pairing mode {mode!r} (use 'strict' or 'auto')")
        self.mode = mode
        self.allowlist = allowlist
        self._prompt = prompt
        self._is_tty = sys.stdin.isatty() if is_tty is None else is_tty
        self._log = log or (lambda msg: print(msg, file=sys.stderr))
        # serialize concurrent prompts so two dials don't interleave on one tty
        self._lock = threading.Lock()
        self._warned_no_tty = False

    @property
    def effective_mode(self) -> str:
        """The mode actually in force (``auto`` degrades to ``strict`` sans TTY)."""
        if self.mode == "auto" and not self._is_tty:
            return "strict"
        return "auto" if self.mode == "auto" else "strict"

    def decide(self, endpoint_id: str) -> bool:
        """Admit ``endpoint_id``? Approved keys pass without prompting.

        Blocking (may call ``prompt``); run off the event loop.
        """
        with self._lock:
            if self.allowlist.contains(endpoint_id):
                return True
            if self.mode == "strict":
                return False
            # auto: prompt-and-persist, but only with a terminal to ask on
            if not self._is_tty:
                if not self._warned_no_tty:
                    self._log(
                        "iroh: pairing=auto has no terminal to prompt on; "
                        "refusing unknown peers (pairing=strict). Pre-approve "
                        "keys with allow=[...] to admit them."
                    )
                    self._warned_no_tty = True
                return False
            answer = self._prompt(
                f"iroh: connection from unapproved endpoint {endpoint_id}\n"
                f"      approve and remember this key? [y/N] "
            )
            if answer.strip().lower() in ("y", "yes"):
                self.allowlist.add(endpoint_id)
                self._log(f"iroh: approved {endpoint_id}")
                return True
            self._log(f"iroh: refused {endpoint_id}")
            return False
