import copy

from ..config.parser import ModuleClass
from ..core.component import Component as BaseComponent
from ..utils.traits import Jsonable


def recover_class(element):
    if "class" not in element:
        element["class"] = ModuleClass(
            module_name=element["module"], baseclass=BaseComponent
        ).load(instantiate=False)


class Schedule(Jsonable):
    def __init__(self, elements=None):
        self._elements = elements or []
        self._result = []

    def add(
        self, execution_type, component, components, resources, args=None, kwargs=None,
    ):
        self._elements.append(
            [execution_type, component, components, resources, args, kwargs]
        )

    def add_execute(self, component, components, resources, args=None, kwargs=None):
        return self.add("execute", component, components, resources, args, kwargs)

    def add_tune(self, component, components, resources, args=None, kwargs=None):
        return self.add("tune", component, components, resources, args, kwargs)

    def set_result(self, result, index=None):
        if index is None:
            self._result.append(result)
            return

        while len(self._result) <= index:
            self._result.append(None)

        self._result[index] = result

    def serialize(self):
        elements = copy.deepcopy(self._elements)
        serialized = []
        for execution_type, component, components, resources, args, kwargs in elements:
            component.pop("class", None)
            for i in range(len(components)):
                components[i].pop("class", None)
            serialized.append(
                {
                    "execution_type": execution_type,
                    "component": component,
                    "components": components,
                    "resources": resources,
                    "args": args,
                    "kwargs": kwargs,
                }
            )

        return serialized

    @classmethod
    def unserialize(cls, serialized):
        schedule = cls()
        for element in serialized:
            recover_class(element["component"])
            for i in range(len(element["components"])):
                recover_class(element["components"][i])
            schedule.add(**element)
        return schedule

    def iterate(self, storage=None):
        for (
            execution_type,
            component,
            components,
            resources,
            args,
            kwargs,
        ) in self._elements:
            if storage is not None:
                storage = copy.deepcopy(storage)
                storage["components"] = component["flags"]["UID"]
                yield (
                    execution_type,
                    component,
                    components,
                    storage,
                    resources,
                    args,
                    kwargs,
                )
            else:
                yield (
                    execution_type,
                    component,
                    components,
                    resources,
                    args,
                    kwargs,
                )

    def __getitem__(self, item):
        return self._elements[item]

    def __iter__(self):
        yield from self._elements

    def __len__(self):
        return len(self._elements)
