import datetime
import hashlib
import random
import string
from keyword import iskeyword

from baseconv import base62


def random_str(length, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    return ''.join(random_state.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits)
                   for _ in range(length))


def is_valid_variable_name(name):
    if not isinstance(name, str):
        return False
    return name.isidentifier() and not iskeyword(name)


def encode_id(number):
    return base62.encode(number)


def decode_id(string_number):
    """Decodes a task ID into the corresponding seed

    # Arguments
    string_number: The base62 task ID

    Returns:
    Int
    """
    return int(base62.decode(string_number))


def generate_task_id(with_encoding=True, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    # ~ 55x10^9 distinct task ids that if represented in base62 are len 6
    task_id = random_state.randint(62**5, 62**6 - 1)

    if with_encoding:
        return task_id, encode_id(task_id)

    return task_id


def generate_uid(k=None, random_state=None):
    if random_state is None or isinstance(random_state, int):
        random_state = random.Random(random_state)

    length = 12

    if k is None or k == 0:
        return random_str(length, random_state=random_state)

    if not isinstance(k, int):
        raise ValueError('k has to be integer, %s given' % str(type(k)))

    return [random_str(length, random_state=random_state) for _ in range(k)]


def generate_execution_id(timestamp=None):
    if timestamp is None:
        timestamp = datetime.datetime.now().timestamp()

    hashed = hashlib.sha256(str(timestamp).encode('utf-8')).hexdigest()
    return hashed[:9]
