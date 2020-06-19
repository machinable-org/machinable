import copy
import os
from datetime import datetime as dt
from typing import Any, Callable, Union

import fs
import pendulum
import yaml

from ..config.interface import ConfigInterface
from ..core.exceptions import ExecutionException
from ..core.settings import get_settings
from ..engines import Engine
from ..execution.identifiers import generate_component_id
from ..execution.schedule import Schedule
from ..experiment.experiment import Experiment
from ..experiment.parser import parse_experiment
from ..filesystem import open_fs
from ..project import Project
from ..project.export import Export
from ..registration import Registration
from ..utils.formatting import exception_to_str, msg
from ..utils.host import get_host_info
from ..utils.traits import Jsonable
from .identifiers import (
    decode_experiment_id,
    encode_experiment_id,
    generate_experiment_id,
)


def to_color(experiment_id):
    return "".join(
        [encode_experiment_id(decode_experiment_id(c) % 16) for c in experiment_id]
    )


class Execution(Jsonable):
    def __init__(
        self,
        experiment: Union[Experiment, Any],
        storage: Union[dict, str] = None,
        engine: Union[Engine, str, dict, None] = None,
        project: Union[Project, Callable, str, dict] = None,
        seed: Union[int, None, str] = None,
    ):
        self._components = None
        self._components_cache = None
        self.function = None

        self.experiment = None
        self.storage = None
        self.engine = None
        self.project = None
        self.seed = None

        self.timestamp = None
        self.schedule = Schedule()
        self.code_backup = None
        self.code_version = None
        self.started_at = None

        if callable(experiment):
            # decorator use
            if None not in (storage, engine, project, seed):
                raise ValueError(
                    "Execution decorator takes no arguments; "
                    "call the decorated function with arguments instead."
                )
            self.function = experiment
            return

        self.set_project(project)
        self.set_storage(storage)
        self.set_experiment(experiment)
        self.set_engine(engine)
        self.set_seed(seed)

    def __call__(self, experiment, storage=None, engine=None, project=None, seed=None):
        self.set_storage(storage)
        self.set_experiment(experiment)
        self.set_engine(engine)
        self.set_project(project)
        self.set_seed(seed)
        if self.function is not None:
            # decorator invocation
            self.project.default_component = self.function
            return self

    def set_experiment(self, experiment):
        self.experiment = Experiment.create(experiment)

        # compute experiment directory
        experiment_directory = self.experiment.specification.get("directory", None)
        if experiment_directory is None:
            experiment_directory = Registration.get().experiment_directory
        if callable(experiment_directory):
            experiment_directory = experiment_directory()
            if experiment_directory is True:
                # use default value
                experiment_directory = "&PROJECT/&MODULE"
        if isinstance(experiment_directory, str):
            # replace magic variables
            project_name = self.project.name if self.project else ""
            experiment_directory = experiment_directory.replace(
                "&PROJECT", project_name
            )
            module_name = (
                self.experiment._resolved_module_origin
                if hasattr(self.experiment, "_resolved_module_origin")
                else ""
            )
            experiment_directory = experiment_directory.replace("&MODULE", module_name)
            try:
                experiment_directory = dt.now().strftime(experiment_directory)
            except ValueError:
                pass
            self.storage["directory"] = experiment_directory.strip("/")

        return self

    def set_storage(self, storage):
        if storage is None:
            storage = get_settings()["default_storage"]

        if isinstance(storage, dict):
            storage = copy.deepcopy(storage)
        elif isinstance(storage, str):
            storage = {"url": storage}
        else:
            storage = {}

        self.storage = storage

        return self

    def set_engine(self, engine):
        if engine is None:
            engine = get_settings()["default_engine"]

        self.engine = Engine.create(engine)

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

        return self

    def set_schedule(self, schedule=None):
        if schedule is not None:
            self.schedule = schedule
            return self

        self.schedule = Schedule()

        config = ConfigInterface(
            self.project.parse_config(),
            self.experiment.specification["version"],
            default_class=self.project.default_component,
        )

        for index, (node, components, resources) in enumerate(
            parse_experiment(self.experiment, seed=self.seed)
        ):
            node_config, components_config = config.get(node, components)

            # compute resources
            if callable(resources):
                resources = config.call_with_context(
                    resources, node_config, components_config
                )

            if "tune" in self.experiment.specification:
                self.schedule.add_tune(
                    component=node_config,
                    components=components_config,
                    resources=resources,
                    **self.experiment.specification["tune"]["arguments"],
                )
            else:
                self.schedule.add_execute(
                    component=node_config,
                    components=components_config,
                    resources=resources,
                )

        return self

    @property
    def components(self):
        if self.seed is None:
            return []

        if self._components is None or self._components_cache != self.seed:
            self._components = generate_component_id(
                k=len(self.schedule), random_state=self.seed
            )
            self._components_cache = self.seed

        return self._components

    def is_submitted(self):
        try:
            storage = fs.open_fs(
                os.path.join(self.storage["url"], self.storage.get("directory", "")),
                create=False,
            )
            return storage.isdir(self.experiment_id)
        except (
            AttributeError,
            KeyError,
            TypeError,
            ValueError,
            fs.errors.ResourceNotFound,
            fs.errors.CreateFailed,
        ):
            pass
        return False

    def filter(self, callback=None):
        filtered = [
            args[0]
            for args in zip(
                range(len(self.components)), self.components, self.schedule.serialize(),
            )
            if callback(*args)
        ]
        self.schedule.filter(lambda i, _: i in filtered)

    def submit(self):
        self.storage["experiment"] = self.experiment_id

        if not self.is_submitted():
            if len(self.schedule) == 0:
                self.set_schedule()
            now = pendulum.now()
            self.timestamp = now.timestamp()
            self.started_at = str(now)
            # do not backup on mem:// filesystem unless explicitly set to True
            code_backup = self.code_backup
            if code_backup is None and not self.storage.get("url", "mem://").startswith(
                "mem://"
            ):
                code_backup = True

            storage = self.engine.storage_middleware(self.storage)

            with open_fs(
                {
                    "url": os.path.join(
                        storage.get("url", "mem://"),
                        storage.get("directory", ""),
                        storage["experiment"],
                    ),
                    "create": True,
                }
            ) as filesystem:

                if code_backup:
                    self.project.backup_source_code(opener=filesystem.open)

                self.code_version = self.project.get_code_version()

                filesystem.save_file("execution.json", self.serialize())
                filesystem.save_file("schedule.json", self.schedule.serialize())
                filesystem.save_file("host.json", get_host_info())

        return self.engine.submit(self)

    def set_result(self, result, index=None):
        if index is None:
            index = len(self.schedule) - 1
        if isinstance(result, ExecutionException):
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
            "id": self.experiment_id,
            "seed": self.seed,
            "timestamp": self.timestamp,
            "code_backup": self.code_backup,
            "code_version": self.code_version,
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
        execution.code_backup = serialized["code_backup"]
        execution.code_version = serialized["code_version"]
        execution.started_at = serialized["started_at"]
        return execution

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
            f"Storage: {os.path.join(self.storage.get('url', 'mem://'), self.storage.get('directory', ''))}",
            color="blue",
        )
        msg(f"Engine: {repr(self.engine)}", color="blue")
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

    def __repr__(self):
        experiment_id = self.experiment_id if isinstance(self.seed, int) else "None"
        storage = (
            os.path.join(
                self.storage.get("url", "-"), self.storage.get("directory", "")
            )
            if isinstance(self.storage, dict)
            else "-"
        )
        return f"Execution <{experiment_id}> ({storage})"

    def __str__(self):
        return self.__repr__()
