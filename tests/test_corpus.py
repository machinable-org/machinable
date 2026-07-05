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


@pytest.fixture(scope="module", autouse=True)
def generated_corpus():
    if not os.path.isdir(CORPUS):
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
