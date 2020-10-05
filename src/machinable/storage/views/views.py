import inspect

from ...core.mixin import Mixin, MixinInstance
from ...utils.importing import ModuleClass

_register = {
    "experiment": {},
    "component": {},
}


def get(view_type, instance, name=None):
    try:
        return MixinInstance(instance, _register[view_type][name], attribute=name)
    except KeyError:
        return None


class StorageView:
    @classmethod
    def clear(cls, types=None):
        if types is None:
            types = ["experiment", "component"]
        if isinstance(types, str):
            types = [types]
        for k in types:
            _register[k] = {}

    @classmethod
    def component(cls, view=None, *, name=None):
        if name is not None:
            name = "_" + name + "_"

        def _decorate(f):
            if isinstance(f, str):
                f = ModuleClass(f, baseclass=StorageComponentView)
            else:
                if not inspect.isclass(f):
                    raise ValueError(f"View has to be a class")
            _register["component"][name] = f

        if view:
            return _decorate(view)

        return _decorate

    @classmethod
    def experiment(cls, view=None, *, name=None):
        if name is not None:
            name = "_" + name + "_"

        def _decorate(f):
            if isinstance(f, str):
                f = ModuleClass(f, baseclass=StorageExperimentView)
            else:
                if not inspect.isclass(f):
                    raise ValueError(f"View has to be a class")

            _register["experiment"][name] = f

        if view:
            return _decorate(view)

        return _decorate


class StorageExperimentView(Mixin):
    pass


class StorageComponentView(Mixin):
    pass
