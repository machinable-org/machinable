# flake8: noqa
import random
import json
from collections import OrderedDict
import logging
import csv
import copy
from importlib import reload
import datetime
import inspect
from typing import Dict, Type, Union
from typing import Optional, List
import re
from typing import Mapping
from keyword import iskeyword
import os
try:
    import cPickle as pickle
except ImportError:
    import pickle
import importlib
from inspect import getattr_static
# !include machinable.observer.host


class ConfigMap(dict):

    def __init__(self, dict_like, *args, **kwargs):
        for key, value in dict_like.items():
            if hasattr(value, 'keys'):
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


# !include machinable.utils.strings.is_valid_variable_name


# !include machinable.utils.dicts.update_dict


# !include machinable.utils.utils.apply_seed


# !include machinable.utils.formatting.prettydict


# !include machinable.observer.record.Record


# !include machinable.observer.log.Log


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


# !include machinable.observer.observer.Observer


# !include machinable.core.core.set_alias


# !include machinable.core.core.inject_components


# !include machinable.config.parser.ModuleClass


# !include machinable.config.mapping.ConfigMethod


# !include machinable.config.config.bind_config_methods


# !include machinable.config.config.parse_mixins


# !include machinable.core.core.MixinInstance


Mixin = object
# !include machinable.Mixin


# !include machinable.core.core.ComponentState


# !include machinable.core.core.Component
