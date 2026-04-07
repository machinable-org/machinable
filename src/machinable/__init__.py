"""machinable"""

__all__ = [
    "Element",
    "Interface",
    "Execution",
    "Component",
    "Project",
    "Storage",
    "Mixin",
    "Index",
    "Scope",
    "mixin",
    "Schedule",
    "get",
    "from_cli",
]
__doc__ = """A modular system for machinable research code"""

from importlib.metadata import PackageNotFoundError, version

from machinable.cli import from_cli
from machinable.component import Component
from machinable.element import Element
from machinable.execution import Execution
from machinable.index import Index
from machinable.interface import Interface
from machinable.mixin import Mixin, mixin
from machinable.project import Project
from machinable.query import Query
from machinable.schedule import Schedule
from machinable.scope import Scope
from machinable.storage import Storage


def get_version() -> str:
    try:
        return version(__name__)
    except PackageNotFoundError:  # pragma: no cover
        return "unknown"


__version__: str = get_version()

get = Query()
