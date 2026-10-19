"""Results: a record's results as files, declared in its ``results.json``.

The format's results extension (``docs/design/format.md``, "Results"): a
record's results are files under ``results/``, declared in a manifest
(``results.json``) that names each result, its kind and its file. Four kinds:

- ``json``: one JSON value (a summary), one file;
- ``table``: columns of one length, a zarr v3 group of 1-D arrays;
- ``array``: an n-d zarr v3 array, an item being an index along its first axis;
- ``ragged``: items of different lengths, a zarr v3 group of ``values`` (1-D)
  and ``offsets`` (``items + 1``), item ``i`` being
  ``values[offsets[i]:offsets[i + 1]]``.

The zarr arrays use a small subset of zarr v3 (a regular chunk grid, the
``bytes`` or ``vlen-utf8`` codec and optionally ``gzip``) that this module
writes and reads itself, so no zarr library is needed in Python, and any zarr
v3 reader (or a few dozen lines of another language) reads them. numpy is
needed for the table, array and ragged kinds only.

Writers write the data, then the arrays' ``zarr.json``, then the manifest,
then ``updated_at``: a reader that sees a result in the manifest sees all of
it, and reads no further than the manifest's length while a run appends.
"""

from __future__ import annotations

import functools
import gzip
import inspect
import json
import math
import os
import re
import struct
from collections.abc import Callable, Iterator, Mapping, Sequence
from typing import TYPE_CHECKING, Any

from machinable.errors import MachinableError
from machinable.utils import random_str

if TYPE_CHECKING:
    import numpy as np

    from machinable.interface import Interface

RESULTS_FILENAME = "results.json"
RESULTS_DIRECTORY = "results"
RESULTS_VERSION = 1
KINDS = ("json", "table", "array", "ragged")
NUMERIC_DTYPES = (
    "bool",
    "int8",
    "int16",
    "int32",
    "int64",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "float32",
    "float64",
)
STRING_DTYPE = "string"
NAME_PATTERN = re.compile(r"^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$")
ZARR_JSON = "zarr.json"
# Default chunks. A chunk file always holds the whole chunk shape (zarr v3's
# regular grid pads the edge chunk with the fill value), so a chunk much longer
# than the data is mostly padding on disk: a fresh write sizes the chunk to the
# data, up to these limits.
# at most this many rows per chunk of a table's columns and a ragged result's
# values and offsets
ROWS_PER_CHUNK = 65536
# an array's chunk: whole items, at most about this many bytes (at least one item)
ITEM_CHUNK_BYTES = 65536
# a fresh write's chunk: the length rounded up to a power of two, at least this
# (so a small result later appended to still grows by whole chunks of some size)
MIN_ROWS_PER_CHUNK = 64
# rows per chunk of a column, values or offsets first written with append=True:
# a live result grows, so its chunk is fixed ahead of its length
LIVE_ROWS_PER_CHUNK = 4096

# brings record-relative file names into the working copy (a remote home's)
Fetch = Callable[[list[str]], None]


class ResultError(MachinableError):
    """A result cannot be written or read as asked."""


def _numpy():
    try:
        import numpy
    except ImportError as ex:  # pragma: no cover - numpy is in the dev group
        raise ResultError(
            "Tables, arrays and ragged results need numpy (pip install numpy)"
        ) from ex
    return numpy


def _json_bytes(value: Any) -> bytes:
    """Canonical JSON (sorted keys, compact, ASCII); NaN and infinities rejected."""
    try:
        text = json.dumps(
            value,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
            default=_json_default,
        )
    except ValueError as ex:
        raise ResultError(
            f"A json result cannot hold NaN or infinity ({ex}); use null"
        ) from ex
    return text.encode("utf-8")


def _json_default(value: Any) -> Any:
    numpy = _numpy() if type(value).__module__ == "numpy" else None
    if numpy is not None:
        if isinstance(value, numpy.ndarray):
            return value.tolist()
        if isinstance(value, numpy.generic):
            return value.item()
    from machinable.utils import serialize

    return serialize(value)


def _write_bytes(path: str, data: bytes) -> None:
    """Write ``path`` whole: a reader sees the old file or the new one."""
    directory = os.path.dirname(path)
    os.makedirs(directory, exist_ok=True)
    temporary = os.path.join(directory, f".tmp-{random_str(12)}")
    with open(temporary, "wb") as f:
        f.write(data)
    os.replace(temporary, path)


def _read_json_file(path: str) -> Any:
    try:
        with open(path, "rb") as f:
            return json.loads(f.read().decode("utf-8"))
    except (OSError, ValueError):
        return None


# -- the manifest -------------------------------------------------------------------


def read_manifest(directory: str) -> dict | None:
    """The manifest of the record at ``directory``; None when it has none.

    A manifest of a later version than this reader knows is refused.
    """
    manifest = _read_json_file(os.path.join(directory, RESULTS_FILENAME))
    if not isinstance(manifest, dict) or not isinstance(manifest.get("results"), dict):
        return None
    if manifest.get("version", 1) > RESULTS_VERSION:
        raise ResultError(
            f"results.json version {manifest['version']} is newer than this"
            f" reader's ({RESULTS_VERSION})"
        )
    return manifest


