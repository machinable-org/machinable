from typing import Any, Dict, List, Optional, Union

import copy
import os

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.element import Element, defaultversion, get_lineage, has_many
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import VersionType
from machinable.utils import update_dict


class Execution(Element):
    _key = "Execution"
    default = get_settings().default_execution

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
    ):
        super().__init__(version)
        self.__model__ = schema.Execution(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            resources=resources,
            host_info=Project.get().provider().get_host_info(),
            lineage=get_lineage(self),
        )

    @classmethod
    def instance(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        resources: Optional[Dict] = None,
    ) -> "Execution":
        module, version = defaultversion(module, version, cls)
        return super().make(
            module, version, resources=resources, base_class=Execution
        )

    @has_many
    def experiments() -> ExperimentCollection:
        return Experiment, ExperimentCollection

    @classmethod
    def local(cls, processes: Optional[int] = None) -> "Execution":
        return cls.make(
            "machinable.execution.local",
            version={"processes": processes},
        )

    @classmethod
    def from_model(cls, model: schema.Execution) -> "Execution":
        return super().from_model(model)

    def use(
        self, experiment: Union[Experiment, List[Experiment]]
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.use(_experiment)
            return self

        if not isinstance(experiment, Experiment):
            raise ValueError(
                f"Expected experiment, but found: {type(experiment)} {experiment}"
            )

        self.__related__.setdefault("experiments", ExperimentCollection())
        self.__related__["experiments"].append(experiment)

        return self

    def commit(self) -> "Execution":
        # save to storage
        Storage.get().commit(experiments=self.experiments, execution=self)
        for experiment in self.experiments:
            # resolve resources
            experiment.save_execution_data(
                "resources.json", self.compute_resources(experiment)
            )
            # relationships
            experiment.__related__["execution"] = self

        return self

    def resources(self) -> Optional[Dict]:
        return self.__model__.resources

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def default_resources(self, experiment: "Experiment") -> Optional[dict]:
        """Default resources"""

    def compute_resources(self, experiment: "Experiment") -> Dict:
        default_resources = self.default_resources(experiment)

        if not self.resources() and default_resources is not None:
            return self.canonicalize_resources(default_resources)

        if self.resources() and not default_resources:
            resources = copy.deepcopy(self.resources())
            resources.pop("_inherit_defaults", None)
            return self.canonicalize_resources(resources)

        if self.resources() and default_resources:
            resources = copy.deepcopy(self.resources())
            if resources.pop("_inherit_defaults", True) is False:
                return self.canonicalize_resources(resources)

            # merge with default resources
            defaults = self.canonicalize_resources(default_resources)
            update = self.canonicalize_resources(resources)

            defaults_ = copy.deepcopy(defaults)
            update_ = copy.deepcopy(update)

            # apply removals (e.g. #remove_me)
            removals = [
                k
                for k in update.keys()
                if isinstance(k, str) and k.startswith("#")
            ]
            for removal in removals:
                defaults_.pop(removal[1:], None)
                update_.pop(removal, None)

            return update_dict(defaults_, update_)

        return {}

    def dispatch(self) -> "Execution":
        """Dispatches the execution"""
        if all(self.experiments.map(lambda x: x.is_finished())):
            return self

        # trigger configuration validation for early failure
        self.experiments.each(lambda x: x.config)

        if self.on_before_dispatch() is False:
            return False

        self.commit()

        results = self.on_dispatch()

        if not isinstance(results, (list, tuple)):
            results = [results]

        self.on_after_dispatch(results)

        return self

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch
        """
        # forward into experiment on_before_dispatch
        for experiment in self.experiments:
            experiment.on_before_dispatch()

    def on_after_dispatch(self, results: List[Any]) -> None:
        """Event triggered after the dispatch of an execution"""

    def on_dispatch(self) -> List[Any]:
        return [
            self.on_dispatch_experiment(experiment)
            for experiment in self.experiments
        ]

    def on_dispatch_experiment(self, experiment: "Experiment") -> Any:
        return experiment.dispatch()

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    @property
    def host_info(self) -> Optional[Dict]:
        return self.__model__.host_info

    def __str__(self) -> str:
        return self.__repr__()

    def __repr__(self) -> str:
        return "Execution"
