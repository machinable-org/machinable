from inspect import getattr_static
from ..config.parser import ModuleClass


class MixinInstance:
    def __init__(self, controller, mixin_class, attribute):
        self.config = {
            "controller": controller,
            "class": mixin_class,
            "attribute": attribute,
        }

    def __getattr__(self, item):
        # lazy-load class
        if isinstance(self.config["class"], ModuleClass):
            self.config["class"] = self.config["class"].load(instantiate=False)

        attribute = getattr(self.config["class"], item, None)

        if attribute is None:
            raise AttributeError(
                f"Mixin '{self.config['class'].__name__}' has no method '{item}'"
            )

        if isinstance(attribute, property):
            return attribute.fget(self.config["controller"])

        if not callable(attribute):
            return attribute

        if isinstance(getattr_static(self.config["class"], item), staticmethod):
            return attribute

        # if attribute is non-static method we decorate it to pass in the controller

        def bound_method(*args, **kwargs):
            # bind mixin instance to controller for mixin self reference
            self.config["controller"].__mixin__ = getattr(
                self.config["controller"], self.config["attribute"]
            )
            output = attribute(self.config["controller"], *args, **kwargs)

            return output

        return bound_method


class Mixin:
    """
    Mixin base class. All machinable mixins must inherit from this base class.
    """

    pass
