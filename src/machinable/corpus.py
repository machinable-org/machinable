"""Fixture corpus generator for the machinable directory format (format v1).

The cross-language conformance gate: this module *generates* a corpus
(``tests/corpus/``, gitignored and produced on the first test run) of record
directories plus expected outputs. Any implementation of the format,
Python (``tests/test_corpus.py``), Rust (``machinable-format``), or future
ones, must reproduce the expectations byte-for-byte (hashes) and
row-for-row (ingest).

Contents:
- ``l0.json``: canonical-JSON + sha256 vectors (float/unicode edges)
- ``identity.json``: canonical-config + identity_key derivation vectors
- ``roots.json``: project-root derivation vectors (directory name → root
                            identity_key, predicate_key and record id, the same
                            with or without a project provider)
- ``tracker.json``: run-status state-machine vectors (markers + now → state)
- ``claims.json``: claim-state vectors (claim file + claimed run's markers +
                            now → unclaimed | held | stale)
- ``protocol.json``: claim-protocol sequences (look and operation outcomes →
                            the dispatcher's next step)
- ``plain_records.json``: plain-writer vectors (project, module, plain config,
                            label, creation time and creator, bases → the
                            record id, home, ``id.json``/``model.json`` text,
                            catalog entry and write order)
- ``store/``: deterministic record directories (every kind, edge
                            logs with duplicates, status markers, hash-edge configs)
- ``expected_index.json``: rows a conformant ingest of ``store/`` must produce
- ``behavior.json``: find-request/expected-result pairs over the store
- ``results_store/``: records with declared results (``results.json``), one
                            with every kind and encoding, one live
                            (``complete: false``, an append half-written)
- ``results_vectors.json``: each result's expected value as JSON, by item and
                            slice, with the files a read of it needs

Regenerate with ``python -m machinable.corpus [directory]``. Python is the
reference implementation: the expected outputs are what its code produces at
generation time, so the corpus's teeth are cross-language (another
implementation checked against a Python-generated corpus), not longitudinal.
"""

from __future__ import annotations

import json
import os
import shutil
import sys
from typing import Any

from machinable import schema
from machinable.api.models import FindRequest
from machinable.config import canonical, canonical_identity_key
from machinable.format import bump_updated_at, write_id
from machinable.utils import load_file, normjson, object_hash, save_file

# fixed reference time: 2026-01-01T00:00:00+00:00
EPOCH_ISO = "2026-01-01T00:00:00+00:00"
EPOCH_NS = 1_767_225_600_000_000_000


def _sha256(payload) -> str:
    import hashlib

    return hashlib.sha256(normjson(payload).encode()).hexdigest()


# ---------------------------------------------------------------- L0 vectors

# values chosen to pin the canonical-JSON profile where implementations
# plausibly diverge: float formatting (Python-repr), unicode escaping,
# key sorting, int-vs-float distinction.
_L0_VALUES = [
    1e16,
    1e15,
    1e-4,
    1e-5,
    0.1,
    -0.0,
    1.5e300,
    5e-324,
    9007199254740992.0,  # 2^53
    9007199254740993,  # 2^53+1 as int (stays exact)
    1,
    1.0,  # int vs float must hash differently
    True,
    False,
    None,
    "",
    "ascii",
    "café",  # é: escaped é
    "\U0001f600",  # astral 😀: surrogate pair 😀
    'line\nbreak\ttab "quote" back\\slash',
    [],
    {},
    [1, 2.5, "three", None, True],
    {"b": 1, "a": 2, "nested": {"z": [1e16], "a": "café"}},
    {"1": "numeric-string-key", "01": "leading-zero"},
]


def l0_vectors() -> list[dict]:
    """Canonical-JSON + sha256 vectors over the L0 edge-case values."""
    vectors = []
    for value in _L0_VALUES:
        vectors.append(
            {
                # non-canonical rendering an implementation parses as input
                "input_json": json.dumps(value, ensure_ascii=False, indent=1),
                "canonical": normjson(value),
                "sha256": _sha256(value),
            }
        )
    return vectors


# ---------------------------------------------------------- identity vectors

_IDENTITY_CASES: list[dict[str, Any]] = [
    {
        "module": "example.model",
        "resolved": {"lr": 0.1, "epochs": 10, "name": "run"},
        "default": {"lr": 0.1, "epochs": 5, "name": "run"},
        "exclude": [],
    },
    {
        # whole nested dict at default → stripped
        "module": "example.model",
        "resolved": {"opt": {"kind": "adam", "beta": 0.9}, "lr": 0.2},
        "default": {"opt": {"kind": "adam", "beta": 0.9}, "lr": 0.1},
        "exclude": [],
    },
    {
        # identifying=False fields dropped before hashing
        "module": "example.recorder",
        "resolved": {"data_uri": "/mnt/x/y", "channels": 64},
        "default": {"data_uri": "", "channels": 64},
        "exclude": ["data_uri", "channels"],
    },
    {
        # dotted exclude paths reach into nested mappings
        "module": "example.recorder",
        "resolved": {"data": {"uri": "/mnt/x/y", "fold": 3}, "lr": 0.1},
        "default": {"data": {"uri": "", "fold": 0}, "lr": 0.1},
        "exclude": ["data.uri"],
    },
    {
        # free-form keys absent from default are kept verbatim; unicode + floats
        "module": "example.unicode",
        "resolved": {"label": "café", "threshold": 1e-5, "flag": True},
        "default": {"flag": True},
        "exclude": [],
    },
    {
        "module": None,
        "resolved": {},
        "default": {},
        "exclude": [],
    },
]


