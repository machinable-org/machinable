"""Conformance of the Python implementation against the corpus.

Every implementation of the directory format (this one, the Rust
``machinable-format`` crate, future ones) runs the same checks against
``tests/corpus/``: L0 hashes byte-match, identity derivation matches, ingest
of the store reproduces the expected index rows, and the find algebra returns
the expected results. Python is the *generator* of the corpus: it is produced
into the (gitignored) ``tests/corpus/`` on the first test run and can be
regenerated at any time with ``python -m machinable.corpus``.
"""

import json
import os

import pytest

from machinable.api.models import FindRequest
from machinable.config import canonical, canonical_identity_key
from machinable.index import Index
from machinable.utils import load_file, normjson, object_hash, walk_markers

CORPUS = os.path.join(os.path.dirname(__file__), "corpus")


GENERATED = (
    "l0.json",
    "identity.json",
    "roots.json",
    "tracker.json",
    "claims.json",
    "protocol.json",
    "expected_index.json",
    "behavior.json",
    "results_vectors.json",
)


@pytest.fixture(scope="module", autouse=True)
def generated_corpus():
    # a corpus generated before a vector file existed regenerates whole
    if not all(os.path.isfile(os.path.join(CORPUS, name)) for name in GENERATED):
        from machinable.corpus import generate

        generate(CORPUS)


def test_corpus_l0_vectors():
    for vector in load_file([CORPUS, "l0.json"])["vectors"]:
        value = json.loads(vector["input_json"])
        assert normjson(value) == vector["canonical"]
        assert object_hash(value, default=None) == vector["sha256"]


def test_corpus_identity_vectors():
    for vector in load_file([CORPUS, "identity.json"])["vectors"]:
        assert (
            canonical(vector["resolved"], vector["default"], vector["exclude"])
            == vector["canonical_config"]
        )
        assert (
            canonical_identity_key(
                vector["module"],
                vector["resolved"],
                vector["default"],
                vector["exclude"],
            )
            == vector["identity_key"]
        )


def _root_id(identity_key: str, predicate_key: str) -> str:
    return (
        "P" + object_hash({"identity": identity_key, "predicate": predicate_key})[:11]
    )


def test_corpus_root_vectors():
    """A project's root is keyed by its directory name; the provider is not identity."""
    vectors = load_file([CORPUS, "roots.json"])["vectors"]
    assert {v["provider"] for v in vectors} == {None, "interface/project.py"}
    for vector in vectors:
        assert vector["predicate"] == {"name": vector["name"]}
        assert vector["predicate_key"] == object_hash(vector["predicate"])[:32]
        assert vector["identity_key"] == canonical_identity_key(
            "machinable.project", {}, {}
        )
        assert vector["record_id"] == _root_id(
            vector["identity_key"], vector["predicate_key"]
        )
    by_name: dict[str, set] = {}
    for vector in vectors:
        by_name.setdefault(vector["name"], set()).add(
            (vector["identity_key"], vector["predicate_key"], vector["record_id"])
        )
    # with or without a provider, one project derives one root
    assert all(len(roots) == 1 for roots in by_name.values())
    assert len(by_name) == 2


@pytest.fixture()
def corpus_index(tmp_path):
    store = os.path.join(CORPUS, "store")
    with Index({"database": str(tmp_path / "conformance.sqlite")}) as idx:
        for record_dir in walk_markers(store):
            idx.ingest_directory(record_dir)
        yield idx


def test_corpus_ingest_reproduces_index(corpus_index):
    store = os.path.join(CORPUS, "store")
    expected = load_file([CORPUS, "expected_index.json"])
    for row in expected["rows"]:
        entry = corpus_index.get_by_id(row["record_id"])
        assert entry is not None, row["record_id"]
        assert entry.kind == row["kind"]
        assert entry.module == row["module"]
        assert entry.identity_key == row["identity_key"]
        assert entry.predicate_key == row["predicate_key"]
        assert entry.parent_id == row["parent_id"]
        assert entry.predicate == row["predicate"]
        assert entry.config.resolved == row["config_resolved"]
        assert entry.config.default == row["config_default"]
        assert entry.label == row["label"]
        assert entry.created_by == row["created_by"]
        assert entry.created_at_ns == row["created_at_ns"]
        assert entry.updated_at_ns == row["updated_at_ns"]
        local = corpus_index.local_directory(entry.record_id)
        assert os.path.relpath(local, store).replace(os.sep, "/") == row["storage_path"]

    from machinable.index import db as index_db

    with index_db(corpus_index._resolved_database()) as _db:
        relations = [
            {
                "relation": r["relation"],
                "record_id": r["record_id"],
                "related_id": r["related_id"],
            }
            for r in _db.execute(
                "SELECT relation, record_id, related_id FROM relations"
                " ORDER BY relation, record_id, related_id"
            )
        ]
    assert relations == expected["relations"]


