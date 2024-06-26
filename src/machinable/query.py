from machinable.collection import InterfaceCollection
from machinable.element import extend, normversion
from machinable.interface import Interface
from machinable.types import Optional, Union, VersionType


class Query:
    def by_id(self, uuid: str) -> Optional[Interface]:
        return Interface.find_by_id(uuid)

    def from_directory(self, directory: str) -> Interface:
        return Interface.from_directory(directory)

    def __call__(
        self,
        module: Union[str, Interface, None] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        module, version = extend(module, version)
        return Interface.get(module, version, **kwargs)

    # modifiers

    def all(
        self,
        module: Union[None, str, Interface] = None,
        version: VersionType = None,
        **kwargs,
    ) -> "InterfaceCollection":
        module, version = extend(module, version)
        return Interface.find(module, version, **kwargs)

    def new(
        self,
        module: Union[None, str, Interface] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        module, version = extend(module, version)
        return Interface.make(module, version, **kwargs)