def identity_vectors() -> list[dict]:
    """Canonical-config + identity-key derivation vectors."""
    vectors = []
    for case in _IDENTITY_CASES:
        canonical_config = canonical(case["resolved"], case["default"], case["exclude"])
        vectors.append(
            {
                **case,
                "canonical_config": canonical_config,
                "identity_key": canonical_identity_key(
                    case["module"],
                    case["resolved"],
                    case["default"],
                    case["exclude"],
                ),
            }
        )
    return vectors


# -------------------------------------------------------------- root vectors

_PROVIDER_SOURCE = """from pydantic import BaseModel

from machinable import Project


class Provider(Project):
    class Config(BaseModel):
        directory: str | None = None
        cluster: str = "the-lab"

    def on_resolve_remotes(self):
        return {"tool": "file+/dev/null"}
"""


def root_vectors() -> list[dict]:
    """Project-root derivation vectors."""
    import tempfile

    from machinable.project import Project

    vectors = []
    with tempfile.TemporaryDirectory() as tmp:
        for name in ("my-study", "café study"):
            for provider in (False, True):
                directory = os.path.join(tmp, "with" if provider else "without", name)
                os.makedirs(os.path.join(directory, "interface"))
                if provider:
                    save_file([directory, "interface", "project.py"], _PROVIDER_SOURCE)
                project = Project(directory)
                vectors.append(
                    {
                        "name": name,
                        "provider": "interface/project.py" if provider else None,
                        "predicate": project.predicate,
                        "identity_key": project.catalog_identity_key(),
                        "predicate_key": project.predicate_key,
                        "record_id": project.compute_record_id(),
                    }
                )
    return vectors


# ------------------------------------------------------------ tracker vectors


def tracker_vectors() -> list[dict]:
    """Status state-machine vectors.

    Markers + a reference ``now`` → expected state, at the default 90 s
    liveness window.
    """
    t = "2026-01-01T12:00:{s:02d}+00:00"
    return [
        {
            "markers": {"dispatched_at": t.format(s=0)},
            "now": t.format(s=30),
            "expect": "pending",
        },
        {
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=16),
            },
            "now": t.format(s=30),
            "expect": "live",
        },
        {
            # heartbeat 89s old, still inside the 90s window
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=1),
            },
            "now": "2026-01-01T12:01:30+00:00",
            "expect": "live",
        },
        {
            # heartbeat a day old: stale. Pins elapsed time as a total, not as
            # a clock's seconds-of-day component, which would read this as 1s.
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=1),
            },
            "now": "2026-01-02T12:00:02+00:00",
            "expect": "died",
        },
        {
            # heartbeat dated after `now`: the payload's clock runs ahead of the
            # reader's (different machines), and a false "live" beats a false "died"
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": "2026-01-01T12:01:00+00:00",
            },
            "now": t.format(s=30),
            "expect": "live",
        },
        {
            # heartbeat 119s old: stale, no finished_at → died mid-run
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=1),
            },
            "now": "2026-01-01T12:03:00+00:00",
            "expect": "died",
        },
        {
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=45),
                "finished_at": t.format(s=59),
            },
            "now": "2026-01-02T00:00:00+00:00",
            "expect": "finished",
        },
        {
            # legacy run without dispatched_at: started implies dispatched
            "markers": {
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=1),
                "finished_at": t.format(s=2),
            },
            "now": "2026-01-02T00:00:00+00:00",
            "expect": "finished",
        },
        {
            # its claim was taken over: died, however fresh its heartbeat
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=29),
                "abandoned_at": t.format(s=29),
            },
            "now": t.format(s=30),
            "expect": "died",
        },
        {
            # a pending run whose claim was taken: died, not pending forever
            "markers": {
                "dispatched_at": t.format(s=0),
                "abandoned_at": t.format(s=10),
            },
            "now": t.format(s=30),
            "expect": "died",
        },
        {
            # a finish racing the takeover wins
            "markers": {
                "dispatched_at": t.format(s=0),
                "started_at": t.format(s=1),
                "heartbeat_at": t.format(s=1),
                "abandoned_at": "2026-01-01T12:02:00+00:00",
                "finished_at": "2026-01-01T12:02:01+00:00",
            },
            "now": "2026-01-01T12:03:00+00:00",
            "expect": "finished",
        },
    ]


def _claim(record_id: str = "RunClaimd001", state: str = "held", **fields) -> dict:
    claim = {
        "record_id": record_id,
        "state": state,
        "host": "corpus-host",
        "pid": 4242,
        "claimed_at": "2026-01-01T12:00:00+00:00",
        "generation": 1,
    }
    claim.update(fields)
    return claim


