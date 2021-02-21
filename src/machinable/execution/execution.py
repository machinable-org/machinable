from typing import Any, Callable, List, Optional, Union

import ast
import copy
import inspect
import os
import uuid
from datetime import datetime as dt

import machinable.errors
import pendulum
import yaml
from expandvars import expand
from machinable.collection.experiment import ExperimentCollection
from machinable.config.mapping import config_map
from machinable.element.element import Element
from machinable.engine import Engine
from machinable.experiment.experiment import Experiment
from machinable.experiment.parser import parse_experiment
from machinable.filesystem import open_fs
from machinable.index import Index
from machinable.project import Project
from machinable.registration import Registration
from machinable.repository.repository import Repository
from machinable.settings import get_settings
from machinable.submission.submission import Submission
from machinable.utils.dicts import merge_dict, update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.host import get_host_info
from machinable.utils.importing import resolve_instance
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import (
    call_with_context,
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


class Execution(Element, Discoverable):
    def __init__(
        self,
        experiment: Union[Experiment, List[Experiment], None] = None,
        repository: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        seed: Union[str, int, None] = None,
    ):
        super().__init__()

        if engine is None:
            engine = get_settings()["default_engine"]

        if repository is None:
            repository = get_settings()["default_repository"]

        self.__related__.update(
            {
                "engine": Engine.make(engine),
                "repository": Repository.make(repository),
                "experiments": [],
            }
        )

        if experiment is not None:
            self.add_experiment(experiment)

        self.nickname = generate_nickname()
        self.timestamp = dt.now().timestamp()

    # relations

    @property
    # has_many
    def experiments(self) -> ExperimentCollection:
        """Experiments of the execution"""
        # todo: lookup from filesystem
        return ExperimentCollection(self.__related__["experiments"])

    @property
    # belongs_to
    def project(self):
        if "project" in self.__related__:
            return self.__related__["project"]

        # find project from file system, otherwise return None
        raise NotImplementedError

    @property
    # has_one
    def engine(self):
        return self.__related__["engine"]

    @property
    # belongs_to
    def repository(self):
        if "repository" in self.__related__:
            return self.__related__["repository"]

        # find project from file system, otherwise return None
        raise NotImplementedError

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
            for _experiment in experiment:
                self.add_experiment(_experiment)
            return self

        experiment = Experiment.make(experiment)

        # parse resources
        # if not self.engine.supports_resources():
        #     if resources is not None:
        #         msg(
        #             "Engine does not support resource specification. Skipping ...",
        #             level="warn",
        #             color="header",
        #         )
        #         resources = None
        # else:
        #     if callable(resources):
        #         resources = resources(engine=self.engine, experiment=experiment)

        #     default_resources = self.registration.default_resources(
        #         engine=self.engine, experiment=experiment
        #     )

        #     if resources is None and default_resources is not None:
        #         # use default resources
        #         resources = default_resources
        #     elif resources is not None and default_resources is not None:
        #         # merge with default resources
        #         if resources.pop("_inherit_defaults", True) is not False:
        #             canonicalize_resources = getattr(
        #                 self.engine, "canonicalize_resources", lambda x: x
        #             )
        #             resources = merge_dict(
        #                 canonicalize_resources(default_resources),
        #                 canonicalize_resources(resources),
        #             )

        # relations
        experiment.__related__["execution"] = self
        self.__related__["experiments"].append(experiment)

        return self

    def submit(self) -> "Execution":

        if self.uuid is None:
            self.__storage__.create_execution(
                execution={"host": get_host_info(), "project": "Uuid"}
            )

        self.engine.dispatch(self)

        return self

    def derive(
        self,
        experiment: Union[Experiment, List[Experiment], None] = None,
        storage: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        project: Union[Project, str, dict, None] = None,
    ) -> "Execution":
        """Derives a related execution."""
        # user can specify overrides, otherwise it copies all objects over

    def set_directory(self, directory):
        if directory is not None:
            if not isinstance(directory, str):
                raise ValueError("Directory must be a string")
            if directory[0] == "/":
                raise ValueError("Directory must be relative")

        self.storage.config["directory"] = directory

        return self

    def set_code_backup(self, enabled=None, exclude=None):
        self.code_backup = {"enabled": enabled, "exclude": exclude}

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

    def submit_(self):
        """Submit execution to engine"""
        # publish project registration used during execution
        Registration.reset(self.registration)

        if self.registration.on_before_submit(self) is False:
            return False

        self.failures = 0

        # todo: tricky to do with database and file model
        if self._repository.is_experiment():
            # repository will be derived from an existing experiment
            derived_from = repository.url
            self._repository = self._repository.related(self.name)

        is_submitted = self.exists()
        if not is_submitted:
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
            self.save()

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

    def host(self):
        # return host info model
        pass

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
            # "submission_id": self.submission_id,
            # "seed": self.seed,
            "timestamp": self.timestamp,
            "experiments": self.experiments.serialize()
            # "components": self.components,
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
        return f"Execution"

    def __str__(self):
        return self.__repr__()
