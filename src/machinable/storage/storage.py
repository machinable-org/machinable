from machinable.schema import ExecutionType, ExperimentType, SchemaType
from machinable.utils.traits import Discoverable


class Storage(Discoverable):
    """Storage base class"""

    @classmethod
    def make(cls, args):
        """hack"""
        from machinable.storage.filesystem_storage import FilesystemStorage

        return FilesystemStorage(args)

    @classmethod
    def connect(cls, url) -> "Storage":
        from machinable.element.element import Element

        instance = cls.make(url)

        Element.__storage__ = instance

        return instance