def claim_vectors() -> list[dict]:
    """Claim-state vectors.

    The claim file (``null`` when absent) and the claimed run's markers
    (``null`` when its run-record is not there) plus a reference ``now`` →
    ``unclaimed``, ``held`` or ``stale``, at the default 90 s heartbeat
    window and claim timeout (the timeout defaults to the window).
    """
    t = "2026-01-01T12:{m:02d}:{s:02d}+00:00"
    return [
        {
            "note": "no claim file",
            "claim": None,
            "run": None,
            "now": t.format(m=0, s=5),
            "expect": "unclaimed",
        },
        {
            "note": "released",
            "claim": _claim(state="released", generation=2),
            "run": {
                "started_at": t.format(m=0, s=1),
                "finished_at": t.format(m=0, s=9),
            },
            "now": t.format(m=0, s=10),
            "expect": "unclaimed",
        },
        {
            "note": "held, but the claimed run finished: its release was lost",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=0, s=1),
                "finished_at": t.format(m=0, s=9),
            },
            "now": t.format(m=0, s=10),
            "expect": "unclaimed",
        },
        {
            "note": "held, fresh heartbeat",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=1, s=30),
            },
            "now": t.format(m=2, s=0),
            "expect": "held",
        },
        {
            "note": "held, starting: no run-record yet, claimed within the timeout",
            "claim": _claim(),
            "run": None,
            "now": t.format(m=1, s=29),
            "expect": "held",
        },
        {
            "note": "held, no heartbeat, claimed past the timeout",
            "claim": _claim(),
            "run": {"dispatched_at": t.format(m=0, s=0)},
            "now": t.format(m=1, s=31),
            "expect": "stale",
        },
        {
            "note": "held, heartbeat 119 s old, claimed long ago",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=1, s=1),
            },
            "now": t.format(m=3, s=0),
            "expect": "stale",
        },
        {
            "note": "held, heartbeat a day old: elapsed time is a total",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=0, s=1),
            },
            "now": "2026-01-02T12:00:02+00:00",
            "expect": "stale",
        },
        {
            "note": "clock skew: a heartbeat in the reader's future is fresh",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=9, s=0),
            },
            "now": t.format(m=5, s=0),
            "expect": "held",
        },
        {
            "note": "clock skew: a claim made in the reader's future is held",
            "claim": _claim(claimed_at=t.format(m=9, s=0)),
            "run": None,
            "now": t.format(m=5, s=0),
            "expect": "held",
        },
        {
            "note": "re-claimed to resume a died run: a fresh claimed_at covers "
            "the old heartbeat until the claimant beats",
            "claim": _claim(claimed_at=t.format(m=30, s=0), generation=3),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=0, s=1),
            },
            "now": t.format(m=30, s=5),
            "expect": "held",
        },
        {
            "note": "held by an abandoned run: its heartbeat does not count",
            "claim": _claim(),
            "run": {
                "started_at": t.format(m=0, s=1),
                "heartbeat_at": t.format(m=4, s=59),
                "abandoned_at": t.format(m=4, s=0),
            },
            "now": t.format(m=5, s=0),
            "expect": "stale",
        },
    ]


# ----------------------------------------------------------- protocol vectors


def _observed(
    claim_file: str = "absent",
    claim_state: str = "unclaimed",
    *,
    cached: bool = False,
    finished: bool = False,
    wait: bool = True,
) -> dict:
    return {
        "cached": cached,
        "finished": finished,
        "claim_file": claim_file,
        "claim_state": claim_state,
        "wait": wait,
    }


def protocol_vectors() -> list[dict]:
    """Claim-protocol sequences.

    Each step is a look (what it observed: the ``cached`` marker, whether a
    finished run this dispatch adopts is listed, the claim file and its
    state, whether the dispatch waits) or an operation and whether it won;
    ``expect`` is the dispatcher's next step. ``finished`` excludes runs a
    dispatch dismissed: finished runs its index knew at its first look while
    no held claim named them (the interface was un-cached: rerun).
    """
    look = "look"
    return [
        {
            "note": "the first dispatcher claims, runs and releases",
            "steps": [
                {"step": look, "observed": _observed(), "expect": "create"},
                {"step": "create", "won": True, "expect": "run"},
                {"step": "release", "won": True, "expect": "done"},
            ],
        },
        {
            "note": "a second dispatcher loses the create, waits, adopts",
            "steps": [
                {"step": look, "observed": _observed(), "expect": "create"},
                {"step": "create", "won": False, "expect": "look"},
                {"step": look, "observed": _observed("held", "held"), "expect": "wait"},
                # the claimed run wrote finished_at; its release may not be there
                {
                    "step": look,
                    "observed": _observed("held", "unclaimed", finished=True),
                    "expect": "adopt",
                },
            ],
        },
        {
            "note": "the winner released before the waiter looked again",
            "steps": [
                {"step": look, "observed": _observed("held", "held"), "expect": "wait"},
                {
                    "step": look,
                    "observed": _observed("released", "unclaimed", finished=True),
                    "expect": "adopt",
                },
            ],
        },
        {
            "note": "without waiting, a held claim is reported running elsewhere",
            "steps": [
                {
                    "step": look,
                    "observed": _observed("held", "held", wait=False),
                    "expect": "report",
                },
            ],
        },
        {
            "note": "a stale claim is taken over by exactly one of two waiters",
            "steps": [
                {
                    "step": look,
                    "observed": _observed("held", "stale"),
                    "expect": "take over",
                },
                {"step": "take over", "won": True, "expect": "abandon"},
                {"step": "abandon", "won": True, "expect": "run"},
                {"step": "release", "won": True, "expect": "done"},
            ],
        },
        {
            "note": "the other waiter loses the takeover and waits on the new run",
            "steps": [
                {
                    "step": look,
                    "observed": _observed("held", "stale"),
                    "expect": "take over",
                },
                {"step": "take over", "won": False, "expect": "look"},
                {"step": look, "observed": _observed("held", "held"), "expect": "wait"},
            ],
        },
        {
            "note": "a run whose claim was taken over loses its release",
            "steps": [
                {"step": "release", "won": False, "expect": "dropped"},
            ],
        },
        {
            "note": "a lost release: the next dispatcher adopts the finished run",
            "steps": [
                {
                    "step": look,
                    "observed": _observed("held", "unclaimed", finished=True),
                    "expect": "adopt",
                },
            ],
        },
        {
            "note": "un-cached: the dismissed finished run is rerun",
            "steps": [
                {"step": look, "observed": _observed("released"), "expect": "replace"},
                {"step": "replace", "won": True, "expect": "run"},
            ],
        },
        {
            "note": "a failed run released its claim without finishing: run again",
            "steps": [
                {"step": look, "observed": _observed("released"), "expect": "replace"},
                {"step": "replace", "won": False, "expect": "look"},
                {"step": look, "observed": _observed("held", "held"), "expect": "wait"},
            ],
        },
        {
            "note": "cached: nothing to do",
            "steps": [
                {
                    "step": look,
                    "observed": _observed("released", cached=True),
                    "expect": "cached",
                },
            ],
        },
    ]


