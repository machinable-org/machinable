"""Shared utilities: serialization, hashing, file I/O, and path safety."""

import contextlib
import hashlib
import importlib
import importlib.util
import inspect
import json
import os
import random
import re
import stat
import string
import subprocess
import sys
import threading
import tokenize
import types
from collections import deque
from collections.abc import Callable, Mapping
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from keyword import iskeyword
from pathlib import Path
from types import ModuleType
from typing import Any, Optional, Self
from uuid import UUID

import arrow
import dill as pickle
import omegaconf
from flatten_dict import unflatten as _unflatten_dict
from omegaconf.omegaconf import OmegaConf
from pydantic import BaseModel

from machinable.types import DatetimeType, VersionType

sentinel: Any = object()


def serialize(obj):
    """JSON serializer for objects not serializable by default json code."""
    if isinstance(obj, BaseModel):
        return obj.model_dump()
    if isinstance(obj, UUID):
        return obj.hex
    if isinstance(obj, DatetimeType):
        return str(obj)
    if isinstance(obj, omegaconf.DictConfig | omegaconf.ListConfig):
        return OmegaConf.to_container(obj)
    else:
        raise TypeError(f"Unserializable object {obj} of type {type(obj)}")


def normjson(data: Any, default: Callable[[Any], Any] | None = serialize) -> str:
    """Canonical JSON: sorted keys, compact separators."""
    return json.dumps(data, sort_keys=True, separators=(",", ":"), default=default)


def generate_seed(random_state=None):
    """Generates a seed from a random state.

    # Arguments
    random_state: Random state or None

    Returns:
    int32 seed value

    """
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    return random_state.randint(0, 2**31 - 1)


def timestamp_to_directory(timestamp: int) -> str:
    """Render an epoch-nanosecond timestamp as a directory name."""
    return arrow.get(timestamp / 1e9).strftime("%Y-%m-%dT%H%M%S_%f%z").replace("+", "_")


def is_valid_variable_name(name):
    """True for a valid, non-keyword Python identifier."""
    if not isinstance(name, str):
        return False
    return name.isidentifier() and not iskeyword(name)


def is_valid_module_path(name):
    """True when every dotted segment is a valid identifier."""
    return all(map(is_valid_variable_name, name.split(".")))


def is_directory_version(version: VersionType) -> bool:
    """True when ``version`` denotes a directory rather than a ~method."""
    if not isinstance(version, str):
        return False
    if not version.startswith("~"):
        return True
    if "/" in version or "\\" in version or version == "~":
        return True

    return False


def joinpath(filepath: str | list[str]) -> str:
    # Always join with "/" (not os.sep): the result is a relative storage/attribute key
    # that must be stable across OSes and match when looked up. Forward slashes are
    # accepted as path separators by os.path on every platform, incl. Windows.
    """Join path segments with ``/`` (an OS-stable storage key)."""
    if isinstance(filepath, str):
        return filepath

    return "/".join(str(p) for p in filepath if p is not None)


def random_str(length: int, random_state=None):
    """Random alphanumeric string of the given length."""
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    return "".join(
        random_state.choice(
            string.ascii_uppercase + string.ascii_lowercase + string.digits
        )
        for _ in range(length)
    )


_FILENAME_UNSAFE_RE = re.compile(r"[^a-zA-Z0-9._-]+")


def sanitize_filename(value: str, max_len: int = 64) -> str:
    """Make a string safe for use as a single path segment."""
    cleaned = _FILENAME_UNSAFE_RE.sub("_", value.strip())
    if not cleaned:
        cleaned = "x"
    return cleaned[:max_len]


MACHINABLE_MARKER = ".machinable"

# storage URI schemes that resolve directly to a local filesystem path
_LOCAL_URI_SCHEMES = ("file://", "scratch://")


