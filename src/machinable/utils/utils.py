import hashlib
import os
import random
import string
from keyword import iskeyword

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
