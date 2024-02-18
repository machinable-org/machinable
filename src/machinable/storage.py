from typing import TYPE_CHECKING, List, Union

import os

from machinable import schema
from machinable.element import get_lineage
from machinable.index import Index
from machinable.interface import Interface
from machinable.types import VersionType
from machinable.utils import load_file


class Storage(Interface):
    kind = "Storage"
    default = None

    def __init__(
        self,
        version: VersionType = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Storage(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )

    def upload(
        self, interface: "Interface", related: Union[bool, int] = True
    ) -> None:
        """
        Upload the interface to the storage

        interface: Interface
        related: bool | int
            - 0/False: Do not save related interfaces
            - 1/True: Save immediately related interfaces
            - 2: Save related interfaces and their related interfaces
        """
        if self.contains(interface.uuid):
            self.update(interface)
        else:
            self.commit(interface)

        if related:
            for r in interface.related(deep=int(related) == 2).all():
                self.upload(r, related=False)

    def download(
        self,
        uuid: str,
        destination: Union[str, None] = None,
        related: Union[bool, int] = True,
    ) -> List[str]:
        """
        Download to destination

        uuid: str
            Primary interface UUID
        destination: str | None
            If None, download will be imported into active index. If directory filepath, download will be placed
            in directory without import to index
        related: bool | int
            - 0/False: Do not upload related interfaces
            - 1/True: Upload immediately related interfaces
            - 2: Upload related interfaces and their related interfaces

        Returns:
            List of downloaded directories
        """
        index = None
        download_directory = destination
        if destination is None:
            index = Index.get()
            download_directory = index.config.directory

        retrieved = []

        # retrieve primary
        local_directory = os.path.join(download_directory, uuid)
        if self.retrieve(uuid, local_directory):
            retrieved.append(local_directory)

        # retrieve related
        if related:
            related_uuids = set()
            for r in load_file(
                [local_directory, "related", "metadata.jsonl"], []
            ):
                related_uuids.add(r["uuid"])
                related_uuids.add(r["related_uuid"])

            for r in related_uuids:
                if r == uuid:
                    continue
                retrieved.extend(
                    self.download(
                        r,
                        destination,
                        related=2 if int(related) == 2 else False,
                    )
                )

        # import to index
        if index is not None:
            for directory in retrieved:
                index.import_directory(directory, relations=bool(related))

        return retrieved

    def commit(self, interface: "Interface") -> None:
        ...

    def update(self, interface: "Interface") -> None:
        return self.commit(interface)

    def contains(self, uuid: str) -> bool:
        ...
        return False

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        ...
        return False


def fetch(uuid: str, directory: str) -> bool:
    available = False
    for storage in Storage.connected():
        if storage.retrieve(uuid, directory):
            available = True
            break

    return available
