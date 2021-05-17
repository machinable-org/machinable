from typing import List, Optional, Union

from datetime import datetime as dt

from machinable.collection.experiment import ExperimentCollection
from machinable.element import Element, belongs_to, has_many
from machinable.engine import Engine
from machinable.experiment import Experiment
from machinable.repository import Repository
from machinable.schema import ExecutionType
from machinable.utils.utils import generate_nickname, generate_seed


class Execution(Element):
    def __init__(
        self,
        engine: Union[str, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        seed: Union[int, None] = None,
    ):
        super().__init__()
        if engine is None:
            # default
            engine = "machinable.engine.native_engine"
        self._engine = engine
        self._config = config
        self._experiments = []

        self._seed = generate_seed(seed)
        self._nickname = generate_nickname()
        self._timestamp = dt.now().timestamp()

    def _to_model(self) -> ExecutionType:
        return ExecutionType(timestamp=self._timestamp, nickname=self._nickname)

    @has_many
    def experiments() -> ExperimentCollection:
        from machinable.experiment import Experiment

        return Experiment, ExperimentCollection

    @belongs_to
    def repository():
        from machinable.repository import Repository

        return Repository

    def add(
        self,
        experiment: Union[Experiment, List[Experiment]],
        resources: Optional[dict] = None,
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        resources: dict, specifies the resources that are available to the experiment.
            This can be computed by passing in a callable (see below)

        # Dynamic resource computation

        You can condition the resource specification on the configuration, for example:
        ```python
        resources = lambda component: {'cpu': component.config.num_cpus }
        ```
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.add(_experiment)
            return self

        if not isinstance(experiment, Experiment):
            raise ValueError(f"Invalid experiment: {experiment}")

        # set relation
        experiment.__related__["execution"] = self
        self.__related__.setdefault("experiments", ExperimentCollection())
        self.__related__["experiments"].append(experiment)

        self._experiments.append((experiment, resources))

        # parse resources
        # if not self.engine.supports_resources():
        #     if resources is not None:
        #         msg(
        #             "Engine does not support resource specification. Skipping ...",
        #             level="warn",
        #             color="header",
        #         )
        #         resources = None
        # else:
        #     if callable(resources):
        #         resources = resources(engine=self.engine, experiment=experiment)

        #     default_resources = self.registration.default_resources(
        #         engine=self.engine, experiment=experiment
        #     )

        #     if resources is None and default_resources is not None:
        #         # use default resources
        #         resources = default_resources
        #     elif resources is not None and default_resources is not None:
        #         # merge with default resources
        #         if resources.pop("_inherit_defaults", True) is not False:
        #             canonicalize_resources = getattr(
        #                 self.engine, "canonicalize_resources", lambda x: x
        #             )
        #             resources = merge_dict(
        #                 canonicalize_resources(default_resources),
        #                 canonicalize_resources(resources),
        #             )

        return self

    def submit(
        self, repository: Union[Repository, str, None] = None
    ) -> "Execution":
        """Submit the execution

        repository: Optional storage repository
        """
        if not isinstance(repository, Repository):
            repository = Repository(repository)

        repository.commit(self)

        engine = self.__project__.get_component(self._engine, self._config)

        engine.dispatch(self)

        return self

    def derive(
        self,
        engine: Union[str, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        seed: Union[int, None] = None,
    ) -> "Execution":
        """Derives a related execution."""
        # user can specify overrides, otherwise it copies all objects over

    def serialize(self):
        return {
            # "seed": self.seed,
            "timestamp": self._timestamp,
        }

    @classmethod
    def unserialize(cls, serialized):
        raise NotImplementedError

    def __repr__(self):
        return f"Execution"

    def __str__(self):
        return self.__repr__()
