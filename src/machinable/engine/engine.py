import ast
import copy
import importlib

from ..core.exceptions import ExecutionException
from ..utils.dicts import update_dict
from ..utils.formatting import exception_to_str, msg
from ..utils.importing import resolve_instance
from ..utils.system import set_process_title
from ..utils.traits import Jsonable

_register = {
    "native": "machinable.engine.native_engine",
    "ray": "machinable.engine.ray_engine",
    "detached": "machinable.engine.detached_engine",
    "remote": "machinable.engine.remote_engine",
    "dry": "machinable.engine.dry_engine",
    "slurm": "machinable.engine.slurm_engine",
}

_latest = [None]


class Engine(Jsonable):
    def __new__(cls, *args, **kwargs):
        # Engine is an abstract class for which instantiation is meaningless.
        # Instead, we return the default NativeEngine
        if cls is Engine:
            from .native_engine import NativeEngine

            return super().__new__(NativeEngine)

        return super().__new__(cls)

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

    @staticmethod
    def supports_resources():
        return True

    def canonicalize_resources(self, resources):
        return resources

    def submit(self, execution):
        """Retrieves an execution instance for execution

        Must call execution.set_result() with result and
        return the execution instance

        # Arguments
        execution: machinable.Execution

        machinable.Execution object
        """
        set_process_title(repr(execution))
        return self._submit(execution)

    def _submit(self, execution):
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
            execution.set_result(result, i)

        return execution

    def process(self, index, execution_type, *args, **kwargs):
        return index, getattr(self, execution_type)(*args, **kwargs)

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
