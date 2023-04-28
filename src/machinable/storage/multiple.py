from typing import Any, Dict, List, Optional, Union

from dataclasses import dataclass

from machinable import schema
from machinable.config import RequiredField, validator
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, ElementType, JsonableType


class Multiple(Storage):
    """Allows to use multiple storage instances

    All read operations are being forwarded to primary storage only.
    Write operation are forwarded to both primary and secondary storages.
    Any return value represents the return value of the primary storage"""

    @dataclass
    class Config:
        primary: ElementType = RequiredField
        secondary: List[ElementType] = RequiredField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._primary = None
        self._secondary = None
        # maps primary storage ID to equivalent in secondary storages
        self._translation: Dict[str, str] = {}

    @property
    def primary(self) -> Storage:
        if self._primary is None:
            self._primary = Storage.make(*self.config.primary)

        return self._primary

    @property
    def secondary(self) -> Storage:
        if self._secondary is None:
            self._secondary = [
                Storage.make(*spec) for spec in self.config.secondary
            ]

        return self._secondary

    def _read(self, method: str, *args) -> Any:
        # read from primary storage
        return getattr(self.primary, method)(*args)

    def _write(self, method: str, *args) -> Any:
        # propagate to both primary and all secondary storages
        primary_result = getattr(self.primary, method)(*args)

        for index, secondary in enumerate(self.secondary):
            translated_args = [self._translate_arg(index, arg) for arg in args]
            secondary_result = getattr(secondary, method)(*translated_args)
            # capture mappings between primary and secondary ID
            if method == "_create_component":
                self._translation[
                    f"{index}:component:{primary_result}"
                ] = secondary_result
            elif method == "_create_execution":
                self._translation[
                    f"{index}:execution:{primary_result}"
                ] = secondary_result
                for pri, sec in zip(args[1], translated_args[1]):
                    self._translation[
                        f"{index}:component:{pri._storage_id}"
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
                translated._storage_instance = self.secondary[index]
            except KeyError as _ex:
                pass
        return translated

    def _create_execution(
        self,
        execution: schema.Execution,
        components: List[schema.Component],
    ) -> str:
        return self._write("_create_execution", execution, components)

    def _create_component(
        self,
        component: schema.Component,
        group: schema.Group,
        project: schema.Project,
        uses: List[schema.Element],
    ) -> str:
        return self._write("_create_component", component, group, project, uses)

    def _create_element(
        self,
        element: schema.Element,
        component: schema.Component,
    ) -> str:
        return self._write("_create_element", element, component)

    def _create_group(self, group: schema.Group) -> str:
        return self._write("_create_group", group)

    def _create_project(self, project: schema.Project) -> str:
        return self._write("_create_project", project)

    def _create_record(
        self,
        component: schema.Component,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        return self._write("_create_record", component, data, scope)

    def _create_file(
        self, component_storage_id: str, filepath: str, data: Any
    ) -> str:
        return self._write("_create_file", component_storage_id, filepath, data)

    def _mark_started(
        self, component: schema.Component, timestamp: DatetimeType
    ) -> None:
        return self._write("_mark_started", component, timestamp)

    def _update_heartbeat(
        self,
        component: schema.Component,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        return self._write(
            "_update_heartbeat", component, timestamp, mark_finished
        )

    # reads

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return self._read("_retrieve_execution", storage_id)

    def _retrieve_component(self, storage_id: str) -> schema.Component:
        return self._read("_retrieve_component", storage_id)

    def _retrieve_element(self, storage_id: str) -> schema.Element:
        raise self._read("_retrieve_element", storage_id)

    def _retrieve_group(self, storage_id: str) -> schema.Group:
        return self._read("_retrieve_group", storage_id)

    def _retrieve_project(self, storage_id: str) -> schema.Project:
        return self._read("_retrieve_project", storage_id)

    def _retrieve_records(
        self, component_storage_id: str, scope: str
    ) -> List[JsonableType]:
        return self._read("_retrieve_records", component_storage_id, scope)

    def _retrieve_file(
        self, component_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return self._read("_retrieve_file", component_storage_id, filepath)

    def _retrieve_output(self, component_storage_id: str) -> str:
        return self._read("_retrieve_output", component_storage_id)

    def _local_directory(
        self, component_storage_id: str, *append: str
    ) -> Optional[str]:
        return self._read("_local_directory", component_storage_id, *append)

    def _retrieve_status(
        self, component_storage_id: str, field: str
    ) -> Optional[str]:
        return self._read("_retrieve_status", component_storage_id, field)

    def _find_component(
        self, component_id: str, timestamp: float = None
    ) -> Optional[str]:
        return self._read("_find_component", component_id, timestamp)

    def _find_component_by_predicate(
        self, module: str, predicate: Dict
    ) -> List[str]:
        return self._read("_find_component_by_predicate", module, predicate)

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        return self._read("_find_related", storage_id, relation)

    def _retrieve_file(
        self, component_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return self._read("_retrieve_file", component_storage_id, filepath)
