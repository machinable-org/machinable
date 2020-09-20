import inspect

from ..core.mixin import Mixin, MixinInstance
from ..utils.importing import ModuleClass

_register = {"experiment": [], "component": []}


class View(Mixin):
    def __init__(self):
        raise NotImplemented(
            "Views are constructed automatically and cannot be instantiated directly"
        )

    @classmethod
    def clear(cls, types=None):
        if types is None:
            types = ["experiment", "component"]
        if isinstance(types, str):
            types = [types]
        for k in types:
            _register[k] = []

    @classmethod
    def bind(cls, target, instance):
        for view in _register[target]:
            on_bind = getattr(view, "on_bind", lambda x: True)
            if on_bind(instance) is not False:
                return MixinInstance(instance, view)
        return None

    @classmethod
    def component(cls, view):
        if isinstance(view, str):
            view = ModuleClass(view, baseclass=View)
        else:
            if not inspect.isclass(view):
                raise ValueError(f"View has to be a class")
        _register["component"].insert(0, view)
        return view

    @classmethod
    def experiment(cls, view):
        if isinstance(view, str):
            view = ModuleClass(view, baseclass=View)
        else:
            if not inspect.isclass(view):
                raise ValueError(f"View has to be a class")
        _register["experiment"].insert(0, view)
        return view

    @classmethod
    def on_bind(cls, instance):
        """Event triggered when view is accessed

        Return `False` to prevent binding"""
        pass
