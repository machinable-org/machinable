import os
import yaml
import re


class Loader(yaml.SafeLoader):

    def __init__(self, stream):

        self._root = os.path.split(stream.name)[0]

        super(Loader, self).__init__(stream)

    def include(self, node):
        target = self.construct_scalar(node)

        if target.startswith('$/'):
            target = target[2:]

        filename = os.path.join(self._root, target)

        with open(filename, 'r') as f:
            return yaml.load(f, Loader)


# Support $/ notation for includes
Loader.add_constructor('!include', Loader.include)
Loader.add_implicit_resolver(u'!include', re.compile(r'\$\/([^#^ ]*)'), first=None)

# Support scientific number formats
Loader.add_implicit_resolver(u'tag:yaml.org,2002:float',
                             re.compile(u'''^(?:
                             [-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+]?[0-9]+)?
                             |[-+]?(?:[0-9][0-9_]*)(?:[eE][-+]?[0-9]+)
                             |\\.[0-9_]+(?:[eE][-+][0-9]+)?
                             |[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*
                             |[-+]?\\.(?:inf|Inf|INF)
                             |\\.(?:nan|NaN|NAN))$''', re.X),
                             list(u'-+0123456789.'))

sentinel = object()


def from_file(filename, default=sentinel):
    if not os.path.isfile(filename):
        if default is not sentinel:
            return default
        raise FileNotFoundError(f"Configuration file '{filename}' not found")

    with open(filename, 'r') as f:
        config = yaml.load(f, Loader)

    return config
