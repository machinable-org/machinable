import types
from types import ModuleType
from typing import Any, Callable, List, Mapping, Optional, Tuple, Union

import importlib
import inspect
import json
import os
import pickle
import random
import re
import string
import sys
from collections import OrderedDict
from keyword import iskeyword
from pathlib import Path

import arrow
import commandlib
import jsonlines
import omegaconf
from baseconv import base62
from flatten_dict import unflatten as _unflatten_dict
from importlib_metadata import entry_points, version
from omegaconf.omegaconf import OmegaConf

sentinel = object()

import json
import threading
from inspect import getattr_static

from machinable.types import DatetimeType
from observable import Observable


class Mixin:
    """
    Allows to dynamically extend object instances

    # Example
    ```yaml
    class Extension:
        def greet(self):
            # write an extension for Example class
            # note that self refers to the instance we are extending
            print(self.hello)

    class Example:
        def __init__(self):
            self.hello = 'hello world'
            # extend dynamically
            self.extension = Mixin(self, Extension, 'extension')

    Example().extension.greet()
    >>> 'hello world'
    ```
    """

    def __init__(
        self, target: Any, mixin_class: Any, attribute: Optional[str] = None
    ):
        self._binding = {
            "controller": target,
            "class": mixin_class,
            "attribute": attribute,
        }

    def __getattr__(self, item):
        # forward dynamically into mix-in class
        attribute = getattr(self._binding["class"], item, None)

        if attribute is None:
            raise AttributeError(
                f"'{self._binding['class'].__name__}' has no attribute '{item}'"
            )

        if isinstance(attribute, property):
            return attribute.fget(self._binding["controller"])

        if not callable(attribute):
            return attribute

        if isinstance(
            getattr_static(self._binding["class"], item), staticmethod
        ):
            return attribute

        # if attribute is non-static method we decorate it to pass in the controller

        def bound_method(*args, **kwargs):
            # bind mixin instance to controller for mixin self reference
            if self._binding["attribute"] is not None:
                self._binding["controller"].__mixin__ = getattr(
                    self._binding["controller"], self._binding["attribute"]
                )
            output = attribute(self._binding["controller"], *args, **kwargs)

            return output

        return bound_method


class Events(Observable):
    def __init__(self) -> None:
        super().__init__()
        self._heartbeat = None

    def trigger(self, event: str, *args: Any, **kw: Any) -> list:
        """Triggers all handlers which are subscribed to an event.
        Returns True when there were callbacks to execute, False otherwise."""
        # upstream pending on issue https://github.com/timofurrer/observable/issues/17
        callbacks = list(self._events.get(event, []))
        return [callback(*args, **kw) for callback in callbacks]

    def heartbeats(self, seconds=10):
        if self._heartbeat is not None:
            self._heartbeat.cancel()

        if seconds is None or int(seconds) == 0:
            # disable heartbeats
            return

        def heartbeat():
            t = threading.Timer(seconds, heartbeat)
            t.daemon = True
            t.start()
            self.trigger("heartbeat")
            return t

        self._heartbeat = heartbeat()


class Jsonable:
    def as_json(self, stringify=True, **dumps_kwargs):
        serialized = self.serialize()
        if stringify:
            serialized = json.dumps(serialized, **dumps_kwargs)
        return serialized

    @classmethod
    def from_json(cls, serialized, **loads_kwargs):
        if isinstance(serialized, str):
            serialized = json.loads(serialized, **loads_kwargs)
        return cls.unserialize(serialized)

    def clone(self):
        return self.__class__.from_json(self.as_json())

    def serialize(self) -> dict:
        raise NotImplementedError

    @classmethod
    def unserialize(cls, serialized: dict) -> Any:
        raise NotImplementedError


def apply_seed(seed=None):
    """Applies a global random seed to the application state.

    In particular, the method seeds Python's random module and numpy, tensorflow and pytorch packages if available.

    Arguments:
    seed: Int|None, the random seed. Use None to unset seeding
    """
    if not isinstance(seed, int):
        return False

    random.seed(seed)

    try:
        import numpy as np

        np.random.seed(seed)
    except ImportError:
        pass

    try:
        import tensorflow as tf

        try:
            tf.random.set_seed(seed)
        except AttributeError:
            tf.compat.v1.set_random_seed(seed)

    except ImportError:
        pass

    try:
        import torch

        torch.manual_seed(seed)
    except ImportError:
        pass

    return True


def serialize(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, DatetimeType):
        return str(obj)
    if isinstance(obj, (omegaconf.DictConfig, omegaconf.ListConfig)):
        return OmegaConf.to_container(obj)
    else:
        raise TypeError(f"Unserializable object {obj} of type {type(obj)}")


def generate_seed(random_state=None):
    """Generates a seed from a random state

    # Arguments
    random_state: Random state or None

    Returns:
    int32 seed value
    """
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    return random_state.randint(0, 2 ** 31 - 1)


