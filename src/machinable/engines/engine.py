import ast
import copy
import importlib

from ..core.exceptions import ExecutionException
from ..utils.dicts import update_dict
from ..utils.formatting import exception_to_str, msg
from ..utils.importing import resolve_instance
from ..utils.traits import Jsonable

_register = {
    "native": "machinable.engines.native_engine",
    "ray": "machinable.engines.ray_engine",
    "detached": "machinable.engines.detached_engine",
    "remote": "machinable.engines.remote_engine",
    "dry": "machinable.engines.dry_engine",
}

_latest = [None]


class Engine(Jsonable):
    @classmethod
    def latest(cls):
        return _latest[0]

    @classmethod
    def set_latest(cls, latest):
        _latest[0] = latest

    @staticmethod
    def register(engine, name=None):
        if name is None:
            name = engine.__name__
        _register[name] = engine

    @classmethod
    def create(cls, args):
        if isinstance(args, Engine):
            return args

        resolved = resolve_instance(args, Engine, "engines")
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

    def submit(self, execution):
        """Retrieves an execution instance for execution

        Must call execution.set_result() with result and
        return the execution instance

        # Arguments
        execution: machinable.Execution

        machinable.Execution object
        """
        for (
            index,
            (execution_type, component, components, storage, resources, args, kwargs,),
        ) in enumerate(execution.schedule.iterate(execution.storage)):
            result = self.process(
                execution_type, component, components, storage, resources, args, kwargs
            )
            execution.set_result(result, index)

        return execution

    def process(self, execution_type, *args, **kwargs):
        return getattr(self, execution_type)(*args, **kwargs)

    def storage_middleware(self, storage):
        return storage

    def log(self, text, level="info"):
        msg("Engine: " + text, level, color="blue")

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return "machinable.Engine"

    def execute(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        return ExecutionException(
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
        return ExecutionException(
            reason="unsupported",
            message="The engine does not support tuning operations",
        )
