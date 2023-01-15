from typing import Any, Dict, List, Optional, Union

from machinable import schema
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, JsonableType, VersionType


class Multiple(Storage):
    """Allows to use multiple storage instances

    All read operations are being forwarded to primary storage only.
    Write operation are forwarded to both primary and secondary storages.
    Any return value represents the return value of the primary storage"""

    def __init__(self, primary: Storage, *secondary: Storage):
        if len(secondary) == 0:
            raise ValueError("You have to provide multiple storages")
        self._primary = primary
        self._secondary = secondary
        # maps primary storage ID to equivalent in secondary storages
        self._translation: Dict[str, str] = {}

        super().__init__(version=None)

    def serialize(self) -> dict:
        return {
            "primary": self._primary.serialize(),
            "secondary": [
                secondary.serialize() for secondary in self._secondary
            ],
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Multiple":
        return cls(
            Storage.unserialize(serialized["primary"]),
            *[Storage.unserialize(s) for s in serialized["secondary"]],
        )

    def _read(self, method: str, *args) -> Any:
        # read from primary storage
        return getattr(self._primary, method)(*args)

    def _write(self, method: str, *args) -> Any:
        # propagate to both primary and all secondary storages
        primary_result = getattr(self._primary, method)(*args)

        for index, secondary in enumerate(self._secondary):
            translated_args = [self._translate_arg(index, arg) for arg in args]
            secondary_result = getattr(secondary, method)(*translated_args)
            # capture mappings between primary and secondary ID
            if method == "_create_experiment":
                self._translation[
                    f"{index}:experiment:{primary_result}"
                ] = secondary_result
            elif method == "_create_execution":
                self._translation[
                    f"{index}:execution:{primary_result}"
                ] = secondary_result
                for pri, sec in zip(args[1], translated_args[1]):
                    self._translation[
                        f"{index}:experiment:{pri._storage_id}"
                    ] = sec._storage_id

        return primary_result

    def _translate_arg(self, index: int, arg: Any) -> Any:
        if isinstance(arg, (list, tuple)):
            return [self._translate_arg(index, a) for a in arg]
        if not isinstance(arg, schema.Element):
            return arg
        return self._translate_model(index, arg)

    def _translate_model(
        self, index: int, model: schema.Element
    ) -> schema.Element:
        translated = model.copy()
        if model._storage_id is not None:
            try:
                translated._storage_id = self._translation[
                    f"{index}:{model.__class__.__name__.lower()}:{model._storage_id}"
                ]
                translated._storage_instance = self._secondary[index]
            except KeyError as _ex:
                pass
        return translated

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
    ) -> str:
        return self._write("_create_execution", execution, experiments)

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        group: schema.Group,
        project: schema.Project,
        uses: List[schema.Element],
    ) -> str:
        return self._write(
            "_create_experiment", experiment, group, project, uses
        )

    def _create_element(
        self,
        element: schema.Element,
        experiment: schema.Experiment,
    ) -> str:
        return self._write("_create_element", element, experiment)

    def _create_group(self, group: schema.Group) -> str:
        return self._write("_create_group", group)

    def _create_project(self, project: schema.Project) -> str:
        return self._write("_create_project", project)

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        return self._write("_create_record", experiment, data, scope)

    def _create_file(
        self, experiment_storage_id: str, filepath: str, data: Any
    ) -> str:
        return self._write(
            "_create_file", experiment_storage_id, filepath, data
        )

    def _mark_started(
        self, experiment: schema.Experiment, timestamp: DatetimeType
    ) -> None:
        return self._write("_mark_started", experiment, timestamp)

    def _update_heartbeat(
        self,
        experiment: schema.Experiment,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        return self._write(
            "_update_heartbeat", experiment, timestamp, mark_finished
        )

    # reads

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return self._read("_retrieve_execution", storage_id)

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        return self._read("_retrieve_experiment", storage_id)

    def _retrieve_element(self, storage_id: str) -> schema.Element:
        raise self._read("_retrieve_element", storage_id)

    def _retrieve_group(self, storage_id: str) -> schema.Group:
        return self._read("_retrieve_group", storage_id)

    def _retrieve_project(self, storage_id: str) -> schema.Project:
        return self._read("_retrieve_project", storage_id)

    def _retrieve_records(
        self, experiment_storage_id: str, scope: str
    ) -> List[JsonableType]:
        return self._read("_retrieve_records", experiment_storage_id, scope)

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return self._read("_retrieve_file", experiment_storage_id, filepath)

    def _retrieve_output(self, experiment_storage_id: str) -> str:
        return self._read("_retrieve_output", experiment_storage_id)

    def _local_directory(
        self, experiment_storage_id: str, *append: str
    ) -> Optional[str]:
        return self._read("_local_directory", experiment_storage_id, *append)

    def _retrieve_status(
        self, experiment_storage_id: str, field: str
    ) -> Optional[str]:
        return self._read("_retrieve_status", experiment_storage_id, field)

    def _find_experiment(
        self, experiment_id: str, timestamp: float = None
    ) -> Optional[str]:
        return self._read("_find_experiment", experiment_id, timestamp)

    def _find_experiment_by_predicate(
        self, module: str, predicate: Dict
    ) -> List[str]:
        return self._read("_find_experiment_by_predicate", module, predicate)

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        return self._read("_find_related", storage_id, relation)

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return self._read("_retrieve_file", experiment_storage_id, filepath)
