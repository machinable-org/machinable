from machinable.utils.traits import Discoverable


class Storage(Discoverable):
    """Storage base class"""

    @classmethod
    def make(cls, args):
        """hack"""
        from machinable.storage.filesystem_storage import FilesystemStorage

        return FilesystemStorage(args)

    @classmethod
    def connect(cls, url):
        from machinable.element.element import Element

        Element.__storage__ = cls.make(url)
