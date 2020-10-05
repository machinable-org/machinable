from inspect import getattr_static

from ..utils.importing import ModuleClass


class MixinInstance:
    def __init__(self, controller, mixin_class, attribute=None):
        self._binding = {
            "controller": controller,
            "class": mixin_class,
            "attribute": attribute,
        }

    def __getattr__(self, item):
        # lazy-load class
        if isinstance(self._binding["class"], ModuleClass):
            self._binding["class"] = self._binding["class"].load(instantiate=False)

        attribute = getattr(self._binding["class"], item, None)

        if attribute is None:
            raise AttributeError(
                f"'{self._binding['class'].__name__}' has no method '{item}'"
            )

        if isinstance(attribute, property):
            return attribute.fget(self._binding["controller"])

        if not callable(attribute):
            return attribute

        if isinstance(getattr_static(self._binding["class"], item), staticmethod):
            return attribute

        # if attribute is non-static method we decorate it to pass in the controller

        def bound_method(*args, **kwargs):
            # bind mixin instance to controller for mixin self reference
            if self._binding["attribute"] is not None:
                self._binding["controller"].__mixin__ = getattr(
                    self._binding["controller"], self._binding["attribute"]
                )
            output = attribute(self._binding["controller"], *args, **kwargs)

            return output

        return bound_method


class Mixin:
    """
    Mixin base class. All machinable mixins must inherit from this base class.
    """

    pass
