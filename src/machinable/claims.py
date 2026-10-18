"""Claims: running an interface once across threads, processes and machines."""

from __future__ import annotations

import hashlib
import json
import os
import socket
import string
from dataclasses import dataclass, field, replace
from typing import TYPE_CHECKING, Any, Literal, cast

import arrow

from machinable.types import DatetimeType
from machinable.utils import normjson

if TYPE_CHECKING:
    from machinable.interface import Interface
    from machinable.storage import Storage

CLAIMS_DIRECTORY = ".claims"

HELD = "held"
RELEASED = "released"

ClaimState = Literal["unclaimed", "held", "stale"]

RUN_MARKERS = (
    "dispatched_at",
    "started_at",
    "heartbeat_at",
    "finished_at",
    "abandoned_at",
)

_BASE62 = string.digits + string.ascii_uppercase + string.ascii_lowercase


def claim_location(interface_directory: str) -> str:
    """The claim file of the interface stored at ``interface_directory``.

    ``<identity dir>/.claims/<predicate_key>``: one claim per identity and
    predicate, beside (not inside) the interface's own record directory, so
    the claim is never part of the record. ``interface_directory`` is a path,
    or the URI of an interface in a store that is not a directory.
    """
    if "://" in interface_directory:
        identity, _, predicate_key = interface_directory.rstrip("/").rpartition("/")
        return f"{identity}/{CLAIMS_DIRECTORY}/{predicate_key}"
    interface_directory = os.path.normpath(interface_directory)
    identity_directory, predicate_key = os.path.split(interface_directory)
    return os.path.join(identity_directory, CLAIMS_DIRECTORY, predicate_key)


def shared_record_id(
    parent_id: str | None, identity_key: str, predicate_key: str
) -> str:
    """The record id every dispatcher derives for one interface.

    A deterministic function of the dedup triple (parent id, identity key,
    predicate key), 12 base62 characters like a minted id, so that two
    indexes writing the same interface into one folder give it one id (the
    claim's run-record names it as its parent). The project root already
    derives its id this way (``Project.compute_record_id``).
    """
    digest = hashlib.sha256(
        f"{parent_id or ''}\x00{identity_key}\x00{predicate_key}".encode()
    ).digest()
    number = int.from_bytes(digest, "big")
    chars = []
    for _ in range(12):
        number, rest = divmod(number, len(_BASE62))
        chars.append(_BASE62[rest])
    return "".join(chars)


@dataclass(frozen=True)
class Claim:
    """A claim file's content.

    ``generation`` increases by one on every write, so a replace names the
    version it read; a store without versions of its own (the disk storage)
    compares generations, one with versions (an object store's ETag) may
    compare those instead, and writes the generation for other readers.
    """

    record_id: str
    state: str = HELD
    host: str = ""
    pid: int = 0
    claimed_at: str = ""
    generation: int = 1

    @classmethod
    def held(cls, record_id: str, generation: int) -> Claim:
        """A held claim for ``record_id`` written by this process, now."""
        return cls(
            record_id=record_id,
            state=HELD,
            host=socket.gethostname(),
            pid=os.getpid(),
            claimed_at=str(arrow.now()),
            generation=generation,
        )

    def released(self) -> Claim:
        """This claim given up: same run, next generation."""
        return replace(self, state=RELEASED, generation=self.generation + 1)

    def as_dict(self) -> dict:
        """The claim's JSON object."""
        return {
            "record_id": self.record_id,
            "state": self.state,
            "host": self.host,
            "pid": self.pid,
            "claimed_at": self.claimed_at,
            "generation": self.generation,
        }

    def to_bytes(self) -> bytes:
        """Canonical JSON (sorted keys, compact separators, ASCII escapes)."""
        return normjson(self.as_dict()).encode()

    @classmethod
    def from_dict(cls, data: object) -> Claim | None:
        """Parse a claim object; ``None`` when it is not one."""
        if not isinstance(data, dict):
            return None
        data = cast("dict[str, Any]", data)
        if not isinstance(data.get("record_id"), str):
            return None
        try:
            return cls(
                record_id=data["record_id"],
                state=str(data.get("state", HELD)),
                host=str(data.get("host", "")),
                pid=int(data.get("pid", 0)),
                claimed_at=str(data.get("claimed_at", "")),
                generation=int(data.get("generation", 0)),
            )
        except (TypeError, ValueError):
            return None

    @classmethod
    def from_bytes(cls, data: bytes) -> Claim | None:
        """Parse a claim file; ``None`` when it is not one."""
        try:
            return cls.from_dict(json.loads(data.decode("utf-8")))
        except (UnicodeDecodeError, ValueError):
            return None


def _parse(value: str | None) -> DatetimeType | None:
    if not value:
        return None
    try:
        return arrow.get(str(value).strip().split("\n")[-1])
    except (arrow.ParserError, ValueError, TypeError):
        return None


def _fresh(value: str | None, now: DatetimeType, window: float) -> bool:
    """Whether the timestamp ``value`` is within ``window`` seconds of ``now``.

    Total elapsed seconds; a timestamp in the reader's future is fresh (a
    false "live" over a false "died", as for heartbeats).
    """
    timestamp = _parse(value)
    if timestamp is None:
        return False
    return (now - timestamp).total_seconds() < window


