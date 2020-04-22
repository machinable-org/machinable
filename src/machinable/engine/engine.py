import ast
from .promise import Promise
from ..utils.dicts import update_dict


class Engine:
    @classmethod
    def create(cls, args):
        if isinstance(args, Engine):
            return args

        if isinstance(args, str):
            args = {"type": args}

        if args is None:
            args = {"type": "local"}

        engine = args.pop("type")

        arg = []
        if engine.find(":") != -1:
            engine, version = engine.split(":", maxsplit=1)
            options = ast.literal_eval(version)
            if isinstance(options, dict):
                args = update_dict(args, options)
            elif isinstance(options, (list, tuple)):
                arg.extend(options)
            else:
                arg.append(options)

        if engine == "local":
            from .local_engine import LocalEngine as _Engine
        elif engine.startswith("ray"):
            from .ray_engine import RayEngine as _Engine
        else:
            raise ValueError(
                f"Invalid engine type: {engine}. Available: 'local', 'ray'"
            )

        return _Engine(*arg, **args)

    def submit(self, component, children, observer, resources):
        promise = Promise(component, children, observer, resources)
        self.execute(promise)

    def msg(self, message):
        print(message)

    def __str__(self):
        return self.__repr__()

    # abstract methods

    def __repr__(self):
        return "machinable.Engine"

    def init(self):
        raise NotImplementedError

    def join(self):
        raise NotImplementedError

    def shutdown(self):
        raise NotImplementedError

    def execute(self, promise: Promise):
        raise NotImplementedError

    def tune(
        self,
        component,
        components=None,
        store=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        raise NotImplementedError("This engine does not support tuning operations.")
