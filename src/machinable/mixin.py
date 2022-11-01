from typing import Any, Optional

from inspect import getattr_static


class Mixin:
    """
    Allows to dynamically extend object instances

    # Example
    ```python
    class Extension:
        def greet(self):
            # write an extension for Example class
            # note that self refers to the instance we are extending
            print(self.hello)

    class Example:
        def __init__(self):
            self.hello = 'hello world'
            # extend dynamically
            self.extension = Mixin(self, Extension, 'extension')

    Example().extension.greet()
    >>> 'hello world'
    ```
    """

    def __init__(
        self, target: Any, mixin_class: Any, attribute: Optional[str] = None
    ):
        self._binding = {
            "controller": target,
            "class": mixin_class,
            "attribute": attribute,
        }

    def __getattr__(self, item):
        # forward dynamically into mix-in class
        attribute = getattr(self._binding["class"], item, None)

        if attribute is None:
            raise AttributeError(
                f"'{self._binding['class'].__name__}' has no attribute '{item}'"
            )

        if isinstance(attribute, property):
            return attribute.fget(self._binding["controller"])

        if not callable(attribute):
            return attribute

        if isinstance(
            getattr_static(self._binding["class"], item), staticmethod
        ):
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
