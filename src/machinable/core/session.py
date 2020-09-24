from ..utils.utils import sentinel

_SESSION = {}
_KEYS = ["component"]
_ALIASES = {
    "component": "component",
    "store": "component",
    "config": "component",
    "flags": "component",
    "log": "component",
    "record": "component",
}


def get(key, default=sentinel):
    if key not in _ALIASES:
        raise ValueError(f"Invalid session key: {key}")

    session_key = _ALIASES[key]

    if session_key not in _SESSION:
        if default is not sentinel:
            return default

        raise RuntimeError("The session object is only available during execution")

    value = _SESSION[session_key]

    if key != session_key:
        # resolve alias
        value = getattr(value, key)

    return value


def session_set(key, value):
    if key not in _KEYS:
        raise ValueError(f"Invalid session key: {key}")
    _SESSION[key] = value


def session_unset(key=None):
    if key is None:
        key = _KEYS
    elif isinstance(key, str):
        key = [key]
    for k in key:
        _SESSION.pop(k, None)
