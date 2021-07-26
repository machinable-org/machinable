from typing import Any, List, Optional, Union

import os

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.component import compact
from machinable.element import Element, has_many
from machinable.engine import Engine
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.repository import Repository
from machinable.settings import get_settings
from machinable.types import VersionType


class Execution(Element):
    _kind = "Execution"

    def __init__(
        self,
        engine: Union[str, None] = None,
        version: VersionType = None,
        *,
        view: Union[bool, None, str] = True,
    ):
        super().__init__(view=view)
        if engine is None:
            engine = Engine.default or get_settings().default_engine
        self.__model__ = schema.Execution(
            engine=compact(engine, version),
            host=Project.get().provider().get_host_info(),
        )
        self._resolved_engine: Optional[Engine] = None

    @has_many
    def experiments() -> ExperimentCollection:
        return Experiment, ExperimentCollection

    @classmethod
    def local(cls, processes: Optional[int] = None) -> "Execution":
        return cls(
            engine="machinable.engine.local_engine",
            version={"processes": processes},
        )

    @property
    def version(self) -> VersionType:
        return self.__model__.engine[1:]

    @property
    def component(self) -> str:
        return self.__model__.engine[0]

    @classmethod
    def from_model(cls, model: schema.Execution) -> "Execution":
        instance = cls(model.engine[0])
        instance.__model__ = model
        return instance

    def engine(self, reload: bool = False) -> "Engine":
        """Resolves and returns the engine instance"""
        if self._resolved_engine is None or reload:
            self._resolved_engine = Engine.make(
                self.__model__.engine[0], self.__model__.engine[1:], parent=self
            )

        return self._resolved_engine

    def add(
        self, experiment: Union[Experiment, List[Experiment]]
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.add(_experiment)
            return self

        if not isinstance(experiment, Experiment):
            raise ValueError(
                f"Expected experiment, but found: {type(experiment)} {experiment}"
            )

        experiment.__related__["execution"] = self
        self.__related__.setdefault("experiments", ExperimentCollection())
        self.__related__["experiments"].append(experiment)

        return self

    def commit(self) -> "Execution":
        Repository.get().commit(experiments=self.experiments, execution=self)
        return self

    def dispatch(self) -> "Execution":
        """Commits and dispatches the execution"""
        self.commit()
        self.engine().dispatch()

        return self

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    def __repr__(self):
        return "Execution"

    def __str__(self):
        return self.__repr__()
