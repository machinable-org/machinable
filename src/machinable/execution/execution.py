from typing import Any, Callable, List, Optional, Union

import ast
import copy
import inspect
import os
from datetime import datetime as dt

import machinable.errors
import pendulum
import yaml
from expandvars import expand
from machinable.collection.experiment import ExperimentCollection
from machinable.config.interface import ConfigInterface
from machinable.config.mapping import config_map
from machinable.engine import Engine
from machinable.experiment.experiment import Experiment
from machinable.experiment.parser import parse_experiment
from machinable.filesystem import open_fs
from machinable.index import Index
from machinable.project import Project
from machinable.registration import Registration
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.submission.submission import Submission
from machinable.utils.dicts import merge_dict, update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.host import get_host_info
from machinable.utils.importing import resolve_instance
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import (
    decode_experiment_id,
    encode_experiment_id,
    generate_experiment_id,
    generate_nickname,
    sentinel,
)


def _recover_class(element):
    if "class" not in element:
        try:
            element["class"] = ModuleClass(
                module_name=element["module"], baseclass=BaseComponent
            ).load(instantiate=False)
        except ImportError as _ex:
            # we delay the exception, since a wrapped engine
            #  might handle the import correctly later
            class FailedRecovery:
                def __init__(self, exception):
                    self.exception = exception

                def __call__(self, *args, **kwargs):
                    raise self.exception

            element["class"] = FailedRecovery(_ex)


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


