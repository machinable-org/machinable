import os
import re
from typing import Callable

import yaml


class Loader(yaml.SafeLoader):
    def __init__(self, stream):
        if isinstance(stream, str):
            self._root = "./"
        else:
            # from filestream
            self._root = os.path.split(stream.name)[0]

        super(Loader, self).__init__(stream)

    def include(self, node):
        target = self.construct_scalar(node)

        if target.startswith("$/"):
            target = target[2:]

        filename = os.path.join(self._root, target)

        with open(filename, "r") as f:
            return yaml.load(f, Loader)


# Support $/ notation for includes
Loader.add_constructor("!include", Loader.include)
Loader.add_implicit_resolver("!include", re.compile(r"\$\/([^#^ ]*)"), first=None)

# Support scientific number formats
Loader.add_implicit_resolver(
    "tag:yaml.org,2002:float",
    re.compile(
        """^(?:
                             [-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+]?[0-9]+)?
                             |[-+]?(?:[0-9][0-9_]*)(?:[eE][-+]?[0-9]+)
                             |\\.[0-9_]+(?:[eE][-+][0-9]+)?
                             |[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*
                             |[-+]?\\.(?:inf|Inf|INF)
                             |\\.(?:nan|NaN|NAN))$""",
        re.X,
    ),
    list("-+0123456789."),
)

sentinel = object()


def from_file(filename, default=sentinel):
    if not os.path.isfile(filename):
        if default is not sentinel:
            return default
        return None

    with open(filename, "r") as f:
        config = yaml.load(f, Loader)

    return config


def from_string(text):
    return yaml.load(text, Loader)


def from_callable(callable: Callable, default=sentinel):
    doc = callable.__doc__.split("machinable.yaml\n")
    if len(doc) == 1:
        if default is not sentinel:
            return default
        return None

    return from_string(doc[1])
