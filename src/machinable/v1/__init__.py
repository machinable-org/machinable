from ..core import Component as _V2Component, Mixin
from ..experiment import Experiment as _Experiment, ExperimentComponent as C
from .observations import Observations
from .. import execute as _execute


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
