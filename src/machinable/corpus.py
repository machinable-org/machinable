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
- ``tracker.json``: run-status state-machine vectors (markers + now → state)
- ``store/``: deterministic record directories (every kind, edge
                            logs with duplicates, status markers, hash-edge configs)
- ``expected_index.json``: rows a conformant ingest of ``store/`` must produce
- ``behavior.json``: find-request/expected-result pairs over the store

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
from machinable.utils import normjson, object_hash, save_file

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
    save_file(
        [directory, "tracker.json"],
        {"window_seconds": 90, "vectors": tracker_vectors()},
    )

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
