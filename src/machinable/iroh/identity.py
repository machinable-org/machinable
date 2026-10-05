"""Persistent transport identity for an iroh host.

A machinable iroh host has a stable secret key; its public key *is* its
address (iroh's ``EndpointId`` — the design's ``NodeId``), printed on startup
and handed out to clients. The key survives restarts so the address is stable.

By default the key lives in a user/host config directory ("one machine, one
key"), so every project served from a box shares the host's identity. Pass an
explicit path (the serve interface's ``identity=`` config) to pin a key
elsewhere, e.g. into a project directory.

This is host *transport* identity and is unrelated to machinable's config /
record identity (``machinable.config``).
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

from machinable.iroh import _require_iroh

if TYPE_CHECKING:
    import iroh

# raw ed25519 secret keys are 32 bytes (verified against iroh 1.0 SecretKey)
_SECRET_KEY_BYTES = 32


def config_dir() -> Path:
    r"""The machinable user/host config directory.

    ``MACHINABLE_CONFIG_DIR`` overrides; otherwise the per-OS convention:
    ``%APPDATA%\machinable`` on Windows, ``$XDG_CONFIG_HOME/machinable`` or
    ``~/.config/machinable`` elsewhere.
    """
    override = os.environ.get("MACHINABLE_CONFIG_DIR")
    if override:
        return Path(override).expanduser()
    if sys.platform == "win32":
        base = os.environ.get("APPDATA") or (Path.home() / "AppData" / "Roaming")
        return Path(base) / "machinable"
    base = os.environ.get("XDG_CONFIG_HOME") or (Path.home() / ".config")
    return Path(base) / "machinable"


def default_identity_path() -> Path:
    """Default location of the host secret key."""
    return config_dir() / "iroh" / "secret.key"


@dataclass(frozen=True)
class Identity:
    """A loaded iroh transport identity.

    ``endpoint_id`` is the printable address to hand to clients (a 64-char hex
    string); ``secret_key`` is the live iroh key used to bind the endpoint.
    """

    secret_key: iroh.SecretKey
    endpoint_id: str
    path: Path

    @property
    def short_id(self) -> str:
        """A short, human-oriented prefix of the endpoint id (for logs)."""
        return self.secret_key.public().fmt_short()


def _write_secret(path: Path, raw: bytes) -> None:
    """Write raw key bytes with best-effort owner-only permissions."""
    path.parent.mkdir(parents=True, exist_ok=True)
    # create restricted so the secret is never briefly world-readable; O_BINARY
    # (Windows) prevents text-mode newline translation from corrupting key bytes
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | getattr(os, "O_BINARY", 0)
    fd = os.open(str(path), flags, 0o600)
    try:
        os.write(fd, raw)
    finally:
        os.close(fd)
    try:  # tighten again in case a umask widened the mode (no-op on Windows)
        os.chmod(path, 0o600)
    except OSError:  # pragma: no cover - platform dependent
        pass


def load_identity(path: str | os.PathLike[str] | None = None) -> Identity:
    """Load the host identity, creating and persisting a fresh key if absent.

    Args:
        path: Secret-key file to use; defaults to :func:`default_identity_path`.

    Returns:
        The loaded :class:`Identity` (stable across calls once created).
    """
    iroh = _require_iroh()

    key_path = Path(path).expanduser() if path is not None else default_identity_path()

    if key_path.is_file():
        raw = key_path.read_bytes()
        if len(raw) != _SECRET_KEY_BYTES:
            raise ValueError(
                f"{key_path} is not a valid iroh secret key "
                f"(expected {_SECRET_KEY_BYTES} bytes, got {len(raw)})"
            )
        secret_key = iroh.SecretKey.from_bytes(raw)
    else:
        secret_key = iroh.SecretKey.generate()
        _write_secret(key_path, secret_key.to_bytes())

    return Identity(
        secret_key=secret_key,
        endpoint_id=str(secret_key.public()),
        path=key_path,
    )
