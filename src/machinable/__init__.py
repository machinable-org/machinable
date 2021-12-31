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
from typing import Dict
from machinable.element import Element
from machinable.execution.execution import Execution
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.record import Record
from machinable.storage import Storage


def cli() -> Dict:
    from omegaconf import OmegaConf

    return OmegaConf.to_container(OmegaConf.from_cli())
