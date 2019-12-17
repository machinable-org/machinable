from typing import Mapping

from dotmap import DotMap


def get_or_fail(dict_likes, key, error="'{}' not found", options=None):
    if not isinstance(dict_likes, (list, tuple)):
        dict_likes = [dict_likes]

    for i, dict_like in enumerate(dict_likes):
        if key in dict_like:
            return dict_like[key]

    if isinstance(options, (list, tuple)):
        options = '\n Available: ' + ', '.join(options)
    else:
        options = ''

    raise KeyError(error.format(key) + options)


def update_dict(d, update=None, copy=False):
    if d is None:
        d = {}
    if copy:
        d = d.copy()
    if not update or update is None:
        return d
    for k, v in update.items():
        if isinstance(v, Mapping):
            d[k] = update_dict(d.get(k, {}), v, copy=copy)
        else:
            d[k] = v
    return d


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
    path = path.replace('][', '].[')
    segments = path.split('.')  # todo: escaped_split(string=path, delimiter='.', escaper='\\')

    current = dict_like
    for segment in segments:

        if segment.find('[') >= 0:
            # parse array notation x[y] -> key: x, segment: y
            key = segment[segment.find('[') + 1:-1]
            if key.isdigit():
                key = int(key)

            if not segment.startswith('['):
                current = current[segment[:segment.find('[')]]
            current = current[key]
        else:
            current = current[segment]

    return current


def serialize(obj):
    """JSON serializer for objects not serializable by default json code
    """
    if getattr(obj, '__dict__', False):
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
