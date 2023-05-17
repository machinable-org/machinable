from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

from machinable import schema
from machinable.element import (
    Element,
    defaultversion,
    get_dump,
    get_lineage,
    normversion,
)
from machinable.group import Group
from machinable.project import Project
from machinable.settings import get_settings
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.component import Component

import os

import arrow
from machinable import schema
from machinable.collection import ComponentCollection
from machinable.group import Group, resolve_group
from machinable.project import Project
from machinable.types import (
    DatetimeType,
    JsonableType,
    TimestampType,
    VersionType,
)
from machinable.utils import Jsonable

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.element import Element
    from machinable.execution import Execution


class Storage(Element):
    """Storage base class"""

    kind = "Storage"
    default = get_settings().default_storage

    def __init__(
        self,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Storage(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            default_group=default_group,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)

    @classmethod
    def instance(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        module, version = defaultversion(module, version, cls)
        return super().make(
            module, version, base_class=Storage, default_group=default_group
        )

    def commit(
        self,
        components: Union["Component", List["Component"]],
        execution: Optional["Execution"] = None,
    ) -> None:
        from machinable.component import Component

        if isinstance(components, Component):
            components = [components]
        for component in components:
            if not isinstance(component, Component):
                raise ValueError(
                    f"Expected component, found: {type(component)} {component}"
                )
            if component.is_mounted():
                continue
            # ensure that configuration has been parsed
            assert component.config is not None
            assert component.predicate is not None

            group = component.group
            if group is None:
                group = Group(self.__model__.default_group)
                component.__related__["group"] = group

            self.create_component(
                component=component,
                group=group,
                project=Project.get(),
                uses=[element for element in component.uses or []],
            )

            # write deferred component data
            for filepath, data in component._deferred_data.items():
                component.save_file(filepath, data)
            component._deferred_data = {}

        if execution is None or execution.is_mounted():
            return

        self.create_execution(execution, components)

    def create_execution(
        self,
        execution: Union["Execution", schema.Execution],
        components: List[Union["Component", schema.Component]],
    ) -> schema.Execution:
        from machinable.component import Component
        from machinable.execution import Execution

        execution = Execution.model(execution)

        storage_id = self._create_execution(
            execution=execution,
            components=[Component.model(component) for component in components],
        )
        assert storage_id is not None

        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _create_execution(
        self,
        execution: schema.Execution,
        components: List[schema.Component],
    ) -> str:
        raise NotImplementedError

    def create_component(
        self,
        component: schema.Component,
        group: schema.Group,
        project: schema.Project,
        uses: List[Union["Element", schema.Element]],
    ) -> schema.Component:
        from machinable.component import Component

        component = Component.model(component)
        group = Group.model(group)
        project = Project.model(project)
        uses = [Element.model(use) for use in uses]

        storage_id = self._create_component(component, group, project, uses)
        assert storage_id is not None

        component._storage_id = storage_id
        component._storage_instance = self

        return component

    def _create_component(
        self,
        component: schema.Component,
        group: schema.Group,
        project: schema.Project,
        uses: List[schema.Element],
    ) -> str:
        raise NotImplementedError

    def create_element(
        self,
        element: Union["Element", schema.Element],
        component: Union["Component", schema.Component],
    ) -> schema.Element:
        from machinable.component import Component

        element = Element.model(element)
        component = Component.model(component)

        target_component = (
            self.find_component(component.id, component.timestamp) or component
        )

        storage_id = self._create_element(
            element=element, component=target_component
        )
        assert storage_id is not None

        element._storage_id = storage_id
        element._storage_instance = self

        return element

    def _create_element(
        self,
        element: schema.Element,
        component: schema.Component,
    ) -> str:
        raise NotImplementedError

    def create_group(self, group: Union[Group, schema.Group]) -> schema.Group:
        group = Group.model(group)

        storage_id = self._create_group(group)
        assert storage_id is not None

        group._storage_id = storage_id
        group._storage_instance = self

        return group

    def _create_group(self, group: schema.Group) -> str:
        raise NotImplementedError

    def create_project(
        self, project: Union[Project, schema.Project]
    ) -> schema.Project:
        project = Project.model(project)

        storage_id = self._create_project(project)
        assert storage_id is not None

        project._storage_id = storage_id
        project._storage_instance = self

        return project

    def _create_project(self, project: schema.Project) -> str:
        raise NotImplementedError

    def create_record(
        self,
        component: Union["Component", schema.Component],
        data: JsonableType,
        scope: str = "default",
        timestamp: Optional[TimestampType] = None,
    ) -> JsonableType:
        from machinable.component import Component

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        component = Component.model(component)

        if component._storage_id is None:
            raise ValueError(f"Component {component.id} does not exist")

        record = {**data, "__timestamp": str(timestamp)}

        self._create_record(component, record, scope)

        return record

    def _create_record(
        self,
        component: schema.Component,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        raise NotImplementedError

    def create_file(
        self,
        element: Union["Element", schema.Element],
        filepath: str,
        data: Any,
    ) -> Optional[Any]:
        element = Element.model(element)
        return self._create_file(element._storage_id, filepath, data)

    def _create_file(self, storage_id: str, filepath: str, data: Any) -> str:
        raise NotImplementedError

    def retrieve_execution(self, storage_id: str) -> schema.Execution:
        execution = self._retrieve_execution(storage_id)
        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def retrieve_executions(
        self, storage_ids: List[str]
    ) -> List[schema.Execution]:
        return [
            self.retrieve_execution(storage_id) for storage_id in storage_ids
        ]

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        raise NotImplementedError

    def retrieve_component(self, storage_id: str) -> schema.Component:
        component = self._retrieve_component(storage_id)
        component._storage_id = storage_id
        component._storage_instance = self

        return component

    def retrieve_components(
        self, storage_ids: List[str]
    ) -> List[schema.Component]:
        return [
            self.retrieve_component(storage_id) for storage_id in storage_ids
        ]

    def _retrieve_component(self, storage_id: str) -> schema.Component:
        raise NotImplementedError

    def retrieve_group(self, storage_id: str) -> schema.Group:
        group = self._retrieve_group(storage_id)
        group._storage_id = storage_id
        group._storage_instance = self

        return group

    def _retrieve_group(self, storage_id: str) -> schema.Group:
        raise NotImplementedError

    def retrieve_project(self, storage_id: str) -> schema.Project:
        project = self._retrieve_project(storage_id)
        project._storage_id = storage_id
        project._storage_instance = self

        return project

    def _retrieve_project(self, storage_id: str) -> schema.Project:
        raise NotImplementedError

    def retrieve_element(self, storage_id: str) -> schema.Element:
        element = self._retrieve_element(storage_id)
        element._storage_id = storage_id
        element._storage_instance = self

        return element

    def retrieve_elements(
        self, storage_ids: List[str]
    ) -> List[schema.Execution]:
        return [self.retrieve_element(storage_id) for storage_id in storage_ids]

    def _retrieve_element(self, storage_id: str) -> schema.Element:
        raise NotImplementedError

    def retrieve_records(
        self,
        component: Union["Component", schema.Component],
        scope: str = "default",
    ) -> List[JsonableType]:
        from machinable.component import Component

        component = Component.model(component)

        return self._retrieve_records(component._storage_id, scope)

    def _retrieve_records(
        self, component_storage_id: str, scope: str
    ) -> List[JsonableType]:
        raise NotImplementedError

    def retrieve_file(
        self, element: Union["Element", schema.Element], filepath: str
    ) -> Optional[Any]:
        element = Element.model(element)
        return self._retrieve_file(element._storage_id, filepath)

    def _retrieve_file(self, storage_id: str, filepath: str) -> Optional[Any]:
        raise NotImplementedError

    def retrieve_output(
        self, component: Union["Component", schema.Component]
    ) -> Optional[str]:
        from machinable.component import Component

        component = Component.model(component)
        return self._retrieve_output(component._storage_id)

    def _retrieve_output(self, component_storage_id: str) -> str:
        raise NotImplementedError

    def local_directory(
        self,
        element: Union["Element", schema.Element],
        *append: str,
        create: bool = False,
    ) -> Optional[str]:
        element = Element.model(element)

        local_directory = self._local_directory(element._storage_id, *append)

        if create:
            os.makedirs(local_directory, exist_ok=True)

        return local_directory

    def _local_directory(self, storage_id: str, *append: str) -> Optional[str]:
        raise NotImplementedError

    def mark_started(
        self,
        component: Union["Component", schema.Component],
        timestamp: Optional[TimestampType] = None,
    ) -> DatetimeType:
        from machinable.component import Component

        component = Component.model(component)
        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)
        self._mark_started(component, timestamp)

        return timestamp

    def _mark_started(
        self, component: schema.Component, timestamp: DatetimeType
    ) -> None:
        raise NotImplementedError

    def update_heartbeat(
        self,
        component: Union["Component", schema.Component],
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> DatetimeType:
        from machinable.component import Component

        component = Component.model(component)
        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)
        self._update_heartbeat(component, timestamp, mark_finished)
        return timestamp

    def _update_heartbeat(
        self,
        component: schema.Component,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        raise NotImplementedError

    def retrieve_status(
        self, component: Union["Component", schema.Component], field: str
    ) -> Optional[DatetimeType]:
        from machinable.component import Component

        component = Component.model(component)
        fields = ["started", "heartbeat", "finished"]
        if field not in fields:
            raise ValueError(f"Invalid field: {field}. Must be on of {fields}")
        status = self._retrieve_status(component._storage_id, field)
        if status is None:
            return None

        try:
            return arrow.get(status)
        except arrow.ParserError:
            return None

    def _retrieve_status(
        self, component_storage_id: str, field: str
    ) -> Optional[str]:
        raise NotImplementedError

    def find_component(
        self, component_id: str, timestamp: int = None
    ) -> Optional[str]:
        return self._find_component(component_id, timestamp)

    def _find_component(
        self, component_id: str, timestamp: int = None
    ) -> Optional[str]:
        raise NotImplementedError

    def find_component_by_predicate(
        self, module: str, predicate: Optional[Dict] = None
    ) -> List[str]:
        return self._find_component_by_predicate(module, predicate)

    def _find_component_by_predicate(
        self, module: str, predicate: Dict
    ) -> List[str]:
        raise NotImplementedError

    def retrieve_related(
        self, storage_id: str, relation: str
    ) -> Optional[schema.Element]:
        relations = {
            "component.execution": "execution",
            "component.executions": "executions",
            "execution.components": "components",
            "execution.schedule": "schedule",
            "group.components": "components",
            "component.group": "group",
            "component.ancestor": "component",
            "component.derived": "components",
            "component.project": "project",
            "component.uses": "elements",
        }

        if relation not in relations:
            raise ValueError(
                f"Invalid relation: {relation}. Must be one of {list(relations.keys())}"
            )

        related = self.find_related(storage_id, relation)
        if related is None:
            return None

        return getattr(self, "retrieve_" + relations[relation])(related)

    def find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        return self._find_related(storage_id, relation)

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        raise NotImplementedError

    def _retrieve_file(
        self, component_storage_id: str, filepath: str
    ) -> Optional[Any]:
        raise NotImplementedError

    def __repr__(self):
        return f"Storage"

    def __str__(self):
        return self.__repr__()