def write_manifest(directory: str, manifest: dict) -> None:
    """Write the manifest (canonical JSON), whole."""
    _write_bytes(os.path.join(directory, RESULTS_FILENAME), _json_bytes(manifest))


def check_name(name: str) -> str:
    """A result (or column) name: letters, digits, ``_``, ``.``, ``-``."""
    if not isinstance(name, str) or not NAME_PATTERN.match(name) or name == ZARR_JSON:
        raise ResultError(
            f"'{name}' is not a result name: up to 128 letters, digits, '_', '.'"
            " or '-', not starting with '.' or '-'"
        )
    return name


# -- zarr v3, the subset results use ------------------------------------------------


def _fill_value(dtype: str) -> Any:
    if dtype == "bool":
        return False
    if dtype == STRING_DTYPE:
        return ""
    if dtype.startswith("float"):
        return 0.0
    return 0


def array_metadata(
    shape: Sequence[int],
    dtype: str,
    chunks: Sequence[int],
    *,
    dims: Sequence[str] | None = None,
    compression: str | None = None,
    attributes: dict | None = None,
) -> dict:
    """The ``zarr.json`` of an array results write."""
    codecs: list[dict[str, Any]]
    if dtype == STRING_DTYPE:
        codecs = [{"name": "vlen-utf8", "configuration": {}}]
    elif dtype in ("bool", "int8", "uint8"):
        codecs = [{"name": "bytes"}]
    else:
        codecs = [{"name": "bytes", "configuration": {"endian": "little"}}]
    if compression == "gzip":
        codecs.append({"name": "gzip", "configuration": {"level": 5}})
    elif compression is not None:
        raise ResultError(f"Unknown compression '{compression}' (None or 'gzip')")
    meta: dict[str, Any] = {
        "zarr_format": 3,
        "node_type": "array",
        "shape": [int(n) for n in shape],
        "data_type": dtype,
        "chunk_grid": {
            "name": "regular",
            "configuration": {"chunk_shape": [int(n) for n in chunks]},
        },
        "chunk_key_encoding": {"name": "default", "configuration": {"separator": "/"}},
        "fill_value": _fill_value(dtype),
        "codecs": codecs,
        "attributes": attributes or {},
    }
    if dims is not None:
        meta["dimension_names"] = list(dims)
    return meta


def group_metadata(attributes: dict | None = None) -> dict:
    """The ``zarr.json`` of a group (a table, a ragged result)."""
    return {"zarr_format": 3, "node_type": "group", "attributes": attributes or {}}


def chunk_key(meta: dict, index: Sequence[int]) -> str:
    """The file of chunk ``index`` relative to its array."""
    encoding = meta.get("chunk_key_encoding") or {}
    name = encoding.get("name", "default")
    separator = (encoding.get("configuration") or {}).get(
        "separator", "/" if name == "default" else "."
    )
    if name == "v2":
        return separator.join(str(i) for i in index) if index else "0"
    return separator.join(["c", *(str(i) for i in index)])


def _chunk_shape(meta: dict) -> list[int]:
    grid = meta.get("chunk_grid") or {}
    if grid.get("name") != "regular":
        raise ResultError(f"Unsupported chunk grid {grid.get('name')!r}")
    return [int(n) for n in grid["configuration"]["chunk_shape"]]


def _np_dtype(dtype: str, endian: str = "little"):
    numpy = _numpy()
    if dtype not in NUMERIC_DTYPES:
        raise ResultError(f"Unsupported data type {dtype!r}")
    base = numpy.dtype(dtype)
    if base.itemsize == 1:
        return base
    return base.newbyteorder("<" if endian == "little" else ">")


def encode_chunk(meta: dict, chunk: np.ndarray) -> bytes:
    """Encode one chunk (already of the chunk shape) with the array's codecs."""
    numpy = _numpy()
    dtype = meta["data_type"]
    codecs = meta["codecs"]
    if dtype == STRING_DTYPE:
        flat = chunk.reshape(-1)
        parts = [struct.pack("<I", flat.size)]
        for item in flat:
            data = str(item).encode("utf-8")
            parts += [struct.pack("<I", len(data)), data]
        encoded = b"".join(parts)
    else:
        endian = (codecs[0].get("configuration") or {}).get("endian", "little")
        encoded = numpy.ascontiguousarray(
            chunk, dtype=_np_dtype(dtype, endian)
        ).tobytes()
    for codec in codecs[1:]:
        if codec["name"] == "gzip":
            level = int((codec.get("configuration") or {}).get("level", 5))
            encoded = gzip.compress(encoded, compresslevel=level, mtime=0)
        else:
            raise ResultError(f"Unsupported codec {codec['name']!r}")
    return encoded


def decode_chunk(meta: dict, data: bytes) -> np.ndarray:
    """Decode one chunk's bytes into an array of the chunk shape."""
    numpy = _numpy()
    codecs = list(meta["codecs"])
    if not codecs:
        raise ResultError("An array without codecs")
    for codec in reversed(codecs[1:]):
        if codec["name"] == "gzip":
            data = gzip.decompress(data)
        else:
            raise ResultError(f"Unsupported codec {codec['name']!r}")
    shape = _chunk_shape(meta)
    first = codecs[0]
    if first["name"] == "vlen-utf8":
        count = struct.unpack_from("<I", data, 0)[0]
        position, items = 4, []
        for _ in range(count):
            length = struct.unpack_from("<I", data, position)[0]
            position += 4
            items.append(data[position : position + length].decode("utf-8"))
            position += length
        return numpy.array(items, dtype=object).reshape(shape)
    if first["name"] != "bytes":
        raise ResultError(f"Unsupported codec {first['name']!r}")
    endian = (first.get("configuration") or {}).get("endian", "little")
    values = numpy.frombuffer(data, dtype=_np_dtype(meta["data_type"], endian))
    return values.reshape(shape).astype(values.dtype.newbyteorder("="), copy=False)


