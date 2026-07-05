"""The Query object behind ``machinable.get``."""

from machinable.collection import InterfaceCollection
from machinable.interface import Interface, extend
from machinable.types import VersionType


class Query:
    """The callable resolver behind ``machinable.get``.

    Resolves interfaces, plus the lookup helpers ``by_id``, ``all``, ``new``,
    and ``from_directory``.
    """

    def by_id(self, uuid: str) -> Interface | None:
        """Load an interface by record id, or ``None`` if unknown."""
        return Interface.find_by_id(uuid)

    def from_directory(self, directory: str) -> Interface:
        """Load an interface from a record directory."""
        return Interface.from_directory(directory)

    def __call__(
        self,
        module: str | Interface | None = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        """Resolve ``module`` with ``version`` (the ``get(...)`` call itself)."""
        module, version = extend(module, version)
        return Interface.get(module, version, **kwargs)

    # modifiers

    def all(
        self,
        module: str | Interface | None = None,
        version: VersionType = None,
        **kwargs,
    ) -> "InterfaceCollection":
        """Every stored interface matching ``module`` and ``version``."""
        module, version = extend(module, version)
        return Interface.find(module, version, **kwargs)

    def new(
        self,
        module: str | Interface | None = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        """Build a fresh interface without reusing an existing record."""
        module, version = extend(module, version)
        return Interface.make(module, version, **kwargs)
