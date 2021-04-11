import json
import os
import uuid

import pendulum
from fs import open_fs
from machinable.filesystem.filesystem import FileSystem
from machinable.repository.repository import Repository
from machinable.utils.host import get_host_info
from machinable.utils.traits import Discoverable


class Storage(Discoverable):
    """Storage base class"""

    @classmethod
    def make(cls, args):
        """hack"""
        return cls(args)

    @classmethod
    def connect(cls, url) -> "Storage":
        from machinable.element.element import Element

        instance = cls.make(url)

        Element.__storage__ = instance

        return instance
