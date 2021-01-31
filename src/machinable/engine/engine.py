from typing import List, Union

import ast
import copy
import importlib

import machinable.errors
from machinable.element.element import Element
from machinable.utils.dicts import update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.importing import ModuleClass, resolve_instance
from machinable.utils.system import set_process_title
from machinable.utils.traits import Discoverable, Jsonable

_register = {
    "native": "machinable.engine.native_engine",
    "ray": "machinable.engine.ray_engine",
    "detached": "machinable.engine.detached_engine",
    "remote": "machinable.engine.remote_engine",
    "dry": "machinable.engine.dry_engine",
    "slurm": "machinable.engine.slurm_engine",
}


class Engine(Element, Discoverable):
    @staticmethod
    def register(engine, name=None):
        if name is None:
            name = engine.__name__
        _register[name] = engine

    @classmethod
    def make(cls, args):
        if isinstance(args, Engine):
            return args

        resolved = resolve_instance(args, Engine, "_machinable.engines")
        if resolved is not None:
            return resolved

        if isinstance(args, dict):
            args = copy.deepcopy(args)

        if isinstance(args, str):
            args = {"type": args}

        if args is None:
            args = {"type": "native"}

        engine = args.pop("type")

        arg = []
        if engine.find(":") != -1:
            engine, version = engine.split(":", maxsplit=1)
            try:
                options = ast.literal_eval(version)
            except ValueError:
                options = version
            if isinstance(options, dict):
                args = update_dict(args, options)
            elif isinstance(options, (list, tuple)):
                arg.extend(options)
            else:
                arg.append(options)

        try:
            if isinstance(_register[engine], str):
                engine_module = importlib.import_module(_register[engine])
                class_name_snake = _register[engine].split(".")[-1]
                class_name = "".join(
                    p.capitalize() for p in class_name_snake.split("_")
                )
                _register[engine] = getattr(engine_module, class_name)
        except KeyError:
            raise ValueError(f"Unknown engine: {engine}.")
        except ImportError as ex:
            raise ValueError(f"Engine import failed: {exception_to_str(ex)}")
        except AttributeError:
            raise ValueError(f"Engine could not be found.")

        return _register[engine](*arg, **args)

    @classmethod
    def unserialize(cls, serialized):
        return cls.create(serialized)

    @staticmethod
    def supports_resources():
        return True

    def canonicalize_resources(self, resources):
        return resources

    def dispatch(self, execution: "Execution"):
        from machinable.execution.execution import Execution

        if self.on_before_dispatch(execution) is False:
            return False

        set_process_title(repr(execution))
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
            self.process(experiment)

        return
        for (
            index,
            execution_type,
            component,
            components,
            storage,
            resources,
            args,
            kwargs,
        ) in execution.schedule.iterate(execution.storage.config):
            i, result = self.process(
                index,
                execution_type,
                component,
                components,
                storage,
                resources,
                args,
                kwargs,
            )
            # execution.set_result(result, i)

        # return execution

    def process(self, experiment):
        # CORE EXEC
        # todo: re-connect to storage
        # Element.__storage__ = experiment.__storage__
        # todo: set env variables
        #
        from machinable.component.component import Component

        component = ModuleClass(
            module_name=experiment.spec["module"], baseclass=Component
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