def as_color(experiment_id: str):
    return "".join(
        encode_experiment_id(decode_experiment_id(i) % 16)
        for i in experiment_id
    )


def encode_experiment_id(seed, or_fail=True) -> Optional[str]:
    """Encodes a seed and returns the corresponding experiment ID

    # Arguments
    seed: int in the range 62^5 <= seed <= 62^6-1
    or_fail: If True, raises a Value error instead of returning None
    """
    try:
        if not isinstance(seed, int):
            raise ValueError
        if 62 ** 5 <= seed <= 62 ** 6 - 1:
            return base62.encode(seed)
        raise ValueError
    except (ValueError, TypeError) as e:
        if or_fail:
            raise ValueError(
                "Seed has to lie in range 62^5 <= seed <= 62^6-1"
            ) from e
        return None


def decode_experiment_id(experiment_id, or_fail=True) -> Optional[int]:
    """Decodes a experiment ID into the corresponding seed

    # Arguments
    experiment_id: The base62 experiment ID
    or_fail: If True, raises a Value error instead of returning None
    """
    try:
        if not isinstance(experiment_id, str):
            raise ValueError
        value = int(base62.decode(experiment_id))
        if 62 ** 5 <= value <= 62 ** 6 - 1:
            return value
        raise ValueError
    except (ValueError, TypeError) as e:
        if or_fail:
            raise ValueError(
                f"'{experiment_id}' is not a valid experiment ID"
            ) from e
        return None


def generate_experiment_id(random_state=None) -> int:
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    # ~ 55x10^9 distinct experiment IDs that if represented in base62 are len 6
    return random_state.randint(62 ** 5, 62 ** 6 - 1)


def is_valid_variable_name(name):
    if not isinstance(name, str):
        return False
    return name.isidentifier() and not iskeyword(name)


def is_valid_module_path(name):
    return all(map(is_valid_variable_name, name.split(".")))


def random_str(length, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    return "".join(
        random_state.choice(
            string.ascii_uppercase + string.ascii_lowercase + string.digits
        )
        for _ in range(length)
    )


def call_with_context(function, **injections):
    signature = inspect.signature(function)
    payload = OrderedDict()

    for _, (key, parameter) in enumerate(signature.parameters.items()):
        if parameter.kind is not parameter.POSITIONAL_OR_KEYWORD:
            # disallow *args and **kwargs
            raise TypeError(
                f"{function.__name__} only allows simple positional or keyword arguments"
            )

        if key in injections:
            payload[key] = injections[key]
        else:
            raise ValueError(
                f"Unrecognized argument: '{key}'. "
                f"{function.__name__} takes the following arguments: {str(tuple(injections.keys()))}"
            )

    return function(**payload)


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
    """Generate a random nickname by chaining words from categories

    # Arguments
    categories: List of categories, available: 'animal', 'tree', 'color'.
                Can be nested. Defaults to ('color', ('animal', 'tree'))
    """
    if categories is None:
        categories = ("color", ("animal", "tree"))
    if isinstance(categories, str):
        categories = [categories]
    if not isinstance(categories, (list, tuple)):
        raise ValueError("Categories has to be a list of tuple")

    picks = []
    for category in categories:
        if isinstance(category, (list, tuple)):
            category = random.choice(category)
        if category not in _WORDS:
            raise KeyError(f"Invalid category: {category}")
        picks.append(random.choice(_WORDS[category]))
    return glue.join(picks)


def load_file(
    filepath: str,
    default: Any = sentinel,
    opener=open,
    **opener_kwargs,
) -> Any:
    """Loads a data object from file

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)
    default: Optional default if reading fails
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener
    """
    _, ext = os.path.splitext(filepath)
    mode = opener_kwargs.pop("mode", "r")
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
            with jsonlines.Reader(
                opener(filepath, mode, **opener_kwargs)
            ) as reader:
                return list(reader.iter())
        elif ext == ".npy":
            import numpy as np

            if "b" not in mode:
                mode = mode + "b"
            with opener(filepath, mode, **opener_kwargs) as f:
                data = np.load(f, allow_pickle=True)
        elif ext in [".txt", ".log", ".diff", ""]:
            with opener(filepath, mode, **opener_kwargs) as f:
                data = f.read()
        else:
            raise ValueError(
                f"Invalid format: '{ext}'. "
                f"Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)"
            )
        return data
    except (FileNotFoundError, Exception) as _ex:
        if default is not sentinel:
            return default
        raise _ex


def save_file(
    filepath: str,
    data: Any,
    makedirs: Union[bool, Callable] = True,
    opener=open,
    **opener_kwargs,
) -> str:
    """Saves a data object to file

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)
    data: The data object
    makedirs: If True or Callable, path will be created
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener

    Returns the absolute path to the written file
    """
    path = os.path.dirname(filepath)
    name = os.path.basename(filepath)
    _, ext = os.path.splitext(name)
    mode = opener_kwargs.pop("mode", "w")

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
        with jsonlines.Writer(
            opener(filepath, mode, **opener_kwargs),
            dumps=lambda *args, **kwargs: json.dumps(
                *args, sort_keys=True, default=serialize, **kwargs
            ),
        ) as writer:
            writer.write(data)
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
    elif ext in [".txt", ".log", ".diff", ""]:
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(str(data))
    else:
        raise ValueError(
            f"Invalid format: '{ext}'. "
            f"Supported formats are .json (JSON), .jsonl (JSON-lines), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)"
        )

    return os.path.abspath(filepath)


def sanitize_path(path: str) -> str:
    """Strips special characters from a path (any other than 0-9, a-z, A-Z, -, and _)

    # Arguments
    path: The path
    """
    return re.sub(r"[^0-9a-zA-Z/\-\_]+", "", path).replace("//", "/").strip("/")


def import_from_directory(
    module_name: str, directory: str, or_fail: bool = False
) -> Optional[ModuleType]:
    """Imports a module relative to a given absolute directory"""
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
        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)
        return module
    except FileNotFoundError as _e:
        if or_fail:
            raise ModuleNotFoundError(
                f"No module named '{module_name}'"
            ) from _e
    finally:
        if tmp_file:
            os.remove(file_path)

    return None


