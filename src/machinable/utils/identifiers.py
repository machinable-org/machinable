import random
from typing import Optional

from baseconv import base62

from .utils import random_str


def encode_experiment_id(seed, or_fail=True) -> Optional[str]:
    """Encodes a seed and returns the corresponding experiment ID

    # Arguments
    seed: int in the range 62^5 <= seed <= 62^6-1
    or_fail: If True, raises a Value error instead of returning None
    """
    try:
        if not isinstance(seed, int):
            raise ValueError()
        if 62 ** 5 <= seed <= 62 ** 6 - 1:
            return base62.encode(seed)
        raise ValueError()
    except (ValueError, TypeError):
        if or_fail:
            raise ValueError("Seed has to lie in range 62^5 <= seed <= 62^6-1")
        return None


def decode_experiment_id(experiment_id, or_fail=True) -> Optional[int]:
    """Decodes a experiment ID into the corresponding seed

    # Arguments
    experiment_id: The base62 experiment ID
    or_fail: If True, raises a Value error instead of returning None
    """
    try:
        if not isinstance(experiment_id, str):
            raise ValueError()
        value = int(base62.decode(experiment_id))
        if 62 ** 5 <= value <= 62 ** 6 - 1:
            return value
        raise ValueError()
    except (ValueError, TypeError):
        if or_fail:
            raise ValueError(f"'{experiment_id}' is not a valid experiment ID")
        return None


def generate_experiment_id(with_encoding=True, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    # ~ 55x10^9 distinct experiment ids that if represented in base62 are len 6
    experiment_id = random_state.randint(62 ** 5, 62 ** 6 - 1)

    if with_encoding:
        return experiment_id, encode_experiment_id(experiment_id)

    return experiment_id


def generate_component_id(k=1, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    if not isinstance(k, int):
        raise ValueError(f"k has to be integer, {type(k)} given")

    return [random_str(length=12, random_state=random_state) for _ in range(k)]