class Execution(Jsonable, Discoverable):
    def __init__(
        self,
        experiment: Union[Experiment, List[Experiment], None] = None,
        storage: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        project: Union[Project, Callable, str, dict, None] = None,
        code_backup: Union[bool, None] = None,
        name: Optional[str] = None,
    ):
        self._experiments: list = []
        if experiment is not None:
            self.set_experiment(experiment)

        self.storage = None
        self.engine = None
        self.code_backup = code_backup
        self.timestamp = None
        self.started_at = None
        self.name = None

        if project is None:
            project = get_settings()["default_project"]

        self.project = Project.make(project)

        # assign project registration
        self._registration = self.project.registration

        self.behavior = {"raise_exceptions": False}
        self.failures = 0
        self._nickname = None

        self.set_storage(storage)
        self.set_code_backup(code_backup)
        self.set_engine(engine)

        self.set_name(name)

    @property
    def experiments(self) -> ExperimentCollection:
        """Experiments of the execution"""
        return ExperimentCollection(self._experiments)

    @property
    def nickname(self):
        if self._nickname is None:
            self._nickname = generate_nickname()

        return self._nickname

    def set_experiment(
        self,
        experiment: Union[Experiment, List[Experiment]],
        resources: Optional[dict] = None,
    ) -> "Execution":
        """Specify and experiment

        Note that this method replaces previously specified experiments.
        To append an experiment use `add_experiment`.

        # Arguments
        see add_experiment
        """
        self._experiments = []
        if not isinstance(experiment, (list, tuple)):
            experiment = [experiment]

        for e in experiment:
            self.add_experiment(e)

        return self

    def add_experiment(
        self,
        experiment: Union[Experiment, List[Experiment]],
        resources: Optional[dict] = None,
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        resources: dict, specifies the resources that are available to the component.
            This can be computed by passing in a callable (see below)

        # Dynamic resource computation

        You can condition the resource specification on the configuration, for example:
        ```python
        resources = lambda component: {'gpu': component.config.num_gpus }
        ```
        """
        if isinstance(experiment, (list, tuple)):
            for e in experiment:
                self.add_experiment(e)
            return self

        # parse the experiment configuration
        component, components = self.project.parse_experiment(experiment)

        self._experiments.append(
            {
                "component": component,
                "components": components,
                "resources": resources,
            }
        )

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
            element[1]["config"] = update_dict(element[1]["config"], config)
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

    def is_submitted(self) -> bool:
        try:
            with open_fs(self.storage.config["url"]) as filesystem:
                return filesystem.isdir(
                    os.path.join(
                        self.storage.config["directory"], self.submission_id
                    )
                )
        except (
            FileNotFoundError,
            AttributeError,
            KeyError,
            TypeError,
            ValueError,
        ):
            pass
        return False

    def set_name(self, name: Optional[str] = None) -> "Execution":
        """Sets the name of the execution

        The name is used as relative storage path

        # Arguments
        name: Name, defaults to '%U_%a_&NICKNAME'
            May contain the following variables:
            - &PROJECT will be replaced by project name
            - &NICKNAME will be replaced by the random nickname of the execution
            - %x expressions will be replaced by strftime
            The variables are expanded following GNU bash's variable expansion rules, e.g.
            `&{NICKNAME:-default_value}` or `&{PROJECT:?}` can be used.
        """
        if name is None:
            name = get_settings()["default_name"]

        if name is None:
            name = "%U_%a_&NICKNAME"

        if not isinstance(name, str):
            raise ValueError(f"Name has to be a str. '{name}' given.")

        # expand % variables
        name = expand(
            name,
            environ={
                "PROJECT": self.project.name or "",
                "NICKNAME": self.nickname,
            },
            var_symbol="&",
        )
        # apply strftime
        name = dt.now().strftime(name)

        name = os.path.normpath(name)

        self.name = name

        return self

    def submit(self):
        """Submit execution to engine"""
        # publish project registration used during execution
        Registration.reset(self.registration)

        if self.registration.on_before_submit(self) is False:
            return False

        self.failures = 0
        self.storage.config["submission"] = self.submission_id

        # check if URL is an existing experiment
        derived_from = None
        try:
            with open_fs(self.storage.config["url"]) as filesystem:
                submission_id = filesystem.load_file("execution.json")[
                    "submission_id"
                ]
                # register URL as parent storage and rewrite to submissions/ subdirectory
                derived_from = self.storage.config["url"]
                self.storage.config["url"] = os.path.join(
                    self.storage.config["url"], "submissions"
                )

        except (ValueError, KeyError, FileNotFoundError):
            pass

        is_submitted = self.is_submitted()
        if not is_submitted:
            # compute resources

            if (
                isinstance(self.engine, Engine)
                and not self.engine.supports_resources()
            ):
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
                        component=component_config,
                        components=components_config,
                    )

                default_resources = self.registration.default_resources(
                    engine=self.engine,
                    component=component_config,
                    components=components_config,
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
                        "engine": getattr(
                            self.engine, "_resolved_by_expression", None
                        ),
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
        if isinstance(result, machinable.errors.ExecutionFailed):
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

    def serialize(self):
        return {
            "submission_id": self.submission_id,
            "seed": self.seed,
            "timestamp": self.timestamp,
            "started_at": self.started_at,
            "components": self.components,
            "project_name": self.project.name
            if self.project is not None
            else None,
            "experiment_name": self.experiment.specification["name"]
            if self.experiment is not None
            else None,
        }

    @classmethod
    def unserialize(cls, serialized):
        for element in serialized:
            recover_class(element["component"])
            for i in range(len(element["components"])):
                recover_class(element["components"][i])
        if not isinstance(serialized, dict):
            raise ValueError(f"Invalid execution: {serialized}")
        execution = cls(None)
        execution.seed = serialized["seed"]
        execution.timestamp = serialized["timestamp"]
        execution.started_at = serialized["started_at"]
        return execution

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
            if (
                filtered.get("OUTPUT_REDIRECTION", "SYS_AND_FILE")
                == "SYS_AND_FILE"
            ):
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
            shortened = (
                len(self.schedule) > 3 and 0 < index < len(self.schedule) - 1
            )
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
            msg(_args(component["config"]), color="blue")

            for c in components:
                if c:
                    msg(f"\t{c['name']}", color="yellow")
                    if len(c["versions"]) > 0:
                        msg(f"\t>> {', '.join(c['versions'])}", color="green")
                    msg(_flags(c["flags"]))
                    msg(_args(c["config"]), color="blue")

        msg("------\n", color="header")

        return self

    def filter(self, callback=None):
        self.schedule.filter(callback)

    def __repr__(self):
        submission_id = (
            self.submission_id if isinstance(self.seed, int) else "None"
        )
        return f"Execution <{submission_id}> ({self.storage})"

    def __str__(self):
        return self.__repr__()
