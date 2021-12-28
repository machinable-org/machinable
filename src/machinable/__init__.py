"""machinable's public object API"""
from machinable.execution import Execution
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.record import Record
from machinable.storage import Storage


def cli():
    from omegaconf import OmegaConf

    return OmegaConf.to_container(OmegaConf.from_cli())
