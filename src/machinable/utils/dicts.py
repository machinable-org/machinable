import copy
from typing import Mapping

import pendulum
from dotmap import DotMap


def get_or_fail(dict_likes, key, error="'{}' not found", options=None):
    if not isinstance(dict_likes, (list, tuple)):
        dict_likes = [dict_likes]

    for i, dict_like in enumerate(dict_likes):
        if key in dict_like:
            return dict_like[key]

    if isinstance(options, (list, tuple)):
        options = "\n Available: " + ", ".join(options)
    else:
        options = ""

    raise KeyError(error.format(key) + options)


def update_dict(d, update=None, copy=False, preserve_schema=False):
    if preserve_schema is True:
        preserve_schema = ""
    if d is None:
        d = {}
    if copy:
        d = d.copy()
    if not update:
        return d
    for k, v in update.items():
        # if preserve_schema, check that key is present in update target
        if isinstance(preserve_schema, str):
            if not isinstance(d, Mapping) or k not in d:
                if not preserve_schema.startswith("~"):
                    raise KeyError(
                        f"Invalid key: `{preserve_schema}{'.' if preserve_schema else ''}{k}` cannot be updated."
                    )
        if not isinstance(d, Mapping):
            raise ValueError("d must be a mapping")
        if isinstance(v, Mapping):
            # pass key path down to next level
            path = preserve_schema
            if isinstance(path, str):
                if len(path) > 0:
                    path += "."
                path += k
            d[k] = update_dict(d.get(k, {}), v, copy=copy, preserve_schema=path)
        else:
            d[k] = v
    return d


def merge_dict(d, update):
    if d is None:
        d = {}
    if not update:
        return d
    d_ = copy.deepcopy(d)
    update_ = copy.deepcopy(update)
    # apply removals (e.g. -/remove_me)
    removals = [k for k, v in update.items() if k.startswith("-/")]
    for removal in removals:
        d_.pop(removal[2:], None)
        update_.pop(removal, None)
    return update_dict(d_, update_)


def read_path_dict(dict_like, path):
    """
    Resolves an non-recursive jsonpath like string over a given dictionary

    # Arguments
    dict_like: Mapping, Lookup dictionary
    path: String, lookup path, e.g. path.to[key].foo

    # Examples
    ```python
    read_path_dict({'foo': {'bar': 42}}, 'foo.bar')
    >>> 42
    ```

    # Raises
    KeyError
    """
    path = path.replace("][", "].[")
    segments = path.split(
        "."
    )  # todo: escaped_split(string=path, delimiter='.', escaper='\\')

    current = dict_like
    for segment in segments:

        if segment.find("[") >= 0:
            # parse array notation x[y] -> key: x, segment: y
            key = segment[segment.find("[") + 1 : -1]
            if key.isdigit():
                key = int(key)

            if not segment.startswith("["):
                current = current[segment[: segment.find("[")]]
            current = current[key]
        else:
            current = current[segment]

    return current


def serialize(obj):
    """JSON serializer for objects not serializable by default json code
    """
    if isinstance(obj, pendulum.DateTime):
        return str(obj)

    if getattr(obj, "__dict__", False):
        return obj.__dict__

    return str(obj)


def dot_map(d=None):
    """Makes a dictionary into a dot accessible

    # Arguments
    d: dict-like

    Returns:
    ``dotmap.DotMap``
    """
    if d is None:
        d = {}
    return DotMap(d)


def options_dict(arguments):
    """
    ['--option', 'value', '--enabled', '--option2', 'value2']
    -> { 'option': 'value', 'enabled': True, 'option2': 'value2' }
    :param arguments:
    :return:
    """
    args = {}
    for i in range(len(arguments)):
        if not arguments[i].startswith("--"):
            continue
        key = arguments[i][2:]
        try:
            if not arguments[i + 1].startswith("--"):
                args[key] = arguments[i + 1]
            else:
                args[key] = True
        except IndexError:
            args[key] = True
    return args
