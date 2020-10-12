import copy
import csv
import datetime
import importlib
import inspect
import json
import logging
import os
import random
import re
import sys
from collections import OrderedDict
from importlib import reload
from inspect import getattr_static
from keyword import iskeyword
from typing import Dict, List, Mapping, Optional, Type, Union

try:
    import cPickle as pickle
except ImportError:
    import pickle

# !include machinable.utils.host


class ConfigMap(dict):
    def __init__(self, dict_like, *args, **kwargs):
        for key, value in dict_like.items():
            if hasattr(value, "keys"):
                value = ConfigMap(value)
            self[key] = value

    def toDict(self, *args, **kwargs):
        return self

    __delattr__ = dict.__delitem__
    __getattr__ = dict.__getitem__
    __setattr__ = dict.__setitem__


def config_map(d=None):
    return ConfigMap(d)


# !include machinable.utils.formatting.msg


# !include machinable.utils.dicts.serialize


# !include machinable.utils.utils.is_valid_variable_name


# !include machinable.utils.dicts.update_dict


# !include machinable.utils.utils.apply_seed


# !include machinable.utils.formatting.prettydict


# !include machinable.storage.record.Record


# !include machinable.storage.log.Log


class FileSystem:
    def __init__(self, directory):
        self.directory = directory

    def makedirs(self, path, recreate=True):
        os.makedirs(os.path.join(self.directory, path), exist_ok=True)

    def makedir(self, path, recreate=True):
        return self.makedirs(path, recreate)

    def isfile(self, file):
        return os.path.isfile(os.path.join(self.directory, file))

    def exists(self, path):
        return os.path.exists(os.path.join(self.directory, path))

    def open(self, path, *args, **kwargs):
        path = os.path.join(self.directory, path)
        return open(path, *args, **kwargs)


def open_fs(storage, *args, **kwargs):
    return FileSystem(storage)


# !include machinable.utils.system.OutputRedirection


# !include machinable.storage.storage.Storage


# !include machinable.core.component.set_alias


# !include machinable.core.component.inject_components


# !include machinable.config.parser.ModuleClass


# !include machinable.config.mapping.ConfigMethod


# !include machinable.core.component.bind_config_methods


# !include machinable.config.parser.parse_mixins


# !include machinable.core.component.MixinInstance


Mixin = object
# !include machinable.Mixin


# !include machinable.core.component.ComponentState


# !include machinable.core.component.Component
