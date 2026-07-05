"""machinable."""

__all__ = [
    "Interface",
    "Widget",
    "Inference",
    "Execution",
    "Project",
    "Storage",
    "Index",
    "Scope",
    "get",
    "from_cli",
    "Field",
    "import_ref",
    "resolve_ref",
]
__doc__ = """A modular system for machinable research code"""

from importlib.metadata import PackageNotFoundError, version

from machinable.cli import from_cli
from machinable.config import Field, import_ref, resolve_ref
from machinable.execution import Execution
from machinable.index import Index
from machinable.inference import Inference
from machinable.interface import Interface
from machinable.project import Project
from machinable.query import Query
from machinable.scope import Scope
from machinable.storage import Storage
from machinable.widget import Widget


def get_version() -> str:
    try:
        return version(__name__)
    except PackageNotFoundError:  # pragma: no cover
        return "unknown"


__version__: str = get_version()

get = Query()
