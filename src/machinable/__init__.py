"""machinable"""
__all__ = [
    "Element",
    "Execution",
    "Experiment",
    "Project",
    "Record",
    "Storage",
    "Mixin",
    "mixin",
    "Schedule",
    "get",
    "get_settings",
]
__doc__ = """A modular system for machinable research code"""

import sys

if sys.version_info >= (3, 8):
    from importlib import metadata as importlib_metadata
else:
    import importlib_metadata

from machinable.cli import cli
from machinable.element import Element
from machinable.execution import Execution
from machinable.experiment import Experiment
from machinable.mixin import Mixin, mixin
from machinable.project import Project
from machinable.record import Record
from machinable.schedule import Schedule
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import Optional, VersionType


def get(
    module: Optional[str] = None,
    version: VersionType = None,
    predicate: Optional[str] = get_settings().default_predicate,
    **kwargs,
) -> Element:
    return Element.get(module, version, predicate, **kwargs)


def get_version() -> str:
    try:
        return importlib_metadata.version(__name__)
    except importlib_metadata.PackageNotFoundError:  # pragma: no cover
        return "unknown"


__version__: str = get_version()
