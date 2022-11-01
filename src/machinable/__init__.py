"""machinable"""
__all__ = [
    "Element",
    "Execution",
    "Experiment",
    "Project",
    "Record",
    "Storage",
    "cli",
]
__doc__ = """A modular system for machinable research code"""

import sys

if sys.version_info >= (3, 8):
    from importlib import metadata as importlib_metadata
else:
    import importlib_metadata

from machinable.cli import cli
from machinable.element import Element
from machinable.execution.execution import Execution
from machinable.experiment import Experiment
from machinable.mixin import Mixin
from machinable.project import Project
from machinable.record import Record
from machinable.storage import Storage


def get_version() -> str:
    try:
        return importlib_metadata.version(__name__)
    except importlib_metadata.PackageNotFoundError:  # pragma: no cover
        return "unknown"


__version__: str = get_version()
