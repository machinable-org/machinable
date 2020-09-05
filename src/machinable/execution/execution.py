import ast
import os
import inspect
from datetime import datetime as dt
from typing import Any, Callable, Union

import pendulum
import yaml

from expandvars import expand
from ..config.interface import ConfigInterface, mapped_config
from ..core.exceptions import ExecutionException
from ..core.settings import get_settings
from ..config.mapping import config_map
from ..engine import Engine
from ..execution.schedule import Schedule
from ..experiment.experiment import Experiment
from ..experiment.parser import parse_experiment
from ..filesystem import open_fs
from ..index import Index
from ..project import Project
from ..project.export import Export
from ..registration import Registration
from ..storage import Storage
from ..storage.experiment import StorageExperiment
from ..utils.dicts import update_dict
from ..utils.formatting import exception_to_str, msg
from ..utils.host import get_host_info
from ..utils.identifiers import (
    decode_experiment_id,
    encode_experiment_id,
    generate_experiment_id,
)
from ..utils.importing import resolve_instance
from ..utils.traits import Jsonable


def to_color(experiment_id):
    return "".join(
        [encode_experiment_id(decode_experiment_id(c) % 16) for c in experiment_id]
    )


_latest = [None]


class Execution(Jsonable):
    def __init__(
        self,
        experiment: Union[Experiment, Any],
        storage: Union[dict, str] = None,
        engine: Union[Engine, str, dict, None] = None,
        index: Union[Index, str, dict, None] = None,
        project: Union[Project, Callable, str, dict] = None,
        seed: Union[int, None, str] = None,
    ):
        self.function = None

        self.experiment = None
        self.storage = Storage()
        self.engine = None
        self.index = None
        self.project = None
        self.seed = None

        self.timestamp = None
        self.schedule = Schedule()
        self.code_backup = None
        self.code_version = None
        self.started_at = None

        if not isinstance(experiment, Experiment) and (
            inspect.isclass(experiment) or callable(experiment)
        ):
            # decorator use
            if None not in (storage, engine, index, project, seed):
                raise ValueError(
                    "Execution decorator takes no arguments; "
                    "call the decorated object with arguments instead."
                )
            self.function = experiment
            return

        self.set_project(project)
        self.set_storage(storage)
        self.set_experiment(experiment)
        self.set_engine(engine)
        self.set_index(index)
        self.set_seed(seed)

        self._behavior = {"raise_exceptions": False}
        self.failures = 0

    def __call__(
        self, experiment, storage=None, engine=None, index=None, project=None, seed=None
    ):
        self.set_project(project)
        self.set_storage(storage)
        self.set_experiment(experiment)
        self.set_engine(engine)
        self.set_index(index)
        self.set_seed(seed)
        if self.function is not None:
            # decorator invocation
            self.project.default_component = self.function
            return self

    @classmethod
    def latest(cls):
        return _latest[0]

    @classmethod
    def set_latest(cls, latest):
        _latest[0] = latest

    @classmethod
    def create(self, args):
        if isinstance(args, Execution):
            return args

        if args is None:
            return Execution()

        resolved = resolve_instance(args, Execution, "executions")
        if resolved is not None:
            return resolved

        if isinstance(args, dict):
            return Execution(**args)

        if isinstance(args, (list, tuple)):
            return Execution(*args)

        raise ValueError(f"Invalid argument: {args}")

    def set_experiment(self, experiment):
        self.experiment = Experiment.create(experiment)

        return self

    def set_storage(self, storage):
        if storage is None:
            storage = get_settings()["default_storage"]

        self.storage = Storage.create(storage)

        return self

    def set_engine(self, engine):
        if engine is None:
            engine = get_settings()["default_engine"]

        self.engine = Engine.create(engine)

        return self

    def set_index(self, index):
        if index is None:
            index = get_settings()["default_index"]

        self.index = Index.get(index)

        return self

    def set_project(self, project):
        self.project = Project.create(project)

        return self

    def set_seed(self, seed):
        if isinstance(seed, str):
            seed = decode_experiment_id(seed, or_fail=True)
        elif isinstance(seed, int):
            seed = generate_experiment_id(random_state=seed, with_encoding=False)
        else:
            seed = generate_experiment_id(with_encoding=False)

        self.seed = seed

        self.schedule.set_seed(seed)

        return self

    def set_schedule(self, schedule=None):
        if schedule is not None:
            self.schedule = schedule
            return self

        self.schedule = Schedule(seed=self.seed)

        config = ConfigInterface(
            self.project.parse_config(),
            self.experiment.specification["version"],
            default_class=self.project.default_component,
        )

        for index, (node, components, resources) in enumerate(
            parse_experiment(self.experiment, seed=self.seed)
        ):
            component_config, components_config = config.get(node, components)

            # compute resources
            if isinstance(self.engine, Engine) and not self.engine.supports_resources():
                if resources is not None:
                    msg(
                        "Engine does not support resource specification. Skipping ...",
                        level="warn",
                        color="header",
                    )
                    resources = None
            elif callable(resources):
                resources = resources(
                    engine=self.engine,
                    component=mapped_config(component_config),
                    components=[
                        mapped_config(component) for component in components_config
                    ],
                )
            elif resources is None:
                resources = Registration.get().default_resources(
                    engine=self.engine,
                    component=mapped_config(component_config),
                    components=[
                        mapped_config(component) for component in components_config
                    ],
                )

            if "tune" in self.experiment.specification:
                self.schedule.add_tune(
                    component=component_config,
                    components=components_config,
                    resources=resources,
                    **self.experiment.specification["tune"]["arguments"],
                )
            else:
                self.schedule.add_execute(
                    component=component_config,
                    components=components_config,
                    resources=resources,
                )

        return self

    def set_checkpoint(self, checkpoint):
        def transformation(i, component, element):
            element[1]["flags"]["CHECKPOINT"] = checkpoint
            return element

        self.schedule.transform(transformation)

        return self

    def set_version(self, config=None):
        if isinstance(config, str):
            config = ast.literal_eval(config)
        elif callable(config):
            self.schedule.transform(config)
            return self

        if not isinstance(config, dict):
            raise ValueError("Version must be a dictionary or callable")

        def transformation(i, component, element):
            element[1]["args"] = update_dict(element[1]["args"], config)
            return element

        self.schedule.transform(transformation)

        return self

    def set_behavior(self, **settings):
        unknown_options = set(settings.keys()) - {"raise_exceptions"}
        if len(unknown_options) > 0:
            raise ValueError(f"Invalid options: {unknown_options}")
        self._behavior.update(settings)

    def is_submitted(self):
        try:
            with open_fs(self.storage.config["url"]) as filesystem:
                return filesystem.isdir(
                    os.path.join(self.storage.config["directory"], self.experiment_id)
                )
        except (FileNotFoundError, AttributeError, KeyError, TypeError, ValueError):
            pass
        return False

    def submit(self):
        if Registration.get().on_before_submit(self) is False:
            return False

        self.failures = 0
        self.storage.config["experiment"] = self.experiment_id

        # expand variables in storage directory
        if isinstance(self.storage.config["directory"], str):
            # % variables
            variables = dict()
            try:
                variables["PROJECT"] = self.project.name if self.project else None
            except (KeyError, ValueError):
                variables["PROJECT"] = None

            variables["EXPERIMENT"] = (
                self.experiment.specification["name"] if self.experiment else ""
            )

            self.storage.config["directory"] = expand(
                self.storage.config["directory"], environ=variables, var_symbol="&"
            )
            # strftime variables
            try:
                self.storage.config["directory"] = dt.now().strftime(
                    self.storage.config["directory"]
                )
            except ValueError:
                pass
            self.storage.config["directory"] = self.storage.config["directory"].strip(
                "/"
            )

        # check if URL is an existing experiment
        derived_from = None
        try:
            with open_fs(self.storage.config["url"]) as filesystem:
                experiment_id = filesystem.load_file("execution.json")["experiment_id"]
                # register URL as parent storage and rewrite to experiments/ subdirectory
                self.storage.config["ancestor"] = {
                    "url": self.storage.config["url"],
                    "experiment": experiment_id,
                }
                self.storage.config["url"] = os.path.join(
                    self.storage.config["url"], "experiments"
                )
                derived_from = self.storage.config["ancestor"]["url"]
        except (ValueError, KeyError, FileNotFoundError):
            pass

        is_submitted = self.is_submitted()
        if not is_submitted:
            if len(self.schedule) == 0:
                self.set_schedule()

            def set_derived_from_flag(i, component, element):
                element[1]["flags"]["DERIVED_FROM_STORAGE"] = derived_from
                return element

            self.schedule.transform(set_derived_from_flag)
            storage = self.engine.storage_middleware(self.storage.config)

            now = pendulum.now()
            self.timestamp = now.timestamp()
            self.started_at = str(now)
            # do not backup on mem:// filesystem unless explicitly set to True
            code_backup = self.code_backup
            if code_backup is None and not self.storage.config["url"].startswith(
                "mem://"
            ):
                code_backup = True

            # collect and write execution data
            url = os.path.join(
                storage.get("url", "mem://"),
                storage.get("directory", ""),
                storage["experiment"],
            )
            data = {
                "code.json": {
                    "resolvers": {
                        "experiment": getattr(
                            self.experiment, "_resolved_by_expression", None
                        ),
                        "storage": getattr(
                            self.storage, "_resolved_by_expression", None
                        ),
                        "engine": getattr(self.engine, "_resolved_by_expression", None),
                    },
                    "code_backup": code_backup,
                    "code_version": self.project.get_code_version(),
                },
                "code.diff": self.project.get_diff(),
                "execution.json": self.serialize(),
                "schedule.json": self.schedule.serialize(),
                "host.json": get_host_info(),
            }

            with open_fs({"url": url, "create": True}) as filesystem:
                if code_backup:
                    self.project.backup_source_code(opener=filesystem.open)

                for k, v in data.items():
                    filesystem.save_file(name=k, data=v)

            self.index.add(StorageExperiment(url, data))

        Registration.get().on_submit(self, is_submitted)

        return self.engine.submit(self)

    def set_result(self, result, index=None):
        if index is None:
            index = len(self.schedule._result)
        if isinstance(result, ExecutionException):
            self.failures += 1
            if self._behavior["raise_exceptions"]:
                raise result
            self.engine.log(
                f"Submission {self.components[index]} of experiment {self.experiment_id} failed "
                f"({index + 1}/{len(self.schedule)}). "
                f"{exception_to_str(result)}",
                level="error",
            )
        else:
            self.engine.log(
                f"Submission {self.components[index]} of experiment {self.experiment_id} complete "
                f"({index + 1}/{len(self.schedule)}). ",
                level="info",
            )
        self.schedule.set_result(result, index)

    @classmethod
    def from_storage(cls, url):
        with open_fs(url) as filesystem:
            serialized = filesystem.load_file("execution.json")
        execution = cls.from_json(serialized)
        schedule = filesystem.load_file("schedule.json", default=None)
        if schedule:
            execution.set_schedule(Schedule.from_json(schedule))
        return execution

    def export(self, path=None, overwrite=False):
        """Exports the execution

        Converts the execution into a plain Python project
        that can be executed without machinable.

        ::: warning
        This feature may not work reliably in all circumstances and project use cases
        :::

        # Arguments
        path: String, directory where exported execution will be stored. If None defaults to 'exports' in the
            current working directory
        overwrite: Boolean, whether to overwrite an existing export.
        """
        if path is None:
            path = os.path.join(os.getcwd(), "exports")

        if len(self.schedule) == 0:
            self.set_schedule()

        for (
            index,
            (execution_type, component, components, resources, args, kwargs),
        ) in enumerate(self.schedule):
            if execution_type != "execute":
                msg("Not supported", level="error", color="fail")
                continue

            # if more than one job, write into subdirectories
            if len(self.schedule) > 1:
                path = os.path.join(path, str(index))

            export_path = os.path.abspath(path)

            if os.path.exists(export_path) and not overwrite:
                raise FileExistsError(
                    f"Export directory '{export_path}' exists. To overwrite, set overwrite=True"
                )

            msg(f"\nExporting to {export_path}", color="yellow")

            export = Export(self.project.directory_path, export_path)

            # instantiate targets
            nd = component["class"](config=component["args"], flags=component["flags"])
            comps = [
                c["class"](config=c["args"], flags=c["flags"], node=nd)
                for c in components
            ]

            def get_class_name(cls):
                try:
                    return cls.__name__
                except AttributeError:
                    return cls.name()

            # export config
            export.write(
                "config.json",
                {
                    "component": {
                        "args": nd.config.toDict(evaluate=True),
                        "flags": nd.flags.toDict(evaluate=True),
                    },
                    "components": [
                        {
                            "args": comps[i].config.toDict(evaluate=True),
                            "flags": comps[i].flags.toDict(evaluate=True),
                            "class": get_class_name(components[i]["class"]),
                        }
                        for i in range(len(comps))
                    ],
                    "storage": {"url": "./results"},
                },
                meta=True,
            )

            # export components and node
            export.module(component["class"])
            for c in components:
                export.module(c["class"])

            # export mixins
            mixins = component["args"].get("_mixins_", [])
            for c in components:
                mixins.extend(c["args"].get("_mixins_", []))
            for mixin in mixins:
                export.module(
                    mixin["origin"].replace("+.", "vendor."), from_module_path=True
                )

            export.write("__init__.py")

            export.machinable()

            export.entry_point(component, components)

            export.echo()

            msg(
                f"\nExporting finished. Run as 'cd {export_path} && python run.py'",
                color="yellow",
            )

    def serialize(self):
        return {
            "experiment_id": self.experiment_id,
            "seed": self.seed,
            "timestamp": self.timestamp,
            "started_at": self.started_at,
            "components": self.components,
        }

    @classmethod
    def unserialize(cls, serialized):
        if not isinstance(serialized, dict):
            raise ValueError(f"Invalid execution: {serialized}")
        execution = cls(None)
        execution.seed = serialized["seed"]
        execution.timestamp = serialized["timestamp"]
        execution.started_at = serialized["started_at"]
        return execution

    @property
    def unique_id(self):
        return self.experiment_id + "_" + self.components[0]

    @property
    def experiment_id(self):
        return encode_experiment_id(self.seed)

    def summary(self):
        if len(self.schedule) == 0:
            self.set_schedule()

        msg(
            f"\nExecution: {self.experiment_id}\n----------", color="header",
        )
        msg(
            f"Storage: {self.storage}", color="blue",
        )
        msg(f"Engine: {repr(self.engine)}", color="blue")
        msg(f"Index: {repr(self.index)}", color="blue")
        msg(f"Project: {repr(self.project)}", color="blue")

        for (
            index,
            (execution_type, component, components, resources, args, kwargs),
        ) in enumerate(self.schedule):
            # only print first and last one
            shortened = len(self.schedule) > 3 and 0 < index < len(self.schedule) - 1
            if shortened:
                if index == 1:
                    msg(
                        f"[ + {len(self.schedule) - 2} other experiments ]",
                        color="header",
                    )
                continue

            msg(
                f"\n{self.components[index]} ({index + 1}/{len(self.schedule)})",
                color="header",
            )

            msg(f"\nComponent: {component['name']}", color="yellow")
            msg(f":: {component['flags']}")
            if len(component["versions"]) > 0:
                msg(f">> {', '.join(component['versions'])}", color="green")
            msg(yaml.dump(component["args"]), color="blue")

            for c in components:
                if c:
                    msg(f"\t {c['name']}", color="yellow")
                    msg(f"\t:: {c['flags']}")
                    if len(c["versions"]) > 0:
                        msg(f"\t>> {', '.join(c['versions'])}", color="green")
                    msg("\t" + yaml.dump(c["args"]), color="blue")

        return self

    def filter(self, callback=None):
        self.schedule.filter(callback)

    @property
    def components(self):
        return self.schedule.components

    def __repr__(self):
        experiment_id = self.experiment_id if isinstance(self.seed, int) else "None"
        return f"Execution <{experiment_id}> ({self.storage})"

    def __str__(self):
        return self.__repr__()