# ------------------------------------------------------------------ the store


def _record(
    *,
    uuid: str,
    kind: str = "Interface",
    module: str | None,
    resolved: dict,
    default: dict,
    version: list | None = None,
    predicate: dict | None = None,
    predicate_key: str | None = None,
    label: str | None = None,
    parent: str | None = None,
    markers: dict | None = None,
    edges: list | None = None,
) -> dict[str, Any]:
    predicate = predicate or {}
    return {
        "uuid": uuid,
        "kind": kind,
        "module": module,
        "resolved": resolved,
        "default": default,
        "version": version or [],
        "predicate": predicate,
        "identity_key": canonical_identity_key(module, resolved, default),
        "predicate_key": predicate_key or object_hash(predicate)[:32],
        "label": label,
        "parent": parent,
        "markers": markers or {},
        "edges": edges or [],
    }


def _store_records() -> list[dict[str, Any]]:
    interface = _record(
        uuid="IfaceAaaa001",
        module="example.model",
        resolved={"lr": 0.2, "epochs": 10, "name": "café", "eps": 1e-5},
        default={"lr": 0.1, "epochs": 10, "name": "run", "eps": 1e-5},
        version=[{"lr": 0.2}, "~cafe"],
        label="the shared label",
    )
    sibling = _record(
        uuid="IfaceBbbb002",
        module="example.model",
        resolved={"lr": 0.1, "epochs": 10, "name": "run", "eps": 1e-5},
        default={"lr": 0.1, "epochs": 10, "name": "run", "eps": 1e-5},
        predicate={"subject": "m042"},
    )
    # duplicate edge lines on both sides: readers dedup on
    # (name, uuid, related_uuid, fn) with grow-only-set semantics
    use_edge = {
        "name": "Interface.Interface.using",
        "uuid": interface["uuid"],
        "related_uuid": sibling["uuid"],
        "fn": "uses",
        "inverse": False,
        "multiple": True,
        "cached": True,
    }
    interface["edges"] = [use_edge, use_edge]
    sibling["edges"] = [
        {**use_edge, "fn": "used_by", "inverse": True},
        {**use_edge, "fn": "used_by", "inverse": True},
    ]
    # run-records: predicate keyed by the dispatch timestamp (Execution
    # derivation), one per run state
    runs = []
    states = {
        "RunPending001": {"dispatched_at": "2026-01-01T12:00:00+00:00"},
        "RunFinishd002": {
            "dispatched_at": "2026-01-01T12:00:00+00:00",
            "started_at": "2026-01-01T12:00:01+00:00",
            "heartbeat_at": "2026-01-01T12:00:46+00:00",
            "finished_at": "2026-01-01T12:00:59+00:00",
        },
        "RunDiedAbc003": {
            "dispatched_at": "2026-01-01T12:00:00+00:00",
            "started_at": "2026-01-01T12:00:01+00:00",
            "heartbeat_at": "2026-01-01T12:00:16+00:00",
        },
    }
    for i, (run_uuid, markers) in enumerate(states.items()):
        started = f"2026-01-01_12000{i}"
        runs.append(
            _record(
                uuid=run_uuid,
                kind="Execution",
                module="machinable.execution",
                resolved={},
                default={},
                predicate={"resources": None, "started_at": started},
                predicate_key=started,
                parent=interface["uuid"],
                markers=markers,
            )
        )
    records = [interface, sibling, *runs]
    # distinct, deterministic birth dates → the default created_at_ns DESC
    # sort is a total order (no unspecified tie-breaking across backends)
    for i, record in enumerate(records):
        record["created_at_ns"] = EPOCH_NS + i * 1_000_000_000
    return records