def uri_to_path(uri: str) -> str:
    """Resolve a *local* storage URI to an absolute path.

    Handles ``file://`` and ``scratch://`` (relocated working copies). Remote
    schemes such as ``s3://`` cannot be resolved to a local path and must be
    pulled by their Storage provider first; passing one raises ``ValueError``.
    """
    for scheme in _LOCAL_URI_SCHEMES:
        if uri.startswith(scheme):
            return uri[len(scheme) :]
    if "://" in uri:
        raise ValueError(f"Cannot resolve remote storage URI to a local path: {uri}")
    return os.path.abspath(uri)


def path_to_uri(path: str) -> str:
    """Wrap a local filesystem path as a ``file://`` storage URI."""
    return "file://" + os.path.abspath(os.path.expanduser(path))


def is_machinable_directory(path: str) -> bool:
    """A directory is a valid interface iff it holds a ``.machinable`` marker."""
    return os.path.isfile(os.path.join(path, MACHINABLE_MARKER))


def walk_markers(root: str):
    """Yield every record directory at or below ``root``.

    A record directory holds a ``.machinable`` marker; nested markers (e.g.
    executions under an interface) are included.

    Symlinks are not followed, avoiding cycles through ``related/`` links.
    """
    root = os.path.expanduser(root)
    if not os.path.isdir(root):
        return
    for dirpath, _dirnames, filenames in os.walk(root, followlinks=False):
        if MACHINABLE_MARKER in filenames:
            yield dirpath


def object_hash(payload: Any, default: Callable[[Any], Any] | None = serialize) -> str:
    """sha256 over the canonical JSON of ``payload``."""
    json_str = normjson(payload, default=default)
    hash_obj = hashlib.sha256(json_str.encode())
    return hash_obj.hexdigest()


def file_hash(filepath: str):
    """Short blake2b digest of a file's contents."""
    hash_obj = hashlib.blake2b()
    with open(str(filepath), "rb") as file:
        while chunk := file.read(8192):
            hash_obj.update(chunk)
    return hash_obj.hexdigest()[:12]


def id_from_uuid(uuid: str) -> str:
    """The 6-character short id for a record id."""
    if len(uuid) == 6 and "-" not in uuid:
        return uuid
    if len(uuid) >= 18:
        return uuid[11:13] + uuid[14:18]
    return uuid


# These words are picked under two objectives:
#  (i) complex enough to make them memorizable
#  (ii) pronunciation should not pose uneccessary challenges
# Contributions of additions/modifications welcome!
_WORDS = {
    "tree": (
        "willow",
        "ivy",
        "lime",
        "tilia",
        "mapel",
        "oak",
        "elder",
        "cherry",
        "dogwood",
        "elm",
        "ash",
        "blackthorn",
        "fir",
        "crabapple",
        "beech",
        "birch",
        "salix",
        "juniper",
    ),
    "color": (
        "peridot",
        "tomato",
        "keppel",
        "melon",
        "pale",
        "zomp",
        "pastel",
        "lavender",
        "lapis",
        "ecru",
        "eggshell",
        "colbalt",
        "cerulean",
        "aero",
        "alabaster",
        "blush",
        "citrine",
        "chocolate",
        "coffee",
        "falu",
        "flax",
        "jet",
    ),
    "animal": (
        "albatross",
        "chinchilla",
        "alligator",
        "butterfly",
        "flamingo",
        "giraffe",
        "jellyfish",
        "mosquito",
        "raccoon",
        "weasel",
        "zebra",
        "hedgehog",
    ),
}


def generate_nickname(categories=None, glue="_"):
    """Generate a random nickname by chaining words from categories.

    # Arguments
    categories: List of categories, available: 'animal', 'tree', 'color'.
                Can be nested. Defaults to ('color', ('animal', 'tree'))
    """
    if categories is None:
        categories = ("color", ("animal", "tree"))
    if isinstance(categories, str):
        categories = [categories]
    if not isinstance(categories, list | tuple):
        raise ValueError("Categories has to be a list of tuple")

    picks = []
    for category in categories:
        if isinstance(category, list | tuple):
            category = random.choice(category)
        if category not in _WORDS:
            raise KeyError(f"Invalid category: {category}")
        picks.append(random.choice(_WORDS[category]))
    return glue.join(picks)


