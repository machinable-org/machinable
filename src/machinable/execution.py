from typing import Callable, List, Optional, Union

import copy
from datetime import datetime as dt

from machinable import schema
from machinable.collection.experiment import ExperimentCollection
from machinable.component import compact
from machinable.element import Element, belongs_to, has_many
from machinable.engine import Engine
from machinable.experiment import Experiment
from machinable.grouping import Grouping
from machinable.project import Project
from machinable.repository import Repository
from machinable.settings import get_settings
from machinable.types import VersionType
from machinable.utils import generate_nickname, generate_seed, update_dict


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
        self._engine = compact(engine, version)
        self._resolved_engine: Optional[Engine] = None
        self._seed = generate_seed(seed)
        self._nickname = generate_nickname()
        self._timestamp = dt.now().timestamp()

    def to_model(self) -> schema.Execution:
        return schema.Execution(
            engine=self._engine,
            config=dict(self.engine().config.copy()),
            timestamp=self._timestamp,
            nickname=self._nickname,
            seed=self._seed,
        )

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
                self._engine[0], self._engine[1:]
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
            seed = generate_seed(self._seed + len(self.experiments))

        experiment._seed = seed

        return self

    def submit(self, grouping: Optional[str] = None) -> "Execution":
        """Submit the execution

        grouping: See repository.commit()
        """
        Repository.get().commit(self, grouping=grouping)

        self.engine().dispatch(self)

        return self

    def derive(
        self,
        engine: Union[str, None] = None,
        version: VersionType = None,
        seed: Union[int, None] = None,
    ) -> "Execution":
        """Derives a related execution."""
        # user can specify overrides, otherwise it copies all objects over

    def serialize(self):
        return {
            "engine": self._engine,
            "nickname": self._nickname,
            "seed": self._seed,
            "timestamp": self._timestamp,
        }

    @classmethod
    def unserialize(cls, serialized):
        raise NotImplementedError

    def __repr__(self):
        return f"Execution"

    def __str__(self):
        return self.__repr__()
