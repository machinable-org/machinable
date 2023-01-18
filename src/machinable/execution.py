from typing import Any, Dict, List, Optional, Union

import copy

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.element import (
    Element,
    defaultversion,
    extract,
    get_lineage,
    has_many,
    has_one,
)
from machinable.errors import ExecutionFailed
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.schedule import Schedule
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import VersionType
from machinable.utils import sentinel, update_dict


class Execution(Element):
    kind = "Execution"
    default = get_settings().default_execution

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        schedule: Union[
            Schedule, VersionType
        ] = get_settings().default_schedule,
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
        if schedule is not None:
            if not isinstance(schedule, Schedule):
                schedule = Schedule.get(*extract(schedule))
            self.__related__["schedule"] = schedule

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

    @has_one
    def schedule() -> "Schedule":
        return Schedule

    @has_many
    def experiments() -> ExperimentCollection:
        return Experiment, ExperimentCollection

    def add(
        self,
        experiment: Union[Experiment, List[Experiment]],
        once: bool = False,
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.add(_experiment)
            return self

        self.__related__.setdefault("experiments", ExperimentCollection())

        if once and self.__related__["experiments"].contains(
            lambda x: x == experiment
        ):
            # already added
            return self

        self.__related__["experiments"].append(experiment)

        return self

    def commit(self) -> "Execution":
        Storage.get().commit(experiments=self.experiments, execution=self)

        return self

    def resources(self, resources: Dict = sentinel) -> Optional[Dict]:
        if resources is sentinel:
            return self.__model__.resources

        self.__model__.resources = resources

        return self.__model__.resources

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def default_resources(self, experiment: "Experiment") -> Optional[dict]:
        """Default resources"""

    def compute_resources(self, experiment: "Experiment") -> Dict:
        default_resources = self.default_resources(experiment)

        if not self.__model__.resources and default_resources is not None:
            return self.canonicalize_resources(default_resources)

        if self.__model__.resources and not default_resources:
            resources = copy.deepcopy(self.__model__.resources)
            resources.pop("_inherit_defaults", None)
            return self.canonicalize_resources(resources)

        if self.__model__.resources and default_resources:
            resources = copy.deepcopy(self.__model__.resources)
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

    def __call__(self) -> None:
        if not self.experiments:
            return

        if Execution.is_connected() and self.schedule is not None:
            # leave execution to connected scheduler
            return

        if all(self.experiments.map(lambda x: x.is_finished())):
            return

        self.dispatch()

    def dispatch(self) -> "Execution":
        if not self.experiments:
            return self

        if self.on_before_dispatch() is False:
            return self

        # trigger configuration validation for early failure
        self.experiments.each(lambda x: x.config)

        if self.on_before_commit() is False:
            return self

        self.commit()

        try:
            # compute resources
            for experiment in self.experiments.filter(
                lambda e: not e.is_finished()
            ):
                self.save_file(
                    f"resources-{experiment.experiment_id}.json",
                    self.compute_resources(experiment),
                )
            self.on_dispatch()
            self.on_after_dispatch()
        except BaseException as _ex:  # pylint: disable=broad-except
            raise ExecutionFailed("Execution failed") from _ex

        return self

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before dispatch of an execution

        Return False to prevent the dispatch
        """
        # forward into experiment on_before_dispatch
        for experiment in self.experiments:
            experiment.on_before_dispatch()

    def on_before_commit(self) -> Optional[bool]:
        """Event triggered before commit of an execution

        Return False to prevent the commit
        """
        # forward into experiment on_before_commit
        for experiment in self.experiments:
            experiment.on_before_commit()

    def on_after_dispatch(self) -> None:
        """Event triggered after the dispatch of an execution"""

    def on_dispatch(self):
        for experiment in self.experiments:
            experiment()

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    @property
    def host_info(self) -> Optional[Dict]:
        return self.__model__.host_info

    @property
    def env_info(self) -> Optional[Dict]:
        return self.load_file("env.json", None)

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

    def __exit__(self, *args, **kwargs):
        if self.schedule is not None:
            self.dispatch()

        super().__exit__()

    def __str__(self) -> str:
        return self.__repr__()

    def __repr__(self) -> str:
        return "Execution"

    def __eq__(self, other):
        return (
            self.nickname == other.nickname
            and self.timestamp == other.timestamp
        )

    def __ne__(self, other):
        return (
            self.nickname != other.nickname or self.timestamp != other.timestamp
        )
