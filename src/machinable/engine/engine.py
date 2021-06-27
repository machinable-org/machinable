from typing import TYPE_CHECKING, Any, List, Optional

from machinable.component import Component

if TYPE_CHECKING:
    from machinable.execution import Execution


class Engine(Component):
    @property
    def execution(self) -> Optional["Execution"]:
        return self.element

    def canonicalize_resources(self, resources):
        return resources

    def dispatch(self):
        if self.on_before_dispatch() is False:
            return False

        results = self._dispatch()

        if not isinstance(results, (list, tuple)):
            results = [results]

        self.on_after_dispatch(results)

        return results

    def on_before_dispatch(self):
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch

        # Arguments
        execution: machinable.Execution object
        """

    def on_after_dispatch(self, results: List[Any]):
        """Event triggered after the dispatch of an execution"""

    def _dispatch(self) -> List[Any]:
        return [
            self._dispatch_experiment(experiment)
            for experiment in self.execution.experiments
        ]

    def _dispatch_experiment(self, experiment):
        return experiment.interface().dispatch()

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "Engine"