class ZarrArray:
    """A zarr v3 array in a record, read and written by chunk.

    ``prefix`` is the array's folder relative to the record ``directory``;
    ``fetch`` (when the record's home is elsewhere) brings files before they
    are read.
    """

    def __init__(
        self,
        directory: str,
        prefix: str,
        meta: dict | None = None,
        fetch: Fetch | None = None,
    ):
        self.directory = directory
        self.prefix = prefix.strip("/")
        self.fetch = fetch
        self._meta = meta

    def _path(self, name: str) -> str:
        return os.path.join(self.directory, *f"{self.prefix}/{name}".split("/"))

    def _bring(self, names: list[str]) -> None:
        if self.fetch is None:
            return
        missing = [n for n in names if not os.path.isfile(self._path(n))]
        if missing:
            self.fetch([f"{self.prefix}/{n}" for n in missing])

    @property
    def meta(self) -> dict:
        """The array's ``zarr.json``."""
        if self._meta is None:
            self._bring([ZARR_JSON])
            meta = _read_json_file(self._path(ZARR_JSON))
            if not isinstance(meta, dict) or meta.get("node_type") != "array":
                raise ResultError(
                    f"'{self.prefix}' is not there (the result was replaced or"
                    " removed since its manifest was read; read it again)"
                )
            self._meta = meta
        return self._meta

    def chunk_files(self, start: int, stop: int) -> list[tuple[tuple[int, ...], str]]:
        """The chunks covering rows ``[start, stop)`` of the first axis."""
        import itertools

        meta = self.meta
        chunks = _chunk_shape(meta)
        shape = meta["shape"]
        if stop <= start:
            return []
        first = range(start // chunks[0], (stop - 1) // chunks[0] + 1)
        rest = [range(max(1, math.ceil(n / c))) for n, c in zip(shape[1:], chunks[1:])]
        return [
            (index, chunk_key(meta, index)) for index in itertools.product(first, *rest)
        ]

    def read(self, start: int, stop: int) -> np.ndarray:
        """Rows ``[start, stop)`` of the first axis, every other axis whole."""
        numpy = _numpy()
        meta = self.meta
        chunks = _chunk_shape(meta)
        shape = [stop - start, *meta["shape"][1:]]
        dtype = object if meta["data_type"] == STRING_DTYPE else meta["data_type"]
        out = numpy.full(shape, meta.get("fill_value"), dtype=dtype)
        files = self.chunk_files(start, stop)
        self._bring([name for _, name in files])
        for index, name in files:
            try:
                with open(self._path(name), "rb") as f:
                    chunk = decode_chunk(meta, f.read())
            except FileNotFoundError:
                continue  # a chunk never written is the fill value (zarr)
            lower = [i * c for i, c in zip(index, chunks)]
            source, target = [], []
            for axis, (low, size) in enumerate(zip(lower, chunks)):
                begin, end = (start, stop) if axis == 0 else (0, meta["shape"][axis])
                a, b = max(low, begin), min(low + size, end)
                source.append(slice(a - low, b - low))
                target.append(slice(a - begin, b - begin))
            out[tuple(target)] = chunk[tuple(source)]
        return out

    def write(self, data: np.ndarray, start: int) -> list[str]:
        """Write ``data`` as rows from ``start`` (a chunk boundary) on.

        The chunks it covers are written whole (the rows of the last one past
        ``data`` are fill), so ``data`` must hold every row of those chunks
        from ``start``. Returns the record-relative names written.
        """
        numpy = _numpy()
        meta = self.meta
        chunks = _chunk_shape(meta)
        if start % chunks[0]:
            raise ResultError("Writes start at a chunk boundary")
        written = []
        dtype = object if meta["data_type"] == STRING_DTYPE else meta["data_type"]
        for index, name in self.chunk_files(start, start + len(data)):
            lower = [i * c for i, c in zip(index, chunks)]
            chunk = numpy.full(chunks, meta.get("fill_value"), dtype=dtype)
            source, target = [], []
            for axis, (low, size) in enumerate(zip(lower, chunks)):
                extent = start + len(data) if axis == 0 else meta["shape"][axis]
                end = min(low + size, extent)
                offset = start if axis == 0 else 0
                source.append(slice(low - offset, end - offset))
                target.append(slice(0, end - low))
            chunk[tuple(target)] = data[tuple(source)]
            _write_bytes(self._path(name), encode_chunk(meta, chunk))
            written.append(f"{self.prefix}/{name}")
        return written

    def write_meta(self, meta: dict) -> str:
        """Write ``zarr.json``; its record-relative name."""
        self._meta = meta
        _write_bytes(self._path(ZARR_JSON), _json_bytes(meta))
        return f"{self.prefix}/{ZARR_JSON}"


def _write_group(directory: str, prefix: str, attributes: dict) -> str:
    _write_bytes(
        os.path.join(directory, *prefix.split("/"), ZARR_JSON),
        _json_bytes(group_metadata(attributes)),
    )
    return f"{prefix}/{ZARR_JSON}"


# -- values to kinds ----------------------------------------------------------------


def _is_dataframe(value: Any) -> bool:
    return type(value).__name__ == "DataFrame" and hasattr(value, "columns")


def infer_kind(value: Any) -> str:
    """The kind a value is saved as when none is given."""
    if _is_dataframe(value):
        return "table"
    module = type(value).__module__
    if module == "numpy" and type(value).__name__ == "ndarray":
        return "array" if value.ndim > 0 else "json"
    if (
        isinstance(value, Mapping)
        and value
        and all(
            type(v).__module__ == "numpy" and type(v).__name__ == "ndarray"
            for v in value.values()
        )
    ):
        return "table"
    if (
        isinstance(value, list | tuple)
        and value
        and all(
            type(v).__module__ == "numpy"
            and type(v).__name__ == "ndarray"
            and v.ndim == 1
            for v in value
        )
    ):
        return "ragged"
    return "json"


def _dtype_name(array: np.ndarray, what: str) -> str:
    numpy = _numpy()
    if array.dtype.kind in ("U", "S", "O", "T"):
        if array.dtype.kind == "O" and not all(isinstance(v, str) for v in array):
            raise ResultError(f"{what}: only strings may be objects")
        return STRING_DTYPE
    name = numpy.dtype(array.dtype).newbyteorder("=").name
    if name not in NUMERIC_DTYPES:
        raise ResultError(
            f"{what}: data type {array.dtype} is not one of"
            f" {', '.join(NUMERIC_DTYPES)}, {STRING_DTYPE}"
        )
    return name


def _columns(value: Any) -> dict[str, np.ndarray]:
    numpy = _numpy()
    if _is_dataframe(value):
        items = [(str(c), value[c].to_numpy()) for c in value.columns]
    elif isinstance(value, Mapping):
        items = [(str(k), numpy.asarray(v)) for k, v in value.items()]
    else:
        raise ResultError("A table is a mapping of columns or a DataFrame")
    columns: dict[str, np.ndarray] = {}
    for name, column in items:
        check_name(name)
        if column.ndim != 1:
            raise ResultError(f"Column '{name}' is not one-dimensional")
        if column.dtype.kind == "U" or (
            column.dtype.kind == "O" and all(isinstance(v, str) for v in column)
        ):
            column = column.astype(object)
        columns[name] = column
    lengths = {len(c) for c in columns.values()}
    if len(lengths) > 1:
        raise ResultError(f"Columns of different lengths: {sorted(lengths)}")
    if not columns:
        raise ResultError("A table needs at least one column")
    return columns


def _fitted(length: int) -> int:
    """A fresh write's rows per chunk for ``length`` rows (before the limits)."""
    return max(MIN_ROWS_PER_CHUNK, 1 << max(0, length - 1).bit_length())


def _default_rows(length: int, append: bool) -> int:
    """Rows per chunk of a column, ragged values or offsets of ``length`` rows."""
    if append:
        return LIVE_ROWS_PER_CHUNK
    return min(ROWS_PER_CHUNK, _fitted(length))


def _default_chunks(shape: Sequence[int], itemsize: int, append: bool) -> list[int]:
    per_item = max(1, itemsize * math.prod(shape[1:]))
    items = max(1, ITEM_CHUNK_BYTES // per_item)
    if not append:
        items = min(items, _fitted(shape[0]))
    return [items, *shape[1:]]


# -- writing ------------------------------------------------------------------------


class Written:
    """What a save wrote and removed, record-relative, in the order to publish."""

    def __init__(self) -> None:
        self.files: list[str] = []
        self.removed: list[str] = []


def _files_of(directory: str, entry: dict) -> list[str]:
    """The record-relative files of a result entry that are in ``directory``."""
    file = str(entry.get("file", "")).strip("/")
    if not file or file.startswith("..") or "/../" in f"/{file}/":
        return []
    path = os.path.join(directory, *file.split("/"))
    if os.path.isfile(path):
        return [file]
    found = []
    for dirpath, _, filenames in os.walk(path):
        relative = os.path.relpath(dirpath, directory).replace(os.sep, "/")
        found += [f"{relative}/{n}" for n in filenames]
    return sorted(found)


def _remove(directory: str, names: list[str]) -> None:
    for name in names:
        try:
            os.remove(os.path.join(directory, *name.split("/")))
        except OSError:
            pass
    # prune the folders left empty
    for name in sorted(names, key=lambda n: -n.count("/")):
        parent = os.path.dirname(os.path.join(directory, *name.split("/")))
        while os.path.abspath(parent) != os.path.abspath(directory):
            try:
                os.rmdir(parent)
            except OSError:
                break
            parent = os.path.dirname(parent)


def save(
    directory: str,
    name: str,
    value: Any,
    *,
    kind: str | None = None,
    append: bool = False,
    chunks: Sequence[int] | int | None = None,
    dims: Sequence[str] | None = None,
    index: str | None = None,
    units: str | Mapping[str, str] | None = None,
    description: str | None = None,
    compression: str | None = None,
    run: str | None = None,
) -> Written:
    """Save result ``name`` into the record at ``directory``.

    The data is written first, the manifest last. ``run`` is the run-record
    writing it: the first save of a run starts the manifest afresh (the
    results of an earlier run are removed) and marks it incomplete. Returns
    what was written and removed, for the caller to publish (``updated_at``,
    a remote home) in order.
    """
    check_name(name)
    kind = kind or infer_kind(value)
    if kind not in KINDS:
        raise ResultError(f"Unknown result kind '{kind}' (one of {', '.join(KINDS)})")
    manifest: dict[str, Any] = read_manifest(directory) or {
        "version": RESULTS_VERSION,
        "complete": run is None,
        "results": {},
    }
    written = Written()
    stale: list[dict] = []
    if run is not None and manifest.get("run") != run:
        # a new run's results replace the last run's, as its files do
        stale = list(manifest["results"].values())
        manifest = {"version": RESULTS_VERSION, "complete": False, "results": {}}
    if run is not None:
        manifest["run"] = run
        manifest["complete"] = False
    previous = manifest["results"].get(name)
    if append and previous is not None and previous.get("kind") != kind:
        raise ResultError(
            f"Cannot append a {kind} to result '{name}', a {previous.get('kind')}"
        )
    if append and previous is not None and kind == "json":
        raise ResultError("json results are replaced, not appended to")
    if append and previous is not None:
        entry = _append(directory, previous, value, written)
    else:
        entry = _write_new(
            directory,
            name,
            kind,
            value,
            written,
            chunks=chunks,
            dims=dims,
            index=index,
            compression=compression,
            append=append,
        )
        if previous is not None:
            stale.append(previous)
    if description is not None:
        entry["description"] = description
    elif previous is not None and "description" in previous:
        entry["description"] = previous["description"]
    if units is not None:
        if isinstance(units, Mapping):
            if kind != "table":
                raise ResultError("Units by column are for tables")
            for column in entry["columns"]:
                if column["name"] in units:
                    column["units"] = str(units[column["name"]])
        else:
            entry["units"] = str(units)
    elif previous is not None and "units" in previous:
        entry["units"] = previous["units"]
    manifest["results"][name] = entry
    write_manifest(directory, manifest)
    written.files.append(RESULTS_FILENAME)
    keep = set(written.files)
    for old in stale:
        names = [n for n in _files_of(directory, old) if n not in keep]
        _remove(directory, names)
        written.removed += names
    return written


def set_complete(directory: str, complete: bool = True) -> bool:
    """Set the manifest's ``complete``; whether it changed."""
    manifest = read_manifest(directory)
    if manifest is None or manifest.get("complete") is complete:
        return False
    manifest["complete"] = complete
    write_manifest(directory, manifest)
    return True


def _random_token() -> str:
    return random_str(8)


# what makes a result's file name fresh (the corpus pins it)
_token: Callable[[], str] = _random_token


def _fresh_file(name: str, extension: str) -> str:
    # a replaced result is written under a new name, so a reader's cached
    # chunks of the old one are never mistaken for the new one's
    return f"{RESULTS_DIRECTORY}/{name}.{_token()}.{extension}"


def _write_new(
    directory: str,
    name: str,
    kind: str,
    value: Any,
    written: Written,
    *,
    chunks: Sequence[int] | int | None,
    dims: Sequence[str] | None,
    index: str | None,
    compression: str | None,
    append: bool = False,
) -> dict:
    if kind == "json":
        file = _fresh_file(name, "json")
        _write_bytes(os.path.join(directory, *file.split("/")), _json_bytes(value))
        written.files.append(file)
        return {"kind": "json", "file": file}
    numpy = _numpy()
    file = _fresh_file(name, "zarr")
    if isinstance(chunks, int):
        chunks = [chunks]
    if kind == "array":
        array = numpy.asarray(value)
        if array.ndim == 0:
            raise ResultError("A 0-d array is a json result")
        dtype = _dtype_name(array, f"Result '{name}'")
        if dtype == STRING_DTYPE:
            raise ResultError("Arrays hold numbers or booleans; strings go in tables")
        shape = list(array.shape)
        chunk_shape = (
            list(chunks)
            if chunks is not None
            else _default_chunks(shape, array.dtype.itemsize, append)
        )
        if len(chunk_shape) == 1 and len(shape) > 1:
            chunk_shape = [chunk_shape[0], *shape[1:]]
        if len(chunk_shape) != len(shape) or any(c < 1 for c in chunk_shape):
            raise ResultError(f"Chunks {chunk_shape} do not fit shape {shape}")
        if dims is not None and len(dims) != len(shape):
            raise ResultError(f"{len(dims)} dims for a {len(shape)}-d array")
        target = ZarrArray(directory, file)
        meta = array_metadata(
            shape, dtype, chunk_shape, dims=dims, compression=compression
        )
        target._meta = meta
        written.files += target.write(array, 0)
        written.files.append(target.write_meta(meta))
        entry: dict[str, Any] = {
            "kind": "array",
            "file": file,
            "dtype": dtype,
            "shape": shape,
            "chunks": chunk_shape,
        }
        if dims is not None:
            entry["dims"] = list(dims)
        return entry
    if kind == "table":
        columns = _columns(value)
        rows = len(next(iter(columns.values())))
        k = int(chunks[0]) if chunks is not None else _default_rows(rows, append)
        described = []
        for column_name, column in columns.items():
            dtype = _dtype_name(column, f"Column '{column_name}'")
            target = ZarrArray(directory, f"{file}/{column_name}")
            meta = array_metadata([rows], dtype, [k], compression=compression)
            target._meta = meta
            written.files += target.write(column, 0)
            written.files.append(target.write_meta(meta))
            described.append({"name": column_name, "dtype": dtype})
        written.files.append(_write_group(directory, file, {"columns": list(columns)}))
        return {"kind": "table", "file": file, "rows": rows, "columns": described}
    if kind == "ragged":
        items = [numpy.asarray(v) for v in value]
        if any(v.ndim != 1 for v in items):
            raise ResultError("A ragged result's items are one-dimensional")
        typed = [v for v in items if v.size] or items[:1]
        dtypes = {_dtype_name(v, f"Result '{name}'") for v in typed} or {"float64"}
        if len(dtypes) > 1:
            raise ResultError(f"Items of different data types: {sorted(dtypes)}")
        dtype = dtypes.pop()
        if dtype == STRING_DTYPE:
            raise ResultError("Ragged results hold numbers or booleans")
        values = (
            numpy.concatenate([v.astype(dtype) for v in items])
            if items
            else numpy.zeros(0, dtype=dtype)
        )
        offsets = numpy.zeros(len(items) + 1, dtype="int64")
        offsets[1:] = numpy.cumsum([len(v) for v in items])
        for part, data, part_dtype in (
            ("values", values, dtype),
            ("offsets", offsets, "int64"),
        ):
            k = (
                int(chunks[0])
                if chunks is not None
                else _default_rows(len(data), append)
            )
            target = ZarrArray(directory, f"{file}/{part}")
            meta = array_metadata([len(data)], part_dtype, [k], compression=compression)
            target._meta = meta
            written.files += target.write(data, 0)
            written.files.append(target.write_meta(meta))
        written.files.append(_write_group(directory, file, {}))
        entry = {
            "kind": "ragged",
            "file": file,
            "dtype": dtype,
            "items": len(items),
            "length": int(offsets[-1]),
        }
        if index is not None:
            entry["index"] = index
        return entry
    raise ResultError(f"Unknown result kind '{kind}'")


def _append_rows(target: ZarrArray, old: int, data: np.ndarray, written: Written):
    """Append ``data`` after row ``old``: the partial last chunk is rewritten."""
    numpy = _numpy()
    meta = dict(target.meta)
    k = _chunk_shape(meta)[0]
    start = (old // k) * k
    if start < old:
        data = numpy.concatenate([target.read(start, old), data])
    meta["shape"] = [start + len(data), *meta["shape"][1:]]
    target._meta = meta
    written.files += target.write(data, start)
    written.files.append(target.write_meta(meta))


def _append(directory: str, entry: dict, value: Any, written: Written) -> dict:
    numpy = _numpy()
    entry = json.loads(json.dumps(entry))
    file = entry["file"]
    kind = entry["kind"]
    if kind == "array":
        array = numpy.asarray(value)
        if list(array.shape[1:]) != entry["shape"][1:]:
            raise ResultError(
                f"Appending items of shape {list(array.shape[1:])} to an array of"
                f" items {entry['shape'][1:]}"
            )
        target = ZarrArray(directory, file)
        _append_rows(target, entry["shape"][0], array.astype(entry["dtype"]), written)
        entry["shape"][0] += len(array)
        return entry
    if kind == "table":
        columns = _columns(value)
        names = [c["name"] for c in entry["columns"]]
        if list(columns) != names:
            raise ResultError(
                f"Appending columns {list(columns)} to a table of {names}"
            )
        for column in entry["columns"]:
            data = columns[column["name"]]
            if column["dtype"] != STRING_DTYPE:
                data = data.astype(column["dtype"])
            target = ZarrArray(directory, f"{file}/{column['name']}")
            _append_rows(target, entry["rows"], data, written)
        entry["rows"] += len(next(iter(columns.values())))
        return entry
    if kind == "ragged":
        items = [numpy.asarray(v).astype(entry["dtype"]) for v in value]
        values = (
            numpy.concatenate(items) if items else numpy.zeros(0, dtype=entry["dtype"])
        )
        offsets = entry["length"] + numpy.cumsum([len(v) for v in items], dtype="int64")
        _append_rows(
            ZarrArray(directory, f"{file}/values"), entry["length"], values, written
        )
        _append_rows(
            ZarrArray(directory, f"{file}/offsets"),
            entry["items"] + 1,
            offsets.astype("int64"),
            written,
        )
        entry["items"] += len(items)
        entry["length"] += len(values)
        return entry
    raise ResultError(f"Cannot append to a {kind} result")


# -- reading ------------------------------------------------------------------------


class ResultArray:
    """An array result, read lazily: ``a[i]`` reads the chunks of item ``i`` only."""

    def __init__(self, directory: str, entry: dict, fetch: Fetch | None = None):
        self.entry = entry
        self._array = ZarrArray(directory, entry["file"], fetch=fetch)

    @property
    def shape(self) -> tuple[int, ...]:
        """The shape the manifest declares (the rows written so far, live)."""
        return tuple(self.entry["shape"])

    @property
    def dtype(self):
        """The numpy data type."""
        return _numpy().dtype(self.entry["dtype"])

    @property
    def dims(self) -> list[str] | None:
        """The dimension names, when declared."""
        return self.entry.get("dims")

    def __len__(self) -> int:
        return self.shape[0]

    def __getitem__(self, key: Any) -> np.ndarray:
        rest: tuple = ()
        if isinstance(key, tuple):
            key, rest = key[0], key[1:]
        n = self.shape[0]
        if isinstance(key, slice):
            start, stop, step = key.indices(n)
            if step == 1:
                data = self._read(start, max(start, stop))
            else:
                data = self._read(0, n)[key]
        else:
            i = int(key)
            if i < 0:
                i += n
            if not 0 <= i < n:
                raise IndexError(f"item {key} out of range ({n} items)")
            data = self._read(i, i + 1)[0]
        return data[rest] if rest else data

    def _read(self, start: int, stop: int) -> np.ndarray:
        return self._array.read(start, stop).astype(self.dtype, copy=False)

    def item(self, i: int) -> np.ndarray:
        """Item ``i`` (an index along the first axis)."""
        return self[i]

    def read(self) -> np.ndarray:
        """The whole array."""
        return self._read(0, self.shape[0])

    def __array__(self, dtype=None, copy=None):
        data = self.read()
        return data if dtype is None else data.astype(dtype)

    def __repr__(self) -> str:
        return f"ResultArray(shape={self.shape}, dtype={self.entry['dtype']})"


class ResultRagged:
    """A ragged result, read lazily: ``r[i]`` reads item ``i``'s chunks only."""

    def __init__(self, directory: str, entry: dict, fetch: Fetch | None = None):
        self.entry = entry
        self._values = ZarrArray(directory, f"{entry['file']}/values", fetch=fetch)
        self._offsets = ZarrArray(directory, f"{entry['file']}/offsets", fetch=fetch)

    @property
    def dtype(self):
        """The numpy data type of the values."""
        return _numpy().dtype(self.entry["dtype"])

    def __len__(self) -> int:
        return int(self.entry["items"])

    def offsets(self, start: int = 0, stop: int | None = None) -> np.ndarray:
        """``offsets[start:stop + 1]``: where items ``start`` to ``stop`` begin, end."""
        stop = len(self) if stop is None else stop
        return self._offsets.read(start, stop + 1).astype("int64", copy=False)

    def __getitem__(self, key: Any) -> Any:
        n = len(self)
        if isinstance(key, slice):
            start, stop, step = key.indices(n)
            return [self[i] for i in range(start, stop, step)]
        i = int(key)
        if i < 0:
            i += n
        if not 0 <= i < n:
            raise IndexError(f"item {key} out of range ({n} items)")
        low, high = (int(v) for v in self.offsets(i, i + 1))
        return self._values.read(low, high).astype(self.dtype, copy=False)

    def __iter__(self) -> Iterator[np.ndarray]:
        offsets = self.offsets()
        values = self._values.read(0, int(offsets[-1])).astype(self.dtype, copy=False)
        for i in range(len(self)):
            yield values[offsets[i] : offsets[i + 1]]

    def item(self, i: int) -> np.ndarray:
        """Item ``i``."""
        return self[i]

    def read(self) -> list[np.ndarray]:
        """Every item."""
        return list(self)

    def __repr__(self) -> str:
        return f"ResultRagged(items={len(self)}, dtype={self.entry['dtype']})"


def read_table(
    directory: str,
    entry: dict,
    fetch: Fetch | None = None,
    start: int = 0,
    stop: int | None = None,
) -> dict[str, np.ndarray]:
    """A table's columns (rows ``[start, stop)``), in order."""
    rows = int(entry["rows"])
    stop = rows if stop is None else max(start, min(stop, rows))
    columns = {}
    for column in entry["columns"]:
        array = ZarrArray(directory, f"{entry['file']}/{column['name']}", fetch=fetch)
        data = array.read(start, stop)
        columns[column["name"]] = (
            data if column["dtype"] == STRING_DTYPE else data.astype(column["dtype"])
        )
    return columns


def read_json(directory: str, entry: dict, fetch: Fetch | None = None) -> Any:
    """A json result's value."""
    file = entry["file"]
    path = os.path.join(directory, *file.split("/"))
    if fetch is not None and not os.path.isfile(path):
        fetch([file])
    try:
        with open(path, "rb") as f:
            return json.loads(f.read().decode("utf-8"))
    except FileNotFoundError as ex:
        raise ResultError(
            f"'{file}' is not there (the result was replaced since its manifest"
            " was read; read it again)"
        ) from ex


def read(directory: str, entry: dict, fetch: Fetch | None = None) -> Any:
    """The value of a result: lazily for arrays and ragged results."""
    kind = entry.get("kind")
    if kind == "json":
        return read_json(directory, entry, fetch)
    if kind == "table":
        return read_table(directory, entry, fetch)
    if kind == "array":
        return ResultArray(directory, entry, fetch)
    if kind == "ragged":
        return ResultRagged(directory, entry, fetch)
    raise ResultError(f"Unknown result kind {kind!r}")


def to_json(value: Any) -> Any:
    """A value as JSON: arrays as nested lists, NaN and infinities as null."""
    if isinstance(value, ResultArray | ResultRagged):
        value = value.read()
    if type(value).__module__ == "numpy":
        if hasattr(value, "tolist"):
            value = value.tolist()
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if isinstance(value, Mapping):
        return {str(k): to_json(v) for k, v in value.items()}
    if isinstance(value, list | tuple):
        return [to_json(v) for v in value]
    return value


# -- the catalog and caching readers ------------------------------------------------


def data_files(manifest: dict | None) -> list[str]:
    """Folders of the results read on demand (tables, arrays, ragged)."""
    if not manifest:
        return []
    return [
        str(e["file"]).strip("/")
        for e in manifest.get("results", {}).values()
        if isinstance(e, dict) and e.get("kind") != "json" and e.get("file")
    ]


def is_data_file(name: str, folders: list[str]) -> bool:
    """Whether record file ``name`` belongs to one of ``folders``."""
    return any(name.startswith(folder + "/") for folder in folders)


def _lengths(entry: dict) -> dict[str, int]:
    """The rows of each array of a result entry, by its folder."""
    file = entry["file"]
    kind = entry.get("kind")
    if kind == "array":
        return {file: int(entry["shape"][0])}
    if kind == "table":
        return {f"{file}/{c['name']}": int(entry["rows"]) for c in entry["columns"]}
    if kind == "ragged":
        return {
            f"{file}/values": int(entry["length"]),
            f"{file}/offsets": int(entry["items"]) + 1,
        }
    return {}


def stale_files(directory: str, old: dict | None, new: dict | None) -> list[str]:
    """Files of a working copy that a newer manifest makes stale.

    For a caching reader: the files of a result no longer in the manifest (or
    written anew, under another ``file``) and, of a result appended to since,
    each array's ``zarr.json`` and the chunks reaching past its earlier
    length. Chunks wholly within the earlier length never change.
    """
    if not old:
        return []
    current = {
        e.get("file"): e
        for e in (new or {}).get("results", {}).values()
        if isinstance(e, dict)
    }
    stale: list[str] = []
    for entry in old.get("results", {}).values():
        if not isinstance(entry, dict) or not entry.get("file"):
            continue
        files = _files_of(directory, entry)
        now = current.get(entry["file"])
        if now is None or now.get("kind") != entry.get("kind"):
            stale += files
            continue
        if now == entry:
            continue
        lengths = _lengths(entry)
        for name in files:
            folder, _, rest = name.rpartition("/")
            if rest == ZARR_JSON:
                stale.append(name)
                continue
            array = next((a for a in lengths if name.startswith(a + "/")), None)
            if array is None:
                stale.append(name)
                continue
            meta = _read_json_file(
                os.path.join(directory, *array.split("/"), ZARR_JSON)
            )
            try:
                k = _chunk_shape(meta)[0] if isinstance(meta, dict) else 0
                key = name[len(array) + 1 :]
                first = int(re.split(r"[/.]", key)[1 if key.startswith("c") else 0])
            except (KeyError, ValueError, IndexError, ResultError):
                stale.append(name)
                continue
            if not k or (first + 1) * k > lengths[array]:
                stale.append(name)
    return stale


# -- the @result decorator ----------------------------------------------------------

_RESULT_ATTRIBUTE = "__machinable_result__"


def result(
    method: Callable | None = None, *, name: str | None = None, **options: Any
) -> Any:
    """Declare a method's value a result, saved when the run ends.

    The method takes no arguments besides ``self``. At the end of a run that
    succeeded, its value is saved under ``name`` (the method's name by
    default) with ``options`` (those of :meth:`Interface.save_result`). Called
    afterwards, the method returns the saved result, read from the record,
    and computes only when there is none::

        class Sort(Interface):
            @result
            def units(self):
                return {"unit_id": ids, "snr": snr}
    """

    def decorate(fn: Callable) -> Callable:
        method_name = getattr(fn, "__name__", "")
        parameters = list(inspect.signature(fn).parameters.values())
        if len(parameters) != 1:
            raise TypeError(
                f"@result methods take no arguments besides self ('{method_name}'"
                " takes more); a query with arguments stays a result method"
            )
        key = check_name(name or method_name)

        @functools.wraps(fn)
        def wrapper(self: Interface) -> Any:
            from machinable.interface import _IN_RUN

            if (
                self.is_mounted()
                and self.uuid not in _IN_RUN.get()
                and key in (self.results_manifest() or {}).get("results", {})
            ):
                return self.result(key)
            return fn(self)

        setattr(wrapper, _RESULT_ATTRIBUTE, (key, options, fn))
        return wrapper

    return decorate(method) if method is not None else decorate


def declared_results(interface: Interface) -> list[tuple[str, dict, Callable]]:
    """The ``@result`` methods of an interface's class: (name, options, function)."""
    found: dict[str, tuple[str, dict, Callable]] = {}
    for cls in reversed(type(interface).__mro__):
        for attribute, member in vars(cls).items():
            declared = getattr(member, _RESULT_ATTRIBUTE, None)
            if declared is not None:
                found[attribute] = declared
            elif attribute in found:
                del found[attribute]
    return list(found.values())
