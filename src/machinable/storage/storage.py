from machinable.component import Component


class Storage(Component):
    """Storage base class"""

    @classmethod
    def make(cls, args):
        """hack"""
        from machinable.storage.filesystem_storage import FilesystemStorage

        return FilesystemStorage(args)

    @classmethod
    def multiple(cls, *storages) -> "Storage":
        if len(storages) == 1:
            return Storage.make(storages[0])

        from machinable.storage.multiple_storage import MultipleStorage

        return MultipleStorage(storages)
