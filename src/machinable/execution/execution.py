from typing import List, Optional, Union

import copy
import os
from datetime import datetime as dt

import yaml
from expandvars import expand
from machinable.collection.experiment import ExperimentCollection
from machinable.element.element import Element
from machinable.element.relations import belongs_to, has_many, has_one
from machinable.engine import Engine
from machinable.experiment.experiment import Experiment
from machinable.registration import Registration
from machinable.repository.repository import Repository
from machinable.schema import ExecutionType
from machinable.settings import get_settings
from machinable.utils.dicts import merge_dict, update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.host import get_host_info
from machinable.utils.importing import resolve_instance
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import generate_nickname, generate_seed, sentinel


class Execution(Element, Discoverable):
    def __init__(
        self,
        experiment: Union[Experiment, List[Experiment], None] = None,
        repository: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        seed: Union[int, None] = None,
    ):
        super().__init__()

        self._seed = generate_seed(seed)
        self._nickname = generate_nickname()
        self._timestamp = dt.now().timestamp()

        if engine is None:
            engine = get_settings()["default_engine"]

        if repository is None:
            repository = get_settings()["default_repository"]

        self._engine = Engine.make(engine)
        self._repository = Repository.make(repository)
        self._experiments = []

        if experiment is not None:
            self.add_experiment(experiment)

    def _to_model(self) -> ExecutionType:
        return ExecutionType(timestamp=self._timestamp, nickname=self._nickname)

    @has_many
    def experiments(self) -> ExperimentCollection:
        from machinable.experiment.experiment import Experiment

        return Experiment, ExperimentCollection

    @belongs_to
    def project(self):
        from machinable.project.project import Project

        return Project

    @has_one
    def engine(self):
        from machinable.engine.engine import Engine

        return Engine

    @belongs_to
    def repository(self):
        from machinable.repository.repository import Repository

        return Repository

    def add_experiment(
        self,
        experiment: Union[Experiment, List[Experiment]],
        resources: Optional[dict] = None,
    ) -> "Execution":
        """Adds an experiment to the execution

        # Arguments
        experiment: Experiment or list of Experiments
        resources: dict, specifies the resources that are available to the experiment.
            This can be computed by passing in a callable (see below)

        # Dynamic resource computation

        You can condition the resource specification on the configuration, for example:
        ```python
        resources = lambda component: {'cpu': component.config.num_cpus }
        ```
        """
        if isinstance(experiment, (list, tuple)):
            for _experiment in experiment:
                self.add_experiment(_experiment)
            return self

        experiment = Experiment.make(experiment)

        # parse
        experiment.to_model()

        experiment.__related__["execution"] = self

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
        self.__related__.setdefault("experiments", ExperimentCollection())
        self.__related__["experiments"].append(experiment)

        return self

    def submit(self) -> "Execution":
        """Submit execution to engine"""

        if not self.is_mounted():
            self.__storage__.create_execution(
                execution=self.to_model(),
                experiments=[
                    experiment.to_model() for experiment in self._experiments
                ],
            )

        if self.url is None:
            self.__storage__.create_execution(
                execution={
                    "host": get_host_info(),
                    "code_version": self.project.get_code_version(),
                    "code_diff": self.project.get_diff(),
                    "seed": self.seed,
                    "experiments": [
                        {
                            "experiment_id": experiment.experiment_id,
                            "component": experiment.__component__,
                        }
                        for experiment in self.experiments
                    ],
                    "nickname": self.nickname,
                    "timestamp": self.timestamp,
                }
            )

        self.engine.dispatch(self)

        return self

    def derive(
        self,
        experiment: Union[Experiment, List[Experiment], None] = None,
        repository: Union[dict, str, None] = None,
        engine: Union[Engine, str, dict, None] = None,
        seed: Union[str, int, None] = None,
    ) -> "Execution":
        """Derives a related execution."""
        # user can specify overrides, otherwise it copies all objects over

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

    def __repr__(self):
        return f"Execution"

    def __str__(self):
        return self.__repr__()
