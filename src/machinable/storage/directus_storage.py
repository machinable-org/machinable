from typing import Any, List, Optional, Union

import json
import os
from time import time

import arrow
import requests
from machinable import component, schema
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, JsonableType, VersionType
from machinable.utils import load_file, save_file, update_dict


class DirectusStorage(Storage):
    class Config:
        """Config annotation"""

        url: str
        token: str
        local_directory: Optional[str]

    def __init__(self, config: dict, version: VersionType):
        super().__init__(config, version=version)

    def _directus_upsert(
        self, collection: str, data: dict, update_id: Optional[int] = None
    ) -> str:
        response = getattr(requests, "patch" if update_id else "post")(
            f"{self.config.url}/items/{collection}{('/' + str(update_id)) if update_id else ''}",
            json=data,
            params={"access_token": self.config.token},
        )
        try:
            return response.json()["data"]
        except KeyError as _ex:
            raise RuntimeError(str(response.json())) from _ex

    def _directus_retrieve(
        self,
        collection: str,
        item_id: Optional[int] = None,
        filter: Optional[dict] = None,
    ) -> dict:
        if filter is None:
            filter = {}
        else:
            filter = {"filter": json.dumps(filter)}
        response = requests.get(
            f"{self.config.url}/items/{collection}/{item_id if item_id else ''}",
            params={"access_token": self.config.token, **filter},
        )
        try:
            return response.json()["data"]
        except KeyError as _ex:
            raise RuntimeError(str(response.json())) from _ex

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping],
        project: schema.Project,
    ) -> str:
        grouping = self.create_grouping(grouping)
        storage_id = str(
            self._directus_upsert(
                "executions",
                {
                    **execution.dict(),
                    "grouping_id": int(grouping._storage_id),
                    "timestamp": str(arrow.get(execution.timestamp)),
                },
            )["id"]
        )

        execution._storage_id = storage_id

        for experiment in experiments:
            self.create_experiment(
                experiment=experiment,
                execution=execution,
                grouping=grouping,
                project=project,
            )

        return storage_id

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        execution: schema.Execution,
        grouping: schema.Grouping,
        project: schema.Project,
    ) -> str:
        return str(
            self._directus_upsert(
                "experiments",
                {
                    **experiment.dict(),
                    "execution_id": int(execution._storage_id),
                    "timestamp": str(arrow.get(experiment.timestamp)),
                },
            )["id"]
        )

    def _create_grouping(self, grouping: schema.Grouping) -> str:
        search = self._directus_retrieve(
            "groupings",
            filter={"group": {"_eq": grouping.group}},
        )
        if len(search) > 0:
            return str(search[0]["id"])
        return str(self._directus_upsert("groupings", grouping.dict())["id"])

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        return save_file(
            os.path.join(
                self.config.local_directory, "records", f"{scope}.jsonl"
            ),
            data=data,
            mode="a",
        )

    def _mark_started(
        self, experiment: schema.Experiment, timestamp: DatetimeType
    ) -> None:
        self._directus_upsert(
            "experiments",
            {
                "started_at": str(timestamp),
            },
            update_id=int(experiment._storage_id),
        )

    def _update_heartbeat(
        self,
        experiment: schema.Experiment,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        data = {"heartbeat_at": str(timestamp)}
        if mark_finished:
            data["finished_at"] = str(timestamp)

        self._directus_upsert(
            "experiments",
            data,
            update_id=int(experiment._storage_id),
        )

    def _retrieve_status(
        self, experiment_storage_id: str, field: str
    ) -> Optional[str]:
        return self._directus_retrieve(
            "experiments", int(experiment_storage_id)
        )[f"{field}_at"]

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        data = self._directus_retrieve("executions", int(storage_id))
        return schema.Execution(
            engine=data["engine"],
            timestamp=arrow.get(data["timestamp"]).timestamp(),
            nickname=data["nickname"],
            seed=data["seed"],
        )

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        data = self._directus_retrieve("experiments", int(storage_id))
        return schema.Experiment(
            interface=data["interface"],
            components=data["components"] or [],
            experiment_id=data["experiment_id"],
            resources=data["resources"],
            seed=data["seed"],
            config=data["config"] or {},
        )

    def _retrieve_grouping(self, storage_id: str) -> schema.Grouping:
        data = self._directus_retrieve("groupings", int(storage_id))
        return schema.Grouping(group=data["group"], pattern=data["pattern"])

    def _find_experiment(
        self, experiment_id: str, timestamp: float = None
    ) -> Optional[str]:
        raise NotImplementedError

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        if relation == "experiment.execution":
            return str(
                self._directus_retrieve("experiments", int(storage_id))[
                    "execution_id"
                ]
            )
        if relation == "execution.experiments":
            return [
                str(experiment["id"])
                for experiment in self._directus_retrieve(
                    "experiments",
                    filter={"execution_id": {"_eq": int(storage_id)}},
                )
            ]
        if relation == "grouping.executions":
            # TODO:
            raise NotImplementedError
        if relation == "execution.grouping":
            # TODO:
            raise NotImplementedError
        if relation == "experiment.related":
            # TODO:
            raise NotImplementedError
        if relation == "experiment.ancestor":
            # TODO:
            raise NotImplementedError
        return None

    def _retrieve_records(
        self, experiment_storage_id: str, scope: str
    ) -> List[JsonableType]:
        return load_file(
            os.path.join(
                self.config.local_directory, "records", f"{scope}.jsonl"
            ),
            default=[],
        )

    def _retrieve_output(self, experiment_storage_id: str) -> str:
        return self._retrieve_file(self.config.local_directory, "output.log")

    def _local_directory(
        self, experiment_storage_id: str, *append: str
    ) -> Optional[str]:
        return os.path.join(self.config.local_directory, *append)

    def _create_file(
        self, experiment_storage_id: str, filepath: str, data: Any
    ) -> str:
        return save_file(
            os.path.join(self.config.local_directory, filepath),
            data,
            makedirs=True,
        )

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return load_file(
            os.path.join(self.config.local_directory, filepath), default=None
        )
