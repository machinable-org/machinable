from typing import Callable, List, Optional, Union

import copy
from datetime import datetime as dt

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.component import compact
from machinable.element import Element, belongs_to, has_many
from machinable.engine import Engine
from machinable.experiment import Experiment
from machinable.grouping import Grouping
from machinable.project import Project
from machinable.repository import Repository
from machinable.settings import get_settings
from machinable.types import VersionType
from machinable.utils import generate_seed, update_dict


class Execution(Element):
    def __init__(
        self,
        engine: Union[str, None] = None,
        version: VersionType = None,
        seed: Union[int, None] = None,
    ):
        super().__init__()
        if engine is None:
            engine = Engine.default or get_settings().default_engine
        self.__model__ = schema.Execution(
            engine=compact(engine, version),
            seed=generate_seed() if seed is None else seed,
        )
        self._resolved_engine: Optional[Engine] = None

    @has_many
    def experiments() -> ExperimentCollection:
        return Experiment, ExperimentCollection

    @belongs_to
    def grouping():
        return Grouping

    def engine(self, reload: bool = False) -> "Engine":
        """Resolves and returns the engine instance"""
        if self._resolved_engine is None or reload:
            self._resolved_engine = Engine.make(
                self.__model__.engine[0], self.__model__.engine[1:]
            )

        return self._resolved_engine

    def add(
        self,
        experiment: Union[Experiment, List[Experiment]],
        resources: Union[
            Callable[[Engine, Experiment], dict], dict, None
        ] = None,
        seed: Optional[int] = None,
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        resources: dict, specifies the resources that are available to the experiment.
            This can be computed by passing in a callable (see below)

        # Dynamic resource computation

        You can condition the resource specification on the configuration, for example:
        ```python
        resources = lambda engine, experiment: {'cpu': experiment.config.num_cpus }
        ```
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.add(_experiment)
            return self

        if not isinstance(experiment, Experiment):
            raise ValueError(f"Invalid experiment: {experiment}")

        if experiment.is_mounted():
            # TODO: auto-derive from experiment with same configuration; if seed is not given use existing seed
            raise NotImplementedError("Experiment has already been executed")

        # parse resources
        if callable(resources):
            resources = resources(engine=self.engine(), experiment=experiment)

        try:
            default_resources = experiment.interface().default_resources(
                engine=self.engine()
            )
        except AttributeError:
            default_resources = None

        if resources is None and default_resources is not None:
            # use default resources
            resources = default_resources
        elif resources is not None and default_resources is not None:
            # merge with default resources
            if resources.pop("_inherit_defaults", True) is not False:
                defaults = self.engine().canonicalize_resources(
                    default_resources
                )
                update = self.engine().canonicalize_resources(resources)

                defaults_ = copy.deepcopy(defaults)
                update_ = copy.deepcopy(update)

                # apply removals (e.g. #remove_me)
                removals = [k for k in update.keys() if k.startswith("#")]
                for removal in removals:
                    defaults_.pop(removal[1:], None)
                    update_.pop(removal, None)

                resources = update_dict(defaults_, update_)

        # set relations
        experiment.__related__["execution"] = self
        self.__related__.setdefault("experiments", ExperimentCollection())
        self.__related__["experiments"].append(experiment)

        experiment._resources = resources

        if seed is None:
            seed = generate_seed(self.__model__.seed + len(self.experiments))

        experiment.__model__.seed = seed
        experiment.__model__.timestamp = self.timestamp

        return self

    def dispatch(self, grouping: Optional[str] = None) -> "Execution":
        """Dispatch the execution

        grouping: See repository.commit()
        """
        Repository.get().commit(self, grouping=grouping)

        self.engine().dispatch(self)

        return self

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    @property
    def seed(self) -> int:
        return self.__model__.seed

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

    def __repr__(self):
        return "Execution"

    def __str__(self):
        return self.__repr__()