def load_file(
    filepath: str | list[str],
    default: Any = sentinel,
    opener=open,
    **opener_kwargs,
) -> Any:
    """Loads a data object from file.

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle); all other will be
        loaded as plain text (e.g. .txt|.log|.diff|.sh)
    default: Optional default if reading fails
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener
    """
    filepath = joinpath(filepath)
    _, ext = os.path.splitext(filepath)
    mode = opener_kwargs.pop("mode", "r")
    # the directory format is UTF-8; never the locale default (cp1252 on
    # Windows would mangle/reject non-Latin-1 content)
    if ext not in (".p", ".npy") and "b" not in mode and opener is open:
        opener_kwargs.setdefault("encoding", "utf-8")
    try:
        if ext == ".p":
            if "b" not in mode:
                mode = mode + "b"
            with opener(filepath, mode, **opener_kwargs) as f:
                data = pickle.load(f)
        elif ext == ".json":
            with opener(filepath, mode, **opener_kwargs) as f:
                data = json.load(f)
        elif ext == ".jsonl":
            with opener(filepath, mode, **opener_kwargs) as f:
                return [json.loads(line) for line in f if line.strip()]
        elif ext == ".npy":
            import numpy as np

            if "b" not in mode:
                mode = mode + "b"
            with opener(filepath, mode, **opener_kwargs) as f:
                data = np.load(f, allow_pickle=True)
        else:
            with opener(filepath, mode, **opener_kwargs) as f:
                data = f.read()
        return data
    except (FileNotFoundError, Exception) as _ex:
        if default is not sentinel:
            return default
        raise _ex


def save_file(
    filepath: str | list[str],
    data: Any,
    makedirs: bool | Callable = True,
    opener=open,
    **opener_kwargs,
) -> str:
    """Saves a data object to file.

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle); all other will be
        written as plain text (e.g. .txt|.log|.diff|.sh)
    data: The data object
    makedirs: If True or Callable, path will be created
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener

    Returns the absolute path to the written file
    """
    filepath = joinpath(filepath)
    path = os.path.dirname(filepath)
    name = os.path.basename(filepath)
    _, ext = os.path.splitext(name)
    mode = opener_kwargs.pop("mode", "w")
    # the directory format is UTF-8; never the locale default (cp1252 on
    # Windows would mangle/reject non-Latin-1 content)
    if ext not in (".p", ".npy") and "b" not in mode and opener is open:
        opener_kwargs.setdefault("encoding", "utf-8")

    if path != "":
        if makedirs is True:
            os.makedirs(path, exist_ok=True)
        elif callable(makedirs):
            makedirs(path)

    if ext == ".json":
        # json
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(json.dumps(data, ensure_ascii=False, default=serialize))
    elif ext == ".jsonl":
        # jsonlines
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(json.dumps(data, sort_keys=True, default=serialize) + "\n")
    elif ext == ".npy":
        import numpy as np

        if "b" not in mode:
            mode += "b"
        # numpy
        with opener(filepath, mode, **opener_kwargs) as f:
            np.save(f, data)
    elif ext == ".p":
        if "b" not in mode:
            mode += "b"
        with opener(filepath, mode, **opener_kwargs) as f:
            pickle.dump(data, f)
    else:
        # plain-text formats
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(str(data))

    return os.path.abspath(filepath)


