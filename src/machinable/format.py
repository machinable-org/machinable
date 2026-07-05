"""The machinable directory-format contract (format v1).

Single implementation site for the on-disk format header (``id.json``) and the
``updated_at`` sync marker, shared by the writers (``Interface.to_directory``),
the reader (``Index.ingest_directory``), and the one-shot upgrade tool
(``machinable migrate``).

Format v1 in one line: a record directory is self-describing; ``.machinable``
is a pure discovery sentinel, ``id.json`` carries the identity header (uuid +
identity/predicate keys + logical parent) so ingest is a pure copy with no
Python recompute, and ``updated_at`` is the per-record sync signal bumped by
every official mutating API.
"""

from __future__ import annotations

import os

import arrow

from machinable.utils import load_file, save_file

FORMAT_VERSION = 1
ID_FILENAME = "id.json"
UPDATED_AT_FILENAME = "updated_at"


def write_id(
    directory: str,
    *,
    uuid: str,
    kind: str,
    identity_key: str,
    predicate_key: str,
    parent: str | None,
) -> None:
    """Write the immutable ``id.json`` format header.

    Called once, at materialization; the header never changes afterwards.
    """
    save_file(
        [directory, ID_FILENAME],
        {
            "format": FORMAT_VERSION,
            "uuid": uuid,
            "kind": kind,
            "identity_key": identity_key,
            "predicate_key": predicate_key,
            "parent": parent,
        },
    )


def read_id(directory: str) -> dict | None:
    """Read the format header, or None if the directory is not format-v1."""
    data = load_file([directory, ID_FILENAME], None)
    if not isinstance(data, dict) or "uuid" not in data:
        return None
    return data


def bump_updated_at(directory: str, timestamp=None) -> str:
    """Overwrite the per-record ``updated_at`` marker.

    ISO-8601, same family as the ``*_at`` status markers. Returns the written
    timestamp string.
    """
    if timestamp is None:
        timestamp = arrow.now()
    value = str(timestamp)
    save_file([directory, UPDATED_AT_FILENAME], value)
    return value


def read_updated_at_ns(directory: str) -> int | None:
    """The record's ``updated_at`` as epoch nanoseconds, or None if absent."""
    value = load_file([directory, UPDATED_AT_FILENAME], None)
    if value is None:
        return None
    try:
        return int(arrow.get(str(value).strip()).float_timestamp * 1e9)
    except (arrow.ParserError, ValueError):
        return None


def is_record_directory(directory: str) -> bool:
    """A conformant format-v1 record directory: sentinel + header."""
    from machinable.utils import is_machinable_directory

    return is_machinable_directory(directory) and os.path.isfile(
        os.path.join(directory, ID_FILENAME)
    )