def _write_record(root: str, record: dict, by_uuid: dict) -> str:
    segments = [record["identity_key"], record["predicate_key"]]
    if record["parent"] is None:
        directory = os.path.join(root, *segments)
    else:
        # run-records nest under their parent (the normative writer layout)
        parent = by_uuid[record["parent"]]
        directory = os.path.join(
            root, parent["identity_key"], parent["predicate_key"], *segments
        )
    os.makedirs(directory, exist_ok=True)
    save_file([directory, ".machinable"], record["uuid"])
    write_id(
        directory,
        uuid=record["uuid"],
        kind=record["kind"],
        identity_key=record["identity_key"],
        predicate_key=record["predicate_key"],
        parent=record["parent"],
    )
    config = {
        **record["resolved"],
        "_default_": record["default"],
        "_version_": record["version"],
        "_update_": {},
    }
    model_cls = getattr(schema, record["kind"], schema.Interface)
    extras: dict[str, Any] = {}
    if record["kind"] == "Execution":
        # pin the randomly-defaulted fields for byte-stable regeneration
        extras = {"seed": 123456789, "nickname": "corpus_run"}
    model = model_cls(
        uuid=record["uuid"],
        **extras,
        module=record["module"],
        config=config,
        version=record["version"],
        predicate=record["predicate"],
        created_at_ns=record["created_at_ns"],
        created_by="corpus",
        label=record["label"],
    )
    save_file([directory, "model.json"], model)
    for marker, value in record["markers"].items():
        save_file([directory, marker], value)
    for edge in record["edges"]:
        save_file([directory, "related", "metadata.jsonl"], edge, mode="a")
    bump_updated_at(directory, EPOCH_ISO)
    return directory


# ---------------------------------------------------------------- results


def _results_records() -> list[dict[str, Any]]:
    done = _record(
        uuid="ResultsDone1",
        module="example.sort",
        resolved={"sorter": "fake"},
        default={"sorter": "fake"},
    )
    live = _record(
        uuid="ResultsLive2",
        module="example.sort",
        resolved={"sorter": "live"},
        default={"sorter": "fake"},
    )
    for i, record in enumerate((done, live)):
        record["created_at_ns"] = EPOCH_NS + i * 1_000_000_000
    return [done, live]


def _write_results(directory: str, live: bool) -> None:
    """Every kind and encoding (``live``: an append the manifest does not have yet)."""
    import itertools

    import numpy as np

    from machinable import results

    tokens = itertools.count(1)
    pinned = results._token
    results._token = lambda: f"v{next(tokens)}"
    try:
        if live:
            results.save(
                directory,
                "units",
                {"unit_id": np.array([4, 9, 11], dtype="int64")},
                chunks=2,
                run="RunLiveAbc01",
            )
            results.save(
                directory,
                "templates",
                np.arange(12, dtype="float32").reshape(3, 2, 2) / 2,
                chunks=[2, 2, 2],
                run="RunLiveAbc01",
            )
            results.save(
                directory,
                "spike_trains",
                [np.array([5, 6], dtype="int64"), np.array([], dtype="int64")],
                chunks=2,
                run="RunLiveAbc01",
            )
            # a writer mid-append: its chunks and zarr.json are written, the
            # manifest is not yet; readers read the manifest's length only
            manifest = _manifest(directory)
            results.save(
                directory,
                "units",
                {"unit_id": np.array([12, 13], dtype="int64")},
                append=True,
                run="RunLiveAbc01",
            )
            results.save(
                directory,
                "templates",
                np.full((2, 2, 2), 7, dtype="float32"),
                append=True,
                run="RunLiveAbc01",
            )
            results.save(
                directory,
                "spike_trains",
                [np.array([8, 9, 10], dtype="int64")],
                append=True,
                run="RunLiveAbc01",
            )
            results.write_manifest(directory, manifest)
            return
        results.save(
            directory,
            "summary",
            {"sorter": "fake", "units": 5, "duration_s": 600.5, "note": "café 😀"},
            description="what the sort found",
        )
        results.save(
            directory,
            "units",
            {
                "unit_id": np.array([0, 3, 4, 8, 11], dtype="int64"),
                "snr": np.array([1.5, float("nan"), 2.25, -0.0, 1e-5]),
                "amplitude": np.array([0.5, 1.25, -2.0, 3.0, 0.0], dtype="float32"),
                "channel": np.array([0, 1, 255, 7, 2], dtype="uint8"),
                "count": np.array([10, -1, 2**31 - 1, 0, 5], dtype="int32"),
                "good": np.array([True, False, True, True, False]),
                "label": np.array(["good", "mua", "", "café", "noise"], dtype=object),
            },
            chunks=2,
            units={"snr": "1", "amplitude": "uV"},
        )
        results.save(
            directory,
            "templates",
            (np.arange(5 * 4 * 3, dtype="float32") - 30).reshape(5, 4, 3) / 4,
            chunks=[1, 4, 3],
            dims=["unit", "sample", "channel"],
            units="uV",
        )
        # chunks splitting every axis, gzip-compressed
        results.save(
            directory,
            "waveforms",
            (np.arange(5 * 7, dtype="int16") - 17).reshape(5, 7),
            chunks=[2, 3],
            compression="gzip",
        )
        results.save(directory, "mask", np.array([True, False, False, True]), chunks=3)
        # a chunk never written reads as the fill value (0)
        results.save(directory, "sparse", np.array([1.0, 2.0, 3.0, 4.0, 5.0]), chunks=2)
        sparse = _manifest(directory)["results"]["sparse"]["file"]
        os.remove(os.path.join(directory, *sparse.split("/"), "c", "1"))
        # big-endian bytes (any zarr writer may produce them)
        big = results.array_metadata([3], "uint16", [2])
        big["codecs"] = [{"name": "bytes", "configuration": {"endian": "big"}}]
        target = results.ZarrArray(directory, "results/big_endian.v0.zarr")
        target._meta = big
        target.write(np.array([1, 258, 65535], dtype="uint16"), 0)
        target.write_meta(big)
        manifest = _manifest(directory)
        manifest["results"]["big_endian"] = {
            "kind": "array",
            "file": "results/big_endian.v0.zarr",
            "dtype": "uint16",
            "shape": [3],
            "chunks": [2],
        }
        results.write_manifest(directory, manifest)
        results.save(
            directory,
            "spike_trains",
            [
                np.array([1, 5, 9], dtype="int64"),
                np.array([], dtype="int64"),
                np.array([2], dtype="int64"),
                np.array([3, 4, 6, 7], dtype="int64"),
                np.array([10, 2**40], dtype="int64"),
            ],
            chunks=3,
            index="unit",
        )
        results.save(
            directory,
            "amplitudes",
            [np.array([0.5, -1.0], dtype="float32"), np.array([2.0], dtype="float32")],
            compression="gzip",
        )
        # a kind this version does not know: listed, not read
        manifest = _manifest(directory)
        manifest["results"]["frames"] = {"kind": "video", "file": "results/frames.mp4"}
        results.write_manifest(directory, manifest)
    finally:
        results._token = pinned


