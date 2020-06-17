from .. import execute as _execute
from ..core import Component as _V2Component
from ..core import Mixin
from ..experiment import Experiment as _Experiment
from ..experiment import ExperimentComponent as C
from ..storage import Storage as Observations


def execute(task, storage=None, seed=None, driver=None):
    return _execute(experiment=task, storage=storage, seed=seed, engine=driver)


class Component(_V2Component):
    @property
    def observer(self):
        return self.store

    @observer.setter
    def observer(self, value):
        self.store = value

    @property
    def children(self):
        return self.components

    @children.setter
    def children(self, value):
        self.components = value


class Task(_Experiment):
    def component(self, node, components=None, resources=None):
        return self.components(node, components, resources)
