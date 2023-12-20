from machinable.collection import InterfaceCollection
from machinable.element import extend, normversion
from machinable.interface import Interface
from machinable.types import Optional, Union, VersionType


class Query:
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

    def or_none(
        self,
        module: Union[None, str, Interface] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Optional[Interface]:
        module, version = extend(module, version)
        existing = Interface.find(module, version, **kwargs)
        if existing:
            return existing[-1]

        return None

    def or_fail(
        self,
        module: Union[None, str, Interface] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        module, version = extend(module, version)
        existing = Interface.find(module, version, **kwargs)
        if existing:
            return existing[-1]

        raise ValueError(
            f"Could not find {module}{normversion(version)} ({kwargs})"
        )

    def prefer_cached(
        self,
        module: Union[None, str, Interface] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Optional[Interface]:
        module, version = extend(module, version)
        existing = Interface.find(module, version, **kwargs)
        if existing:
            for i in range(len(existing) - 1):
                if existing[i].cached():
                    return existing[i]
            return existing[-1]

        return Interface.make(module, version, **kwargs)
