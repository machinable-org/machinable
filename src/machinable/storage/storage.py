from typing import Any, Optional

from machinable.component import Component


class Storage(Component):
    """Storage base class"""

    def retrieve_file(
        experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        raise NotImplementedError

    @classmethod
    def multiple(cls, *storages) -> "Storage":
        if len(storages) == 1:
            return Storage.make(storages[0])

        from machinable.storage.multiple_storage import MultipleStorage

        return MultipleStorage(storages)
