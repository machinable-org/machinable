from ..core.mixin import Mixin, MixinInstance
from ..utils.importing import resolve_instance

_register = {"experiment": [], "component": []}


def _bind_view(target, instance):
    for view in _register[target]:
        if view.on_bind(instance) is not False:
            return MixinInstance(instance, view)
    return None


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
    def component(cls, view):
        resolved = resolve_instance(view, cls, "views")
        if resolved is not None:
            view = resolved
        _register["component"].append(view)

    @classmethod
    def experiment(cls, view):
        resolved = resolve_instance(view, cls, "views")
        if resolved is not None:
            view = resolved
        _register["experiment"].append(view)

    @classmethod
    def on_bind(cls, instance):
        """Event triggered when view is accessed

        Return `False` to prevent binding"""
        pass
