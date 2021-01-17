from typing import Optional

import hashlib
import inspect
import os
import random
import string
from collections import OrderedDict
from keyword import iskeyword

from baseconv import base62

sentinel = object()


def get_file_hash(filepath):
    """Returns a hash value of a file

    # Arguments
    filepath: Absolute filepath

    # Returns
    md5 hexdigest of file content
    """
    if not os.path.isfile(filepath):
        return None
    algorithm = hashlib.md5()
    with open(filepath, "rb") as f:
        file_content = f.read()
        algorithm.update(file_content)

    return algorithm.hexdigest()


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
    """Decodes a submission ID into the corresponding seed

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