def import_from_directory(
    module_name: str, directory: str, or_fail: bool = False
) -> ModuleType | None:
    """Imports a module relative to a given absolute directory."""
    # determine the target .py file path
    file_path = os.path.join(directory, module_name.replace(".", "/"))
    tmp_file = False
    if os.path.isdir(file_path):
        file_path = os.path.join(file_path, "__init__.py")
        # if the __init__.py file does not exists, we temporily create it to emulate
        # the standard Python 3 import behaviour
        try:
            Path(file_path).touch(exist_ok=False)
            tmp_file = True
        except FileExistsError:
            pass
    else:
        file_path += ".py"

    try:
        spec = importlib.util.spec_from_file_location(module_name, file_path)
        if spec is None or spec.loader is None:
            raise FileNotFoundError(file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        sys.modules[module_name] = module
        return module
    except FileNotFoundError as _e:
        if or_fail:
            raise ModuleNotFoundError(f"No module named '{module_name}'") from _e
    finally:
        if tmp_file:
            os.remove(file_path)

    return None


def find_subclass_in_module(
    module: types.ModuleType | None,
    base_class: Any,
    default: Any | None = None,
) -> Any:
    """The first subclass of ``base_class`` defined in ``module``."""
    if module is not None:
        candidates = inspect.getmembers(
            module,
            lambda x: bool(
                # is class of given type that is defined in the target module
                inspect.isclass(x)
                and issubclass(x, base_class)
                and x.__module__ == module.__name__
            ),
        )
        if len(candidates) > 0:
            return candidates[0][1]

    return default


def update_dict(
    d: dict | None, update: Mapping | str | None = None, copy: bool = False
) -> dict:
    """Deep-merge ``update`` into ``d`` (in place unless ``copy``)."""
    if d is None:
        d = {}
    if not isinstance(d, dict):
        raise ValueError(f"Expected mapping but found {type(d).__name__}: {d}")
    if copy:
        d = d.copy()
    if not update:
        return d
    if not isinstance(update, Mapping):
        if isinstance(update, str):
            raise ValueError(f"Invalid version {update}. Did you forget the ~-prefix?")
        else:
            raise ValueError(
                f"Expected update mapping but found {type(update).__name__}: {update}"
            )
    for k, val in update.items():
        if isinstance(val, Mapping):
            d[k] = update_dict(d.get(k, {}), val, copy=copy)
        else:
            d[k] = val
    return d


def norm_version_call(version: str):
    """Normalize the spelling of a ``~method(args)`` version call."""
    code = version.replace("~", "").strip()
    tokens = tokenize.tokenize(BytesIO(code.encode("utf-8")).readline)
    normalized_tokens = []

    last_token_type = None
    for toknum, tokval, _, _, _ in tokens:
        if toknum in [
            tokenize.ENCODING,
            tokenize.ENDMARKER,
            tokenize.NEWLINE,
            tokenize.NL,
        ]:
            # skip encoding, endmarker, newlines
            continue
        if toknum == tokenize.STRING:
            # string literals are preserved
            normalized_tokens.append(tokval)
        elif toknum == tokenize.OP:
            # remove spaces before and after operators
            if tokval == "=" and normalized_tokens and normalized_tokens[-1] == " ":
                normalized_tokens.pop()
            normalized_tokens.append(tokval)
        elif toknum in [tokenize.NAME, tokenize.NUMBER]:
            if last_token_type not in [
                None,
                tokenize.OP,
                tokenize.NL,
                tokenize.NEWLINE,
            ] and not (
                last_token_type == tokenize.OP and normalized_tokens[-1] in ["(", ","]
            ):
                normalized_tokens.append(" ")
            normalized_tokens.append(tokval)
        last_token_type = toknum

    if "~" in version:
        normalized_tokens = ["~"] + normalized_tokens

    normalized_code = "".join(normalized_tokens)
    normalized_code = (
        normalized_code.replace(" (", "(")
        .replace("( ", "(")
        .replace(" )", ")")
        .replace(", ", ",")
        .replace(" ,", ",")
    )
    return normalized_code


def dot_splitter(flat_key):
    """Split a flat key on dots (for ``unflatten_dict``)."""
    if not isinstance(flat_key, str):
        raise ValueError(
            f"Expected string but found {type(flat_key).__name__}: {flat_key}"
        )
    return tuple(flat_key.split("."))


def unflatten_dict(
    d: Any,
    splitter: str | Callable = dot_splitter,
    inverse: bool = False,
    recursive: bool = True,
    copy: bool = True,
) -> Any:
    """Recursively unflatten a dict-like object.

    # Arguments
    d: The dict-like to unflatten
    splitter: The key splitting method
        If a Callable is given, the Callable will be used to split `d`.
        'tuple': Use each element in the tuple key as the key of the unflattened dict.
        'path': Use `pathlib.Path.parts` to split keys.
        'underscore': Use underscores to split keys.
        'dot': Use underscores to split keys.
    inverse: If True, inverts the key and value before flattening
    recursive: Perform unflatting recursively
    copy: Creates copies to leave d unmodified
    """
    if recursive is False:
        return _unflatten_dict(d=d, splitter=splitter, inverse=inverse)

    if isinstance(d, list):
        return [unflatten_dict(v, splitter, inverse, recursive, copy) for v in d]

    if isinstance(d, tuple):
        return (unflatten_dict(v, splitter, inverse, recursive, copy) for v in d)

    if isinstance(d, Mapping):
        if copy:
            d = d.copy()
        flat = _unflatten_dict(d=d, splitter=splitter, inverse=inverse)
        for k, nested in flat.items():
            flat[k] = unflatten_dict(nested, splitter, inverse, recursive, copy)
        return flat

    return d


class _OutputRouter:
    """A ``sys.stdout``/``sys.stderr`` proxy that tees writes per thread.

    The process-wide stream is replaced once; every write passes through to
    the original, and additionally appends to the log file registered for the
    *current thread*. Unregistered threads (the server's request handlers,
    other concurrent runs) are pure pass-through, so parallel in-process
    dispatches never interleave into each other's logs.
    """

    def __init__(self, original):
        self._original = original
        self._routes: dict[int, list] = {}

    def push(self, handle) -> None:
        self._routes.setdefault(threading.get_ident(), []).append(handle)

    def pop(self) -> None:
        stack = self._routes.get(threading.get_ident())
        if stack:
            stack.pop()
        if not stack:
            self._routes.pop(threading.get_ident(), None)

    @property
    def routed(self) -> bool:
        return bool(self._routes)

    def write(self, data: str) -> int:
        stack = self._routes.get(threading.get_ident())
        if stack:
            try:
                stack[-1].write(data)
                stack[-1].flush()
            except (OSError, ValueError):
                pass  # a closed/broken log never breaks the run's own output
        return self._original.write(data)

    def flush(self) -> None:
        self._original.flush()

    def __getattr__(self, name):
        return getattr(self._original, name)


class _LazyLogFile:
    """Opens the log on first write, so a silent run creates no file."""

    def __init__(self, path: str):
        self._path = path
        self._handle = None

    def write(self, data: str) -> None:
        if self._handle is None:
            os.makedirs(os.path.dirname(self._path) or ".", exist_ok=True)
            self._handle = open(  # noqa: SIM115 - lifetime managed by tee_output
                self._path, "a", encoding="utf-8", errors="replace"
            )
        self._handle.write(data)

    def flush(self) -> None:
        if self._handle is not None:
            self._handle.flush()

    def close(self) -> None:
        if self._handle is not None:
            self._handle.close()


class tee_output:
    """Context manager: mirror the current thread's stdout+stderr to ``path``.

    Installs the per-thread router over ``sys.stdout``/``sys.stderr`` on first
    use (left in place afterwards; it is pass-through when nothing is routed).
    The file opens lazily on the first write (a silent run creates no log) and
    appends, so a resumed run continues its log. Nested tees stack (the
    innermost wins for its thread).
    """

    def __init__(self, path: str):
        self._path = path
        self._handle: _LazyLogFile | None = None

    def __enter__(self) -> "tee_output":
        for stream in ("stdout", "stderr"):
            current = getattr(sys, stream)
            if not isinstance(current, _OutputRouter):
                setattr(sys, stream, _OutputRouter(current))
        self._handle = _LazyLogFile(self._path)
        for stream in ("stdout", "stderr"):
            router = getattr(sys, stream)
            if isinstance(router, _OutputRouter):
                router.push(self._handle)
        return self

    def __exit__(self, *args) -> None:
        if self._handle is None:
            return
        for stream in ("stdout", "stderr"):
            router = getattr(sys, stream)
            if isinstance(router, _OutputRouter):
                router.pop()
        with contextlib.suppress(OSError):
            self._handle.close()


def read_output_window(
    path: str,
    *,
    offset: int | None = None,
    tail: int | None = None,
    limit: int = 65536,
) -> "tuple[str | None, int, int]":
    """A bounded byte-window of a log file: ``(data, offset, size)``.

    ``offset`` reads forward from a byte position (the incremental-follow
    case); ``tail`` reads the last N bytes; neither reads the last ``limit``
    bytes. At most ``limit`` bytes are returned either way, decoded utf-8 with
    replacement so a window boundary can never split the response. ``data`` is
    ``None`` when the file does not exist (no output yet); ``size`` is the
    file's current total, so clients can poll ``offset=size`` for appends.
    """
    try:
        size = os.path.getsize(path)
    except OSError:
        return None, 0, 0
    if offset is not None:
        start = max(0, min(offset, size))
    else:
        window = min(tail if tail is not None else limit, limit)
        start = max(0, size - window)
    length = min(limit, size - start)
    try:
        with open(path, "rb") as handle:
            handle.seek(start)
            data = handle.read(length)
    except OSError:
        return None, 0, 0
    return data.decode("utf-8", errors="replace"), start, size


def run_and_stream(
    args,
    *,
    stdout_handler: Callable = print,
    stderr_handler: Callable = print,
    check: bool = True,
    text: bool = True,
    env: Mapping | None = None,
    **kwargs,
) -> int:
    """Run a subprocess, streaming stdout/stderr to handlers."""
    if env is None:
        # workaround, see https://stackoverflow.com/a/60070753
        env = os.environ

    with subprocess.Popen(
        args,
        text=text,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        **kwargs,
    ) as process:
        with ThreadPoolExecutor(2) as pool:

            def _st(stream, handler):
                # reduced memory iteration
                deque((handler(line) for line in stream), maxlen=0)

            pool.submit(_st, process.stdout, stdout_handler)
            pool.submit(_st, process.stderr, stderr_handler)
        exit_code = process.wait()
        if check and exit_code:
            raise subprocess.CalledProcessError(exit_code, process.args)
    return exit_code


def chmodx(filepath: str) -> str:
    """Make a file executable."""
    st = os.stat(filepath)
    os.chmod(filepath, st.st_mode | stat.S_IEXEC)
    return filepath


# Directories excluded from source discovery/listing by both the HTTP source API and
# the MCP source tools (`.`-prefixed dirs like .git/.venv are also skipped separately).
_SOURCE_SKIP_DIRS = {"__pycache__", "vendor", "tmp", "storage", "node_modules"}


def skip_source_dir(name: str) -> bool:
    """Whether a directory should be skipped when walking a project's source tree.

    Single source of truth shared by the HTTP and MCP source surfaces.
    """
    return name.startswith(".") or name in _SOURCE_SKIP_DIRS


def file_to_module(rel: str) -> str:
    """Map a project-relative ``.py`` file to its dotted module path.

    ``pkg/mod.py`` -> ``pkg.mod``; ``pkg/__init__.py`` -> ``pkg``.
    """
    norm = rel.replace("\\", "/").strip("/")
    stem = norm[:-3] if norm.endswith(".py") else norm
    parts = [p for p in stem.split("/") if p]
    if parts and parts[-1] == "__init__":
        parts = parts[:-1]
    return ".".join(parts)


def safe_path(base: str, rel: str) -> str:
    """Resolve ``rel`` beneath ``base`` to an absolute, symlink-resolved path.

    Raises ``ValueError`` if ``rel`` is empty/absolute, contains a NUL byte
    or a ``..`` segment, or the resolved target escapes ``base``. The single
    containment check shared by every file-serving surface (HTTP
    source/chunks, MCP source tools), using
    ``realpath`` so a symlink inside the tree cannot point the write/read outside it.
    """
    # reject rooted paths explicitly: os.path.isabs alone is platform-dependent
    # (Windows Python 3.13 treats driveless "/etc/passwd" as relative)
    if (
        not rel
        or "\x00" in rel
        or rel[0] in "/\\"
        or (len(rel) > 1 and rel[1] == ":")
        or os.path.isabs(rel)
    ):
        raise ValueError("Invalid path")
    norm = rel.replace("\\", "/").strip("/")
    if not norm or any(part in ("..", "") for part in norm.split("/")):
        raise ValueError("Invalid path")
    base = os.path.realpath(base)
    target = os.path.realpath(os.path.join(base, norm))
    if target != base and not target.startswith(base + os.sep):
        raise ValueError("Path escapes the base directory")
    return target


def git_cmd(repository: str, *args: str, env: dict | None = None) -> str | None:
    """Run ``git -C <repository> <args…>`` and return stripped stdout.

    Returns ``None`` if git fails or is unavailable. The single low-level git
    wrapper in the codebase (used by :class:`~machinable.manifest.Manifest`).
    """
    try:
        run_env = {**os.environ, **env} if env else None
        return (
            subprocess.check_output(
                ["git", "-C", repository, *args],
                stderr=subprocess.DEVNULL,
                env=run_env,
            )
            .decode()
            .strip()
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


class Jsonable:
    """Serialization trait: ``as_json``/``from_json``/``clone``."""

    def as_json(self, stringify=True, default=serialize, **dumps_kwargs):
        """Serialize to JSON (a string unless ``stringify=False``)."""
        serialized = self.serialize()
        if stringify:
            serialized = json.dumps(serialized, default=default, **dumps_kwargs)
        return serialized

    @classmethod
    def from_json(cls, serialized, **loads_kwargs):
        """Rebuild an instance from JSON."""
        if isinstance(serialized, str):
            serialized = json.loads(serialized, **loads_kwargs)
        return cls.unserialize(serialized)

    def clone(self):
        """A deep copy via JSON round-trip."""
        return self.__class__.from_json(self.as_json())

    def serialize(self) -> dict:
        """The instance as a plain dict (implemented by subclasses)."""
        raise NotImplementedError

    @classmethod
    def unserialize(cls, serialized: dict) -> Any:
        """Rebuild an instance from ``serialize()`` output."""
        raise NotImplementedError


class Connectable:
    """Connectable trait."""

    __connection__: Optional["Connectable"] = None

    @classmethod
    def is_connected(cls) -> bool:
        """True when an instance is currently connected."""
        return cls.__connection__ is not None

    @classmethod
    def get(cls) -> "Connectable":
        """The connected instance, or a fresh one."""
        return cls() if cls.__connection__ is None else cls.__connection__

    def __enter__(self) -> Self:
        self._outer_connection = (  # pylint: disable=attribute-defined-outside-init
            self.__class__.__connection__
        )
        self.__class__.__connection__ = self
        return self

    def __exit__(self, *args, **kwargs) -> Self:
        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        if getattr(self, "_outer_connection", None) is not None:
            self.__class__.__connection__ = self._outer_connection
        return self
