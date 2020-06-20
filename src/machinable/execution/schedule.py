import copy

from ..config.parser import ModuleClass
from ..core.component import Component as BaseComponent
from ..utils.traits import Jsonable


def recover_class(element):
    if "class" not in element:
        try:
            element["class"] = ModuleClass(
                module_name=element["module"], baseclass=BaseComponent
            ).load(instantiate=False)
        except ImportError as ex:
            # we delay the exception, since a wrapped engine
            #  might handle the import correctly later
            class FailedRecovery:
                def __init__(self, exception):
                    self.exception = exception

                def __call__(self, *args, **kwargs):
                    raise self.exception

            element["class"] = FailedRecovery(ex)


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

    @property
    def elements(self):
        return copy.deepcopy(self._elements)

    def filter(self, callback=None):
        self._elements = [
            args[1] for args in enumerate(self._elements) if callback(*args)
        ]

        return self

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
        serialized = []
        for (
            execution_type,
            component,
            components,
            resources,
            args,
            kwargs,
        ) in self.elements:
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
            index,
            (execution_type, component, components, resources, args, kwargs),
        ) in enumerate(self._elements):
            if storage is not None:
                storage = copy.deepcopy(storage)
                storage["component"] = component["flags"]["COMPONENT_ID"]
                yield copy.deepcopy(
                    (
                        index,
                        execution_type,
                        component,
                        components,
                        storage,
                        resources,
                        args,
                        kwargs,
                    )
                )
            else:
                yield copy.deepcopy(
                    (
                        index,
                        execution_type,
                        component,
                        components,
                        resources,
                        args,
                        kwargs,
                    )
                )

    def __getitem__(self, item):
        return self._elements[item]

    def __iter__(self):
        yield from self._elements

    def __len__(self):
        return len(self._elements)
