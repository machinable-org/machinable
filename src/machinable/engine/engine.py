from typing import TYPE_CHECKING, Any, List, Union

from machinable.component import Component

if TYPE_CHECKING:
    from machinable.execution import Execution


class Engine(Component):
    def canonicalize_resources(self, resources):
        return resources

    def dispatch(self, execution: "Execution"):
        from machinable.execution import Execution

        if self.on_before_dispatch(execution) is False:
            return False

        results = self._dispatch(execution)

        if not isinstance(results, (list, tuple)):
            results = [results]

        executions = [
            result
            for result in results
            if isinstance(result, Execution) and result is not execution
        ]

        self.on_after_dispatch(results, executions)

        # derived execution
        for derived_execution in executions:
            self.dispatch(derived_execution)

    def on_before_dispatch(self, execution: "Execution"):
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch

        # Arguments
        execution: machinable.Execution object
        """

    def on_after_dispatch(
        self, results: List[Any], executions: List["Execution"]
    ):
        """Event triggered after the dispatch of an execution

        # Arguments
        execution: machinable.Execution object
        """

    def _dispatch(self, execution: "Execution"):
        return [
            self._dispatch_experiment(experiment)
            for experiment in execution.experiments
        ]

    def _dispatch_experiment(self, experiment):
        return experiment.interface().dispatch(experiment)

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "Engine"
