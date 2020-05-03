import copy
import datetime
import os
from typing import Any, Callable, Union

import fs
import yaml

from machinable.utils.host import get_host_info

from ..config.interface import ConfigInterface
from ..core.exceptions import ExecutionException
from ..engine import Engine
from ..execution.schedule import Schedule
from ..experiment.experiment import Experiment
from ..experiment.parser import parse_experiment
from ..project import Project
from ..project.export import Export
from ..storage.directory import Directory as StorageDirectory
from ..store import Store
from ..utils.formatting import exception_to_str, msg
from ..utils.traits import Jsonable
from ..utils.utils import generate_uid
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
        self._uid = None
        self._uid_cache = None
        self.function = None

        self.experiment = None
        self.storage = None
        self.engine = None
        self.project = None
        self.seed = None

        self.timestamp = None
        self.schedule = Schedule()
        self.store = None
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

        self.set_experiment(experiment)
        self.set_storage(storage)
        self.set_engine(engine)
        self.set_project(project)
        self.set_seed(seed)

    def __call__(self, experiment, storage=None, engine=None, project=None, seed=None):
        self.set_experiment(experiment)
        self.set_storage(storage)
        self.set_engine(engine)
        self.set_project(project)
        self.set_seed(seed)
        if self.function is not None:
            # decorator invocation
            self.project.default_component = self.function
            return self

    def set_experiment(self, experiment):
        self.experiment = Experiment.create(experiment)

        return self

    def set_storage(self, storage):
        if isinstance(storage, dict):
            storage = copy.deepcopy(storage)
        elif isinstance(storage, str):
            storage = {"url": storage}
        else:
            storage = {}

        # code backup
        self.code_backup = False
        if storage.get("code_backup", None) is not False:
            if not (
                # do not backup on mem:// filesystem unless explictly set to True
                storage.get("code_backup", None) is None
                and storage.get("url", "mem://").startswith("mem://")
            ):
                self.code_backup = True

        self.storage = storage

        return self

    def set_engine(self, engine):
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

        # build schedule
        self.schedule = Schedule()

        config = ConfigInterface(
            self.project.parse_config(),
            self.experiment.specification["version"],
            default_class=self.project.default_component,
        )

        for index, (node, components, resources) in enumerate(
            parse_experiment(self.experiment.specification, seed=self.seed)
        ):
            node_config, components_config = config.get(node, components)

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
    def uid(self):
        if self.seed is None:
            return []

        if self._uid is None or self._uid_cache != self.seed:
            self._uid = generate_uid(k=len(self.schedule), random_state=self.seed)
            self._uid_cache = self.seed

        return self._uid

    def is_submitted(self):
        try:
            storage = fs.open_fs(self.storage["url"], create=False)
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

    def submit(self):
        if not self.is_submitted():
            if len(self.schedule) == 0:
                self.set_schedule()
            now = datetime.datetime.now()
            self.timestamp = now.timestamp()
            self.started_at = str(now)
            self.storage["group"] = self.experiment_id
            self.store = Store(
                config=self.engine.storage_middleware(self.storage), status=False
            )

            if self.code_backup is not False:
                self.project.backup_source_code(opener=self.store.get_stream)

            if self.code_version is not False:
                self.code_version = self.project.get_code_version()

            self.store.write("execution.json", self.serialize(), _meta=True)
            self.store.write("host.json", get_host_info(), _meta=True)

        return self.engine.submit(self)

    def set_result(self, result, index=None):
        if index is None:
            index = len(self.schedule) - 1
        if isinstance(result, ExecutionException):
            self.engine.log(
                f"{self.uid[index]} of experiment {self.experiment_id} failed "
                f"({index + 1}/{len(self.schedule)}). "
                f"{exception_to_str(result)}",
                level="error",
            )
        else:
            self.engine.log(
                f"{self.uid[index]} of experiment {self.experiment_id} finished "
                f"({index + 1}/{len(self.schedule)}). ",
                level="info",
            )
        self.schedule.set_result(result, index)

    @classmethod
    def from_storage(cls, url):
        storage = StorageDirectory(url)
        return cls.from_json(storage.load_file("execution.json"))

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
                            "class": components[i]["class"].__name__,
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
            "schedule": self.schedule.serialize(),
            "uid": self.uid,
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
        execution.schedule = Schedule.unserialize(serialized["schedule"])
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
        msg(f"Storage: {self.storage.get('url', 'mem://')}", color="blue")
        msg(f"Engine: {repr(self.engine)}", color="blue")
        msg(f"Project: {repr(self.project)}", color="blue")

        for (
            index,
            (execution_type, component, components, resources, args, kwargs),
        ) in enumerate(self.schedule):
            # only print first and last one
            shortened = len(self.schedule) > 3 and 0 < index <= len(self.schedule) - 1
            msg(
                f"\n{self.uid[index]} ({index+1}/{len(self.schedule)})", color="header",
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
