from typing import Any, Dict, List, Optional, Union

import copy
import os

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.element import Element, defaultversion, has_many
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import VersionType
from machinable.utils import update_dict


class Execution(Element):
    _kind = "Execution"

    def __init__(
        self,
        version: VersionType = None,
    ):
        super().__init__(version)
        self.__model__ = schema.Execution(
            version=self.__model__.version,
            host=Project.get().get_host_info(),
        )

    @classmethod
    def make(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
    ) -> "Execution":
        module, version = defaultversion(
            module,
            version,
            Execution.default or get_settings().default_execution,
        )
        return super().make(module, version, base_class=Execution)

    @has_many
    def experiments() -> ExperimentCollection:
        return Experiment, ExperimentCollection

    @classmethod
    def local(cls, processes: Optional[int] = None) -> "Execution":
        return cls.make(
            "machinable.execution.local_execution",
            version={"processes": processes},
        )

    @classmethod
    def from_model(cls, model: schema.Execution) -> "Execution":
        instance = cls(model.version)
        instance.__model__ = model
        return instance

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
        Storage.get().commit(experiments=self.experiments, execution=self)
        return self

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def resources(self, experiment: "Experiment") -> Dict:
        default_resources = None
        if hasattr(experiment, "default_resources"):
            default_resources = experiment.default_resources(engine=self)

        if experiment.resources() is None and default_resources is not None:
            return self.canonicalize_resources(default_resources)

        if experiment.resources() is not None and default_resources is None:
            resources = copy.deepcopy(experiment.resources())
            resources.pop("_inherit_defaults", None)
            return self.canonicalize_resources(resources)

        if experiment.resources() is not None and default_resources is not None:
            resources = copy.deepcopy(experiment.resources())
            if resources.pop("_inherit_defaults", True) is False:
                return self.canonicalize_resources(resources)

            # merge with default resources
            defaults = self.canonicalize_resources(default_resources)
            update = self.canonicalize_resources(resources)

            defaults_ = copy.deepcopy(defaults)
            update_ = copy.deepcopy(update)

            # apply removals (e.g. #remove_me)
            removals = [k for k in update.keys() if k.startswith("#")]
            for removal in removals:
                defaults_.pop(removal[1:], None)
                update_.pop(removal, None)

            return update_dict(defaults_, update_)

        return {}

    def dispatch(self) -> "Execution":
        """Commits and dispatches the execution"""
        self.commit()

        if self.on_before_dispatch() is False:
            return False

        results = self._dispatch()

        if not isinstance(results, (list, tuple)):
            results = [results]

        self.on_after_dispatch(results)

        return self

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch
        """

    def on_after_dispatch(self, results: List[Any]) -> None:
        """Event triggered after the dispatch of an execution"""

    def _dispatch(self) -> List[Any]:
        return [
            self._dispatch_experiment(experiment)
            for experiment in self.experiments
        ]

    def _dispatch_experiment(self, experiment: "Experiment") -> Any:
        return experiment.dispatch()

    def __str__(self) -> str:
        return self.__repr__()

    def __repr__(self) -> str:
        return "Execution"
