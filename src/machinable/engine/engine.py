from typing import List, Union

import machinable.errors
from machinable.component import Component


class Engine(Component):
    @staticmethod
    def supports_resources():
        return True

    def canonicalize_resources(self, resources):
        return resources

    def dispatch(self, execution: "Execution"):
        from machinable.execution import Execution

        if self.on_before_dispatch(execution) is False:
            return False

        executions = self._dispatch(execution)

        if not isinstance(executions, (list, tuple)):
            executions = [executions]

        executions = [
            e
            for e in executions
            if isinstance(e, Execution) and e is not execution
        ]

        self.on_after_dispatch(executions)

        # derived execution
        for e in executions:
            self.dispatch(e)

    def on_before_dispatch(self, execution):
        """Event triggered before engine dispatch of an execution

        Return False to prevent the dispatch

        # Arguments
        execution: machinable.Execution object
        """

    def on_after_dispatch(self, executions: List["Execution"]):
        """Event triggered after the dispatch of an execution

        # Arguments
        execution: machinable.Execution object
        """

    def _dispatch(self, execution):
        """Retrieves an execution instance for execution

        Must call execution.set_result() with result and
        return the execution instance

        # Arguments
        execution: machinable.Execution

        machinable.Execution object
        """
        for experiment in execution.experiments:
            self._dispatch_experiment(experiment)

    def _dispatch_experiment(self, experiment):
        # CORE EXEC
        # todo: re-connect to storage
        # Element.__storage__ = experiment.__storage__
        # todo: set env variables
        #
        from machinable.component.component import Component

        component = ModuleClass(
            module_name=experiment.components[0]["module"], baseclass=Component
        )(experiment=experiment)
        component.dispatch()

    def on_before_storage_creation(self, execution):
        pass

    def log(self, text, level="info"):
        msg("[Engine] " + text, level, color="header")

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "Engine"

    def execute(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        return machinable.errors.ExecutionFailed(
            reason="unsupported",
            message="The engine does not support execution operations",
        )

    def tune(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        return machinable.errors.ExecutionFailed(
            reason="unsupported",
            message="The engine does not support tuning operations",
        )