def test_corpus_find_behavior(corpus_index):
    for case in load_file([CORPUS, "behavior.json"])["cases"]:
        response = corpus_index.find(FindRequest(**case["request"]))
        assert response.total == case["expect"]["total"], case["note"]
        assert [i.record_id for i in response.items] == case["expect"]["record_ids"], (
            case["note"]
        )


def _tracker_state(status) -> str:
    """The corpus state name for a status snapshot."""
    if status.is_finished:
        return "finished"
    if status.is_pending:
        return "pending"
    return "live" if status.is_live else "died"


def test_corpus_tracker_vectors():
    """The run state machine, bound to the corpus the format publishes."""
    import arrow

    from machinable.execution import DEFAULT_HEARTBEAT_WINDOW, ExecutionStatus

    corpus = load_file([CORPUS, "tracker.json"])
    assert corpus["window_seconds"] == DEFAULT_HEARTBEAT_WINDOW

    for vector in corpus["vectors"]:
        reference = arrow.get(vector["now"])
        now = arrow.now()
        markers = {
            name: now - (reference - arrow.get(value))
            for name, value in vector["markers"].items()
        }
        # the implementation's own default window, pinned to the corpus above
        status = ExecutionStatus(**markers)
        assert _tracker_state(status) == vector["expect"], vector


def test_corpus_claim_vectors():
    """Claim states from files alone, bound to the corpus the format publishes."""
    import arrow

    from machinable.claims import claim_state
    from machinable.execution import DEFAULT_HEARTBEAT_WINDOW

    corpus = load_file([CORPUS, "claims.json"])
    assert corpus["window_seconds"] == DEFAULT_HEARTBEAT_WINDOW
    for vector in corpus["vectors"]:
        state = claim_state(
            vector["claim"],
            vector["run"],
            now=arrow.get(vector["now"]),
            window=corpus["window_seconds"],
            timeout=corpus["claim_timeout_seconds"],
        )
        assert state == vector["expect"], vector["note"]


def test_corpus_claim_file_is_canonical_json():
    from machinable.claims import Claim

    for vector in load_file([CORPUS, "claims.json"])["vectors"]:
        if vector["claim"] is None:
            continue
        claim = Claim.from_dict(vector["claim"])
        assert claim is not None
        assert claim.to_bytes().decode() == normjson(vector["claim"])
        assert Claim.from_bytes(claim.to_bytes()) == claim


def test_corpus_protocol_vectors():
    """The dispatch protocol's decisions, step by step."""
    from machinable.claims import after, decide

    for sequence in load_file([CORPUS, "protocol.json"])["sequences"]:
        for step in sequence["steps"]:
            if step["step"] == "look":
                got = decide(**step["observed"])
            else:
                got = after(step["step"], step["won"])
            assert got == step["expect"], (sequence["note"], step)


def test_corpus_results_vectors():
    """Every kind reads as the vectors say, needing only the files they name."""
    from machinable import results
    from machinable.corpus import _read_files

    store = os.path.join(CORPUS, "results_store")
    records = load_file([CORPUS, "results_vectors.json"])["records"]
    assert {r["uuid"] for r in records} == {"ResultsDone1", "ResultsLive2"}
    kinds = set()
    for record in records:
        directory = os.path.join(store, *record["path"].split("/"))
        assert load_file([directory, ".machinable"]) == record["uuid"]
        manifest = results.read_manifest(directory)
        assert manifest is not None and manifest["version"] == 1
        assert manifest["complete"] is record["complete"]
        assert manifest.get("run") == record["run"]
        assert set(manifest["results"]) == set(record["results"])
        for name, expected in record["results"].items():
            entry = manifest["results"][name]
            assert entry["kind"] == expected["kind"]
            if not expected["read"]:
                assert entry["kind"] not in results.KINDS
                continue
            kinds.add(entry["kind"])
            value = results.read(directory, entry)
            assert results.to_json(value) == expected["value"], name
            for item in expected.get("items", []):
                i = item["item"]
                assert results.to_json(value[i]) == item["value"]
                assert (
                    _read_files(
                        directory, entry, lambda r, d, e, f, i=i: r.read(d, e, f)[i]
                    )
                    == item["files"]
                )
            for part in expected.get("slices", []):
                start, stop = part["start"], part["stop"]
                if entry["kind"] == "table":
                    read = results.read_table(directory, entry, None, start, stop)
                    assert results.to_json(read) == part["value"]
                    assert (
                        _read_files(
                            directory,
                            entry,
                            lambda r, d, e, f: r.read_table(d, e, f, start, stop),
                        )
                        == part["files"]
                    )
                else:
                    assert results.to_json(value[start:stop]) == part["value"]
    assert kinds == set(results.KINDS)
    # the live record's arrays hold more than its manifest declares (an append
    # half-written): a reader reads the manifest's length
    live = next(r for r in records if not r["complete"])
    directory = os.path.join(store, *live["path"].split("/"))
    units = results.read_manifest(directory)["results"]["units"]
    meta = load_file([directory, units["file"], "unit_id", "zarr.json"])
    assert meta["shape"] == [units["rows"] + 2]