def find_subclass_in_module(
    module: Optional[types.ModuleType],
    base_class: Any,
    default: Optional[Any] = None,
) -> Any:
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


def find_installed_extensions(key: str) -> List[Tuple[str, ModuleType]]:
    return [
        (module.name, module.load())
        for module in entry_points().get(f"machinable.{key}", [])
    ]


def update_dict(
    d: Mapping, update: Optional[Mapping] = None, copy: bool = False
) -> Mapping:
    if d is None:
        d = {}
    if not isinstance(d, Mapping):
        raise ValueError(
            f"Error: Expected mapping but found {type(d).__name__}: {d}"
        )
    if copy:
        d = d.copy()
    if not update:
        return d
    for k, val in update.items():
        if isinstance(val, Mapping):
            d[k] = update_dict(d.get(k, {}), val, copy=copy)
        else:
            d[k] = val
    return d


def unflatten_dict(
    d: Mapping,
    splitter: Union[str, Callable] = "dot",
    inverse: bool = False,
    recursive: bool = True,
    copy: bool = True,
) -> dict:
    """Recursively unflatten a dict-like object

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
        return [
            unflatten_dict(v, splitter, inverse, recursive, copy) for v in d
        ]

    if isinstance(d, tuple):
        return (
            unflatten_dict(v, splitter, inverse, recursive, copy) for v in d
        )

    if isinstance(d, Mapping):
        if copy:
            d = d.copy()
        flat = _unflatten_dict(d=d, splitter=splitter, inverse=inverse)
        for k, nested in flat.items():
            flat[k] = unflatten_dict(nested, splitter, inverse, recursive, copy)
        return flat

    return d


def get_machinable_version() -> str:
    return version("machinable")


def set_process_title(title):
    try:
        import setproctitle

        setproctitle.setproctitle(title)
    except ImportError:
        pass
    # tmux
    if (
        os.environ.get("TERM", None) == "screen"
        and os.environ.get("TMUX", None) is not None
    ):
        os.system(f"printf '\033]2;%s\033\\' '{title}'")


def get_diff(repository: str) -> Optional[str]:
    git = commandlib.Command("git").in_dir(os.path.abspath(repository))

    try:
        return git("diff", "--staged").output()
    except commandlib.exceptions.CommandError:
        return None


# This following method is modified 3rd party source code from
# https://github.com/IDSIA/sacred/blob/7897c664b1b93fa2e2b6f3af244dfee590b1342a/sacred/dependencies.py#L401.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.


def get_commit(repository: str) -> dict:
    try:
        import git

        try:
            repo = git.Repo(repository, search_parent_directories=False)
            try:
                branch = str(repo.active_branch)
            except TypeError:
                branch = None

            try:
                path = repo.remote().url
            except ValueError:
                path = "git:/" + repo.working_dir
            is_dirty = repo.is_dirty()
            commit = repo.head.commit.hexsha
            return {
                "path": path,
                "commit": commit,
                "is_dirty": is_dirty,
                "branch": branch,
            }
        except (git.exc.GitError, ValueError):
            pass
    except ImportError:
        pass

    # todo: fallback

    return {"path": None, "commit": None, "is_dirty": None, "branch": None}


def get_root_commit(repository: str) -> Optional[str]:
    try:
        return (
            commandlib.Command("git", "rev-list", "--parents", "HEAD")
            .in_dir(repository)
            .output()[-1]
            .replace("\n", "")
        )
    except commandlib.exceptions.CommandError:
        return None