def claim_state(
    claim: Claim | dict | None,
    run_markers: dict[str, str] | None,
    *,
    now: DatetimeType | None = None,
    window: float | None = None,
    timeout: float | None = None,
) -> ClaimState:
    """The state of a claim, from its file and the claimed run's markers alone.

    - absent or ``released``: **unclaimed**;
    - ``held`` and the claimed run has ``finished_at``: **unclaimed** (it
      finished; its release was lost);
    - ``held`` and the claimed run's ``heartbeat_at`` is fresh, or the
      claim's ``claimed_at`` is within the claim timeout (the claimant is
      starting): **held**;
    - otherwise: **stale**.

    ``window`` is the heartbeat liveness window (default: this store's, see
    ``heartbeat_window``), ``timeout`` the claim timeout (default: the
    window). ``run_markers`` maps marker names to their contents, ``None``
    when the claimed run-record is not there (yet).
    """
    if isinstance(claim, dict):
        claim = Claim.from_dict(claim)
    if claim is None or claim.state != HELD:
        return "unclaimed"
    markers = run_markers or {}
    if markers.get("finished_at"):
        return "unclaimed"
    if now is None:
        now = arrow.now()
    if window is None:
        from machinable.execution import heartbeat_window

        window = heartbeat_window()
    if timeout is None:
        timeout = window
    if not markers.get("abandoned_at") and _fresh(
        markers.get("heartbeat_at"), now, window
    ):
        return "held"
    if _fresh(claim.claimed_at, now, timeout):
        return "held"
    return "stale"


@dataclass(frozen=True)
class RunRecord:
    """A run-record of an interface, as a look listed it.

    ``location`` is the store's handle for the record (the disk storage: its
    directory), ``markers`` the contents of its status markers.
    """

    record_id: str
    location: str
    markers: dict[str, str] = field(default_factory=dict)

    @property
    def finished(self) -> bool:
        """``finished_at`` is there."""
        return bool(self.markers.get("finished_at"))

    @property
    def started(self) -> bool:
        """``started_at`` is there."""
        return bool(self.markers.get("started_at"))

    @property
    def abandoned(self) -> bool:
        """``abandoned_at`` is there (its claim was taken over)."""
        return bool(self.markers.get("abandoned_at"))


@dataclass(frozen=True)
class Look:
    """One look at an interface in one store: the claim, then the run-records.

    ``version`` is what a replace of this claim names (the store's own
    version, or the claim's generation); ``None`` with ``claim`` means the
    claim file was absent.
    """

    location: str
    present: bool
    claim: Claim | None
    version: str | None
    runs: tuple[RunRecord, ...]
    state: ClaimState

    @property
    def claimed_run(self) -> RunRecord | None:
        """The run-record the claim names, when it is listed."""
        if self.claim is None:
            return None
        return next((r for r in self.runs if r.record_id == self.claim.record_id), None)

    @property
    def claim_file(self) -> str:
        """``absent``, ``held`` or ``released`` (an unreadable claim: ``held``)."""
        if not self.present:
            return "absent"
        if self.claim is not None and self.claim.state == RELEASED:
            return RELEASED
        return HELD


def look(storage: Storage, interface: Interface, location: str) -> Look:
    """Read the claim at ``location``, then list ``interface``'s run-records.

    The order is the protocol's: a run writes ``finished_at`` before it
    releases, so a claim read here as released (or naming a finished run)
    means the listing that follows includes that finished run.
    """
    read = storage.read_versioned(location)
    runs = tuple(storage.run_records(interface))
    if read is None:
        return Look(location, False, None, None, runs, "unclaimed")
    content, version = read
    claim = Claim.from_bytes(content)
    if claim is None:
        # unreadable: present, but nothing to name in a replace
        return Look(location, True, None, version, runs, "unclaimed")
    if version is None:
        version = str(claim.generation)
    claimed = next((r for r in runs if r.record_id == claim.record_id), None)
    state = claim_state(claim, claimed.markers if claimed is not None else None)
    return Look(location, True, claim, version, runs, state)


# -- the protocol ---------------------------------------------------------
# Decisions as pure functions of what a look observed and what an operation
# reported, so that the dispatch code and the corpus's protocol vectors
# (``machinable.corpus.protocol_vectors``) run the same table.

Decision = Literal[
    "cached",
    "adopt",
    "wait",
    "report",
    "create",
    "replace",
    "take over",
]


def decide(
    *,
    cached: bool,
    finished: bool,
    claim_file: str,
    claim_state: ClaimState,
    wait: bool,
) -> Decision:
    """What a dispatcher does after a look.

    ``cached``: the interface's ``cached`` marker is there. ``finished``: the
    look listed a finished run this dispatch adopts (one it did not dismiss
    as un-cached). ``claim_file``: ``absent``, ``held`` or ``released``.
    ``claim_state``: :func:`claim_state` of it. ``wait``: whether this
    dispatch waits on a run held elsewhere.

    Returns ``cached`` (nothing to do), ``adopt`` (index the finished run and
    end cached), ``wait`` (look again later), ``report`` (running elsewhere,
    do not wait), ``create`` (create the claim), ``replace`` (replace a
    released claim, or a held one whose run finished) or ``take over``
    (replace a stale claim, then mark its run abandoned).
    """
    if cached:
        return "cached"
    if finished:
        return "adopt"
    if claim_state == "held":
        return "wait" if wait else "report"
    if claim_file == "absent":
        return "create"
    if claim_state == "stale":
        return "take over"
    return "replace"


def after(step: str, won: bool) -> str:
    """What follows an operation that reported ``won`` (it wrote) or lost.

    ``create`` / ``replace``: ``run`` or ``look`` (another dispatcher acted
    in between). ``take over``: ``abandon`` (mark the dead run, then run) or
    ``look``. ``release``: ``done`` or ``dropped`` (a waiter took the claim
    over; the run's result stands).
    """
    if step in ("create", "replace"):
        return "run" if won else "look"
    if step == "take over":
        return "abandon" if won else "look"
    if step == "abandon":
        return "run"
    if step == "release":
        return "done" if won else "dropped"
    raise ValueError(f"Unknown protocol step '{step}'")
