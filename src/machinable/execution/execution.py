import ast
import copy
import inspect
import os
from datetime import datetime as dt
from typing import Any, Callable, Union

import pendulum
import yaml
from expandvars import expand

from ..config.interface import ConfigInterface, mapped_config
from ..config.mapping import config_map
from ..core.exceptions import ExecutionException
from ..core.settings import get_settings
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
from ..submission.submission import Submission
from ..utils.dicts import merge_dict, update_dict
from ..utils.formatting import exception_to_str, msg
from ..utils.host import get_host_info
from ..utils.identifiers import (
    decode_submission_id,
    encode_submission_id,
    generate_submission_id,
)
from ..utils.importing import resolve_instance
from ..utils.traits import Jsonable
from ..utils.utils import sentinel


def to_color(submission_id):
    return "".join(
        [encode_submission_id(decode_submission_id(c) % 16) for c in submission_id]
    )


def _code_backup_settings(value):
    enabled = None
    exclude = None
    if value in [True, False, None]:
        enabled = value
    if isinstance(value, dict):
        enabled = value.get("enabled", None)
        exclude = value.get("exclude", None)
    if isinstance(exclude, tuple):
        exclude = list(exclude)
    return {"enabled": enabled, "exclude": exclude}


_latest = [None]


class Execution(Jsonable):
    def __init__(
        self,
        experiment: Union[Experiment, Callable, Any, None] = sentinel,
        storage: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        index: Union[Index, str, dict, None] = None,
        project: Union[Project, Callable, str, dict, None] = None,
        seed: Union[int, str, None] = None,
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

        self.behavior = {"raise_exceptions": False}
        self.failures = 0
        self._registration = None

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

        # this may extend the PYTHONPATH and must thus be called before any import-dependent methods below
        self.set_project(project)
        self.set_storage(storage)
        self.set_experiment(experiment)
        self.set_engine(engine)
        self.set_index(index)
        self.set_seed(seed)

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

        resolved = resolve_instance(args, Execution, "_machinable.executions")
        if resolved is not None:
            return resolved

        if isinstance(args, dict):
            return Execution(**args)

        if isinstance(args, (list, tuple)):
            return Execution(*args)

        raise ValueError(f"Invalid argument: {args}")

    def set_experiment(self, experiment):
        if experiment is sentinel:
            self.experiment = None
            return self

        self.experiment = Experiment.create(experiment)

        return self

    def set_storage(self, storage):
        if storage is None:
            storage = get_settings()["default_storage"]

        self.storage = Storage.create(storage)

        return self

    def set_directory(self, directory):
        if directory is not None:
            if not isinstance(directory, str):
                raise ValueError("Directory must be a string")
            if directory[0] == "/":
                raise ValueError("Directory must be relative")

        self.storage.config["directory"] = directory

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
        if project is None:
            project = get_settings()["default_project"]

        self.project = Project.create(project)

        # assign project registration
        self._registration = self.project.registration

        return self

    def set_seed(self, seed):
        if isinstance(seed, str):
            seed = decode_submission_id(seed, or_fail=True)
        elif isinstance(seed, int):
            seed = generate_submission_id(random_state=seed, with_encoding=False)
        else:
            seed = generate_submission_id(with_encoding=False)

        self.seed = seed

        self.schedule.set_seed(seed)

        return self

    def set_schedule(self, schedule=None, registration=None):
        if schedule is not None:
            self.schedule = schedule
            return self

        _set_registration = registration is not False
        if _set_registration:
            Registration.reset(registration or self.registration)

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
            else:
                if callable(resources):
                    resources = resources(
                        engine=self.engine,
                        component=mapped_config(component_config),
                        components=mapped_config(components_config),
                    )

                default_resources = self.registration.default_resources(
                    engine=self.engine,
                    component=mapped_config(component_config),
                    components=mapped_config(components_config),
                )

                if resources is None and default_resources is not None:
                    # use default resources
                    resources = default_resources
                elif resources is not None and default_resources is not None:
                    # merge with default resources
                    if resources.pop("_inherit_defaults", True) is not False:
                        canonicalize_resources = getattr(
                            self.engine, "canonicalize_resources", lambda x: x
                        )
                        resources = merge_dict(
                            canonicalize_resources(default_resources),
                            canonicalize_resources(resources),
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

        if _set_registration:
            Registration.reset()

        return self

    def set_code_backup(self, enabled=None, exclude=None):
        self.code_backup = {"enabled": enabled, "exclude": exclude}

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
        self.behavior.update(settings)
        return self

    def set_registration(self, registration):
        self._registration = registration

        return self

    def is_submitted(self):
        try:
            with open_fs(self.storage.config["url"]) as filesystem:
                return filesystem.isdir(
                    os.path.join(self.storage.config["directory"], self.submission_id)
                )
        except (FileNotFoundError, AttributeError, KeyError, TypeError, ValueError):
            pass
        return False

    def submit(self):
        # publish project registration used during execution
        Registration.reset(self.registration)

        if self.registration.on_before_submit(self) is False:
            return False

        self.failures = 0
        self.storage.config["submission"] = self.submission_id

        # auto-name experiment if imported via @ directive
        if self.experiment.specification["name"] is None:
            if hasattr(self.experiment, "_resolved_module_name"):
                self.experiment.name(self.experiment._resolved_module_name)

        # expand variables in storage directory
        if isinstance(self.storage.config["directory"], str):
            # % variables
            variables = dict()

            variables["PROJECT"] = (
                self.project.name.replace(".", "/")
                if self.project.name is not None
                else None
            )

            variables["EXPERIMENT"] = (
                self.experiment.specification["name"].replace(".", "/")
                if self.experiment.specification["name"] is not None
                else ""
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
                submission_id = filesystem.load_file("execution.json")["submission_id"]
                # register URL as parent storage and rewrite to submissions/ subdirectory
                derived_from = self.storage.config["url"]
                self.storage.config["url"] = os.path.join(
                    self.storage.config["url"], "submissions"
                )

        except (ValueError, KeyError, FileNotFoundError):
            pass

        is_submitted = self.is_submitted()
        if not is_submitted:
            if len(self.schedule) == 0:
                self.set_schedule(registration=False)

            def set_derived_from_flag(i, component, element):
                element[1]["flags"]["DERIVED_FROM_SUBMISSION"] = derived_from
                return element

            self.schedule.transform(set_derived_from_flag)

            now = pendulum.now()
            self.timestamp = now.timestamp()
            self.started_at = str(now)

            # allow engine and registration to make changes before storage submission
            self.engine.on_before_storage_creation(self)
            self.registration.on_before_storage_creation(self)

            # determine code backup settings
            code_backup = _code_backup_settings(self.code_backup)

            # use project settings by default
            _project_settings = _code_backup_settings(
                self.registration.default_code_backup(execution=self)
            )

            if code_backup["enabled"] is None:
                code_backup["enabled"] = _project_settings["enabled"]
            if code_backup["exclude"] is None:
                code_backup["exclude"] = _project_settings["exclude"]

            # otherwise fall back on system-wide settings
            _user_settings = _code_backup_settings(
                get_settings()["default_code_backup"]
            )
            if code_backup["enabled"] is None:
                _user_settings["enabled"] = _user_settings["enabled"]
            if code_backup["exclude"] is None:
                code_backup["exclude"] = _user_settings["exclude"]

            # do not backup on mem:// filesystem unless explicitly set to True
            if code_backup["enabled"] is None and not self.storage.config[
                "url"
            ].startswith("mem://"):
                code_backup["enabled"] = True

            # collect and write execution data
            url = self.storage.get_url()
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
                if code_backup["enabled"]:
                    self.project.backup_source_code(
                        opener=filesystem.open, exclude=code_backup["exclude"]
                    )

                for k, v in data.items():
                    filesystem.save_file(name=k, data=v)

            self.index.add(Submission(url, data))

            msg(
                f"{self.submission_id} <{url}> ({self.started_at})\n",
                level="info",
                color="header",
            )

        self.registration.on_submit(self, is_submitted)

        execution = self.engine.dispatch(self)

        # decommission project registration
        Registration.reset()

        return execution

    def set_result(self, result, index=None, echo=True):
        if index is None:
            index = len(self.schedule._result)
        if isinstance(result, ExecutionException):
            self.failures += 1
            if self.behavior["raise_exceptions"]:
                raise result
            if echo or echo == "success":
                msg(
                    f"\nComponent <{self.components[index]}> of experiment {self.submission_id} failed "
                    f"({index + 1}/{len(self.schedule)})\n"
                    f"{exception_to_str(result)}",
                    level="error",
                    color="header",
                )
        else:
            if echo or echo == "failure":
                msg(
                    f"\nComponent <{self.components[index]}> of experiment {self.submission_id} completed "
                    f"({index + 1}/{len(self.schedule)})\n",
                    level="info",
                    color="header",
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
                        "args": nd.config.as_dict(evaluate=True),
                        "flags": nd.flags.as_dict(evaluate=True),
                    },
                    "components": [
                        {
                            "args": comps[i].config.as_dict(evaluate=True),
                            "flags": comps[i].flags.as_dict(evaluate=True),
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
            "submission_id": self.submission_id,
            "seed": self.seed,
            "timestamp": self.timestamp,
            "started_at": self.started_at,
            "components": self.components,
            "project_name": self.project.name if self.project is not None else None,
            "experiment_name": self.experiment.specification["name"]
            if self.experiment is not None
            else None,
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
        return self.submission_id + "_" + self.components[0]

    @property
    def submission_id(self):
        return encode_submission_id(self.seed)

    @property
    def registration(self):
        if self._registration is None:
            self._registration = Registration()

        return self._registration

    def summary(self):
        if len(self.schedule) == 0:
            self.set_schedule()

        msg(
            f"\n{self.submission_id}\n------",
            color="header",
        )
        msg(
            f"{repr(self.experiment)}",
            color="blue",
        )
        msg(
            f"{repr(self.storage)}",
            color="blue",
        )
        msg(f"{repr(self.engine)}", color="blue")
        msg(f"{repr(self.index)}", color="blue")
        msg(f"{repr(self.project)}", color="blue")
        msg(f"Seed <{self.seed}>", color="blue")

        def _flags(flags):
            filtered = {
                k: v
                for k, v in flags.items()
                if k
                not in {
                    "GLOBAL_SEED",
                    "SUBMISSION_ID",
                    "SEED",
                    "COMPONENT_ID",
                    "VERSIONING",
                    "LINEAGE",
                    "REPEAT_SEED",
                    "REPEAT_TOTAL",
                    "REPEAT_NUMBER",
                    "NAME",
                    "MODULE",
                }
            }
            if filtered.get("OUTPUT_REDIRECTION", "SYS_AND_FILE") == "SYS_AND_FILE":
                filtered.pop("OUTPUT_REDIRECTION", None)
            if len(filtered) == 0:
                return ""
            return yaml.dump(filtered, default_flow_style=False)

        def _args(config):
            config = copy.deepcopy(config)
            if config.get("_evaluate", True) is True:
                config.pop("_evaluate", None)
            if len(config) == {}:
                return "-"
            return yaml.dump(config, default_flow_style=False)

        for (
            index,
            (execution_type, component, components, resources, args, kwargs),
        ) in enumerate(self.schedule):
            # only print first and last one
            shortened = len(self.schedule) > 3 and 0 < index < len(self.schedule) - 1
            if shortened:
                if index == 1:
                    msg(
                        f"[ + {len(self.schedule) - 2} other components ]",
                        color="header",
                    )
                continue

            msg(
                f"\nComponent: {component['name']} <{self.components[index]}> ({index + 1}/{len(self.schedule)})",
                color="green",
            )

            if len(component["versions"]) > 0:
                msg(f">> {', '.join(component['versions'])}", color="green")
            msg(_flags(component["flags"]))
            msg(_args(component["args"]), color="blue")

            for c in components:
                if c:
                    msg(f"\t{c['name']}", color="yellow")
                    if len(c["versions"]) > 0:
                        msg(f"\t>> {', '.join(c['versions'])}", color="green")
                    msg(_flags(c["flags"]))
                    msg(_args(c["args"]), color="blue")

        msg("------\n", color="header")

        return self

    def filter(self, callback=None):
        self.schedule.filter(callback)

    @property
    def components(self):
        return self.schedule.components

    def __repr__(self):
        submission_id = self.submission_id if isinstance(self.seed, int) else "None"
        return f"Execution <{submission_id}> ({self.storage})"

    def __str__(self):
        return self.__repr__()