def _manifest(directory: str) -> dict:
    from machinable import results

    manifest = results.read_manifest(directory)
    assert manifest is not None
    return manifest


def _read_files(directory: str, entry: dict, read) -> list[str]:
    """The record files ``read(fetch)`` brings, from a copy without data files."""
    import tempfile

    from machinable import results

    with tempfile.TemporaryDirectory() as empty:
        brought: list[str] = []

        def fetch(names: list[str]) -> None:
            for name in names:
                source = os.path.join(directory, *name.split("/"))
                if os.path.isfile(source):
                    target = os.path.join(empty, *name.split("/"))
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    shutil.copyfile(source, target)
                brought.append(name)

        read(results, empty, entry, fetch)
        return sorted(set(brought))


def results_vectors(directory: str) -> dict:
    """Each result of ``directory``'s records as JSON, as a conformant reader reads it.

    ``value`` the whole result (a table's columns by name, an array as nested
    lists, a ragged result as a list of lists, NaN as null); ``items`` single
    items with the record files reading one needs (``zarr.json`` and chunks;
    a chunk absent from the record reads as the fill value); ``slices`` rows
    or items ``[start, stop)``.
    """
    from machinable import results

    vectors = []
    for record_dir in sorted(_walk(directory)):
        manifest = results.read_manifest(record_dir)
        if manifest is None:
            continue
        expected: dict[str, Any] = {}
        for name, entry in sorted(manifest["results"].items()):
            kind = entry["kind"]
            if kind not in results.KINDS:
                expected[name] = {"kind": kind, "read": False}
                continue
            value = results.read(record_dir, entry)
            vector: dict[str, Any] = {
                "kind": kind,
                "read": True,
                "value": results.to_json(value),
            }
            if kind == "table":
                stop = min(4, int(entry["rows"]))
                vector["slices"] = [
                    {
                        "start": 1,
                        "stop": stop,
                        "value": results.to_json(
                            results.read_table(record_dir, entry, None, 1, stop)
                        ),
                        "files": _read_files(
                            record_dir,
                            entry,
                            lambda r, d, e, f, stop=stop: r.read_table(
                                d, e, f, 1, stop
                            ),
                        ),
                    }
                ]
            if kind in ("array", "ragged"):
                count = len(value)
                vector["items"] = [
                    {
                        "item": i,
                        "value": results.to_json(value[i]),
                        "files": _read_files(
                            record_dir,
                            entry,
                            lambda r, d, e, f, i=i: r.read(d, e, f)[i],
                        ),
                    }
                    for i in sorted({0, count // 2, count - 1})
                    if count
                ]
                vector["slices"] = [
                    {
                        "start": 1,
                        "stop": count,
                        "value": results.to_json(value[1:count]),
                    }
                ]
            expected[name] = vector
        vectors.append(
            {
                "path": os.path.relpath(record_dir, directory).replace(os.sep, "/"),
                "uuid": load_file([record_dir, ".machinable"]),
                "complete": manifest["complete"],
                "run": manifest.get("run"),
                "results": expected,
            }
        )
    return {"records": vectors}


# ------------------------------------------------------ plain-record vectors

# Python sources of the modules the plain-record vectors name, so the Python
# side can make the same records through real PlainConfig interfaces
# (tests/test_plain_config.py). Keyed by module name.
PLAIN_MODULES: dict[str, str] = {
    "plain_floats": """from machinable import Interface, PlainConfig


class Floats(Interface):
    class Config(PlainConfig):
        tiny: float
        big: float
        neg_zero: float
        ratio: float
        count: int
        values: list[float]
""",
    "plain_nested": """from machinable import Interface, PlainConfig


class Probe(PlainConfig):
    rows: int
    pitch_um: float
    shank: str | None


class Nested(Interface):
    class Config(PlainConfig):
        name: str
        probe: Probe
        tags: dict[str, str | int | None]
        flags: list[bool]
        expression: str
""",
    "captu_data/__init__.py": "",
    "captu_data.open_ephys": """from machinable import Data, PlainConfig


class OpenEphysSession(Data):
    class Config(PlainConfig):
        format: str
        listing: str
""",
}

# a data record's artifacts (path -> UTF-8 content), written before its header
_PLAIN_DATA_FILES = {
    "Record Node 101/structure.oebin": '{"GUI version": "0.6.7"}\n',
    "Record Node 101/continuous/data.dat": "\x00\x01\x02\x03" * 4,
}


def _listing(files: dict[str, str]) -> list[list]:
    """The canonical [path, size] list of a data record's files, sorted."""
    return sorted([path, len(data.encode("utf-8"))] for path, data in files.items())


def _plain_cases() -> list[dict[str, Any]]:
    listing = _listing(_PLAIN_DATA_FILES)
    files_json = json.dumps(
        {"files": [{"path": path, "size": size} for path, size in listing]},
        sort_keys=True,
    )
    return [
        {
            "name": "float-heavy",
            "project": "my-study",
            "module": "plain_floats",
            "inherits": ["machinable.interface"],
            # keys out of order on purpose: model.json stores them sorted
            "config": {
                "values": [1e15, 1.5e300, 5e-324, 9007199254740992.0, 0.0],
                "tiny": 1e-05,
                "ratio": 0.1,
                "neg_zero": -0.0,
                "count": 9007199254740993,
                "big": 1e16,
            },
            "label": None,
            "created_at_ns": EPOCH_NS,
            "created_by": "corpus",
            "artifacts": {},
        },
        {
            "name": "nested-unicode",
            "project": "café study",
            "module": "plain_nested",
            "inherits": ["machinable.interface"],
            "config": {
                "name": "Maus 3 — Sitzung \U0001f600",
                "probe": {"shank": None, "rows": 384, "pitch_um": 20.0},
                "tags": {"z": "last", "a": 1, "m": None},
                "flags": [True, False],
                # neither is resolved: a plain config is data
                "expression": "${probe.rows} foo(1)",
            },
            "label": 'Café été \U0001f600 "quoted"\n',
            "created_at_ns": EPOCH_NS + 1,
            "created_by": "zoë",
            "artifacts": {},
        },
        {
            "name": "data-record",
            # data records live in a fixed project named `data`
            "project": "data",
            "module": "captu_data.open_ephys",
            "inherits": ["machinable.data", "machinable.interface"],
            "config": {
                "format": "open_ephys",
                "listing": _sha256(listing),
            },
            "label": "Rig 2 / 2026-10-28",
            "created_at_ns": EPOCH_NS + 2,
            "created_by": "rig2",
            # the data first, then the module's own index of it (files.json),
            # which the module writes last of its artifacts
            "artifacts": {**_PLAIN_DATA_FILES, "files.json": files_json},
        },
    ]


def plain_record_vectors() -> list[dict]:
    """Plain-writer vectors: inputs -> the files a plain writer writes.

    ``expect`` holds the record id, its keys and parent, its home relative to
    the storage root, the exact UTF-8 text of ``id.json``, ``model.json`` and
    ``.machinable``, the catalog-log entry (for a write at ``created_at_ns``)
    and the order of writes at a remote home.
    """
    from machinable.plain import plain_record

    vectors = []
    for case in _plain_cases():
        expect = plain_record(
            project=case["project"],
            module=case["module"],
            config=case["config"],
            inherits=case["inherits"],
            created_at_ns=case["created_at_ns"],
            created_by=case["created_by"],
            label=case["label"],
        )
        expect["write_order"] = [
            *case["artifacts"],
            "model.json",
            "id.json",
            ".machinable",
            "updated_at",
            expect["catalog_entry"]["name"],
        ]
        vectors.append(
            {
                "name": case["name"],
                "input": {k: v for k, v in case.items() if k != "name"},
                "expect": expect,
            }
        )
    return vectors


def _walk(directory: str) -> list[str]:
    from machinable.utils import walk_markers

    return list(walk_markers(directory))


def _behavior_requests() -> list[dict]:
    """Find-request cases over the store.

    Exercises the find algebra, including the normative SQLite mixed-type comparison
    semantics.
    """
    return [
        {"note": "module equality", "request": {"module": "example.model"}},
        {"note": "kind equality", "request": {"kind": "Execution"}},
        {
            "note": "predicate path equality",
            "request": {"predicate": {"subject": "m042"}},
        },
        {
            "note": "config eq on resolved layer",
            "request": {
                "module": "example.model",
                "config": {
                    "layer": "resolved",
                    "filters": [{"path": "lr", "op": "eq", "value": 0.2}],
                },
            },
        },
        {
            "note": "config gt numeric",
            "request": {
                "module": "example.model",
                "config": {
                    "layer": "resolved",
                    "filters": [{"path": "lr", "op": "gt", "value": 0.15}],
                },
            },
        },
        {
            "note": "config in membership",
            "request": {
                "config": {
                    "layer": "resolved",
                    "filters": [{"path": "name", "op": "in", "value": ["café", "x"]}],
                },
            },
        },
        {
            "note": "config contains substring",
            "request": {
                "config": {
                    "layer": "resolved",
                    "filters": [{"path": "name", "op": "contains", "value": "af"}],
                },
            },
        },
        {
            "note": "mixed-type gt: number vs text column (SQLite semantics)",
            "request": {
                "config": {
                    "layer": "resolved",
                    "filters": [{"path": "name", "op": "gt", "value": 1e6}],
                },
            },
        },
        {
            "note": "label equality",
            "request": {"label": "the shared label"},
        },
        {
            "note": "sort by module asc + created desc (total order), paginated",
            "request": {
                "sort": [
                    {"by": "module", "direction": "asc"},
                    {"by": "created_at_ns", "direction": "desc"},
                ],
                "limit": 3,
                "offset": 1,
            },
        },
        {
            "note": "record_id suffix",
            "request": {"record_id_suffix": "002"},
        },
    ]


def generate(directory: str) -> dict:
    """Generate the corpus into ``directory`` (wiping a prior generation)."""
    from machinable.index import Index

    directory = os.path.abspath(directory)
    if os.path.isdir(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)
    store = os.path.join(directory, "store")

    records = _store_records()
    by_uuid = {r["uuid"]: r for r in records}
    for record in records:
        _write_record(store, record, by_uuid)

    save_file([directory, "l0.json"], {"vectors": l0_vectors()})
    save_file([directory, "identity.json"], {"vectors": identity_vectors()})
    save_file([directory, "roots.json"], {"vectors": root_vectors()})
    save_file(
        [directory, "tracker.json"],
        {"window_seconds": 90, "vectors": tracker_vectors()},
    )
    save_file(
        [directory, "claims.json"],
        {
            "window_seconds": 90,
            "claim_timeout_seconds": 90,
            "vectors": claim_vectors(),
        },
    )
    save_file([directory, "protocol.json"], {"sequences": protocol_vectors()})
    save_file(
        [directory, "plain_records.json"],
        {"format": 1, "vectors": plain_record_vectors()},
    )

    results_store = os.path.join(directory, "results_store")
    results_records = _results_records()
    for record in results_records:
        record_dir = _write_record(results_store, record, {})
        _write_results(record_dir, live=record["uuid"] == "ResultsLive2")
        bump_updated_at(record_dir, EPOCH_ISO)
    save_file([directory, "results_vectors.json"], results_vectors(results_store))

    # expected index rows + behavioral expectations come from running the real
    # implementation at generation time; Python is the reference.
    from machinable.index import db as index_db
    from machinable.utils import walk_markers

    with Index({"database": os.path.join(directory, "_generation.sqlite")}) as idx:
        for record_dir in walk_markers(store):
            idx.ingest_directory(record_dir)

        expected_rows = []
        for record in sorted(records, key=lambda r: r["uuid"]):
            entry = idx.get_by_id(record["uuid"])
            assert entry is not None
            expected_rows.append(
                {
                    "record_id": entry.record_id,
                    "kind": entry.kind,
                    "module": entry.module,
                    "identity_key": entry.identity_key,
                    "predicate_key": entry.predicate_key,
                    "parent_id": entry.parent_id,
                    "predicate": entry.predicate,
                    "config_resolved": entry.config.resolved,
                    "config_default": entry.config.default,
                    "label": entry.label,
                    "created_by": entry.created_by,
                    "created_at_ns": entry.created_at_ns,
                    "updated_at_ns": entry.updated_at_ns,
                    # store-relative so the corpus is relocatable
                    "storage_path": os.path.relpath(
                        idx.local_directory(entry.record_id), store
                    ).replace(os.sep, "/"),
                }
            )
        # relations, deduped by the index's unique constraint
        with index_db(idx._resolved_database()) as _db:
            assert _db is not None
            relations = [
                {
                    "relation": row["relation"],
                    "record_id": row["record_id"],
                    "related_id": row["related_id"],
                }
                for row in _db.execute(
                    "SELECT relation, record_id, related_id FROM relations"
                    " ORDER BY relation, record_id, related_id"
                )
            ]
        save_file(
            [directory, "expected_index.json"],
            {"rows": expected_rows, "relations": relations},
        )

        behavior = []
        for case in _behavior_requests():
            response = idx.find(FindRequest(**case["request"]))
            behavior.append(
                {
                    **case,
                    "expect": {
                        "total": response.total,
                        "record_ids": [i.record_id for i in response.items],
                    },
                }
            )
        save_file([directory, "behavior.json"], {"cases": behavior})

    for suffix in ("", "-wal", "-shm"):
        try:
            os.remove(os.path.join(directory, f"_generation.sqlite{suffix}"))
        except OSError:
            pass
    return {"records": len(records), "directory": directory}


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "tests/corpus"
    summary = generate(target)
    print(f"Corpus generated: {summary['records']} records at {summary['directory']}")
