"""machinable's public object API"""
from machinable.component import Component
from machinable.engine import Engine
from machinable.execution import Execution
from machinable.experiment import Experiment
from machinable.interface import Interface
from machinable.project import Project
from machinable.provider import Provider
from machinable.record import Record
from machinable.repository import Repository
from machinable.storage import Storage


def cli():
    from omegaconf import OmegaConf

    return OmegaConf.to_container(OmegaConf.from_cli())
