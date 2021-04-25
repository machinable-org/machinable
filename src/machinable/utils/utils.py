from typing import Any, Callable, Optional, Union

import hashlib
import inspect
import json
import os
import pickle
import random
import re
import string
from collections import OrderedDict
from keyword import iskeyword

import arrow
import jsonlines
from baseconv import base62

sentinel = object()


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
    if isinstance(obj, arrow.Arrow):
        return str(obj)

    if getattr(obj, "__dict__", False):
        return obj.__dict__

    return str(obj)


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
        [
            encode_experiment_id(decode_experiment_id(i) % 16)
            for i in experiment_id
        ]
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
