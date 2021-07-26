from typing import TYPE_CHECKING, Any, Dict, List, Optional

import copy
import os

from machinable.component import Component
from machinable.utils import timestamp_to_directory, update_dict

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.experiment import Experiment


class Engine(Component):
    @classmethod
    def local(cls, processes: Optional[int] = None) -> "Engine":
        return cls.make(
            "machinable.engine.local_engine",
            version={"processes": processes},
        )

    @property
    def execution(self) -> Optional["Execution"]:
        return self.element

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def resources(self, experiment: "Experiment") -> Dict:
        try:
            default_resources = experiment.interface().default_resources(
                engine=self
            )
        except AttributeError:
            default_resources = None

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

    def dispatch(self) -> Any:
        if self.on_before_dispatch() is False:
            return False

        results = self._dispatch()

        if not isinstance(results, (list, tuple)):
            results = [results]

        self.on_after_dispatch(results)

        return results

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch
        """

    def on_after_dispatch(self, results: List[Any]) -> None:
        """Event triggered after the dispatch of an execution"""

    def _dispatch(self) -> List[Any]:
        return [
            self._dispatch_experiment(experiment)
            for experiment in self.execution.experiments
        ]

    def _dispatch_experiment(self, experiment: "Experiment") -> Any:
        return experiment.interface().dispatch()

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "Engine"
