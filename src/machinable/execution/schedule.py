import copy
import random

from ..core.component import Component as BaseComponent
from ..utils.identifiers import encode_experiment_id, generate_component_id
from ..utils.importing import ModuleClass
from ..utils.traits import Jsonable
from ..utils.utils import generate_seed


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
    def __init__(self, elements=None, seed=None):
        self._elements = elements or []
        self._result = []
        self._seed = seed

    def add(
        self, execution_type, component, components, resources, args=None, kwargs=None,
    ):
        self._elements.append(
            [execution_type, component, components, resources, args, kwargs]
        )
        return self

    def set_seed(self, seed=None):
        if not isinstance(seed, int):
            raise ValueError("Seed must be integer")

        if seed == self._seed:
            return self

        experiment_id = encode_experiment_id(seed, or_fail=False)
        seed_random_state = random.Random(seed)

        for i in range(len(self._elements)):
            flags = self._elements[i][1]["flags"]
            flags["GLOBAL_SEED"] = seed
            flags["EXPERIMENT_ID"] = experiment_id
            flags["SEED"] = generate_seed(random_state=seed_random_state)
            flags["COMPONENT_ID"] = generate_component_id()[0]

        return self

    @property
    def elements(self):
        return copy.deepcopy(self._elements)

    @property
    def components(self):
        return [
            component["flags"]["COMPONENT_ID"] for _, component, *__ in self._elements
        ]

    def filter(self, callback=None):
        """Filter the schedule elements in-place

        # Arguments
        callback: Callable that represents filter condition (returns True for values to keep)
           It must accept 3 arguments, the index of the element in the schedule, the component
           identifier and the schedule element

        # Examples
        ```python
        e.filter(lambda i, component, _: component == '$COMPONENT_ID')
        ```
        """
        self._elements = [
            element
            for i, element in enumerate(self._elements)
            if callback(i, element[1]["flags"]["COMPONENT_ID"], element)
        ]

        return self

    def transform(self, callback):
        self._elements = [
            callback(i, element[1]["flags"]["COMPONENT_ID"], element)
            for i, element in enumerate(self._elements)
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

        return self

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
