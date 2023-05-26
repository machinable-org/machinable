from typing import TYPE_CHECKING, Any, Callable

from functools import wraps
from inspect import getattr_static

if TYPE_CHECKING:
    from machinable.element import Element


class Mixin:
    """Mixin base class"""


class bind:
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

    def __init__(self, target: Any, mixin_class: Any, name: str):
        self._binding_mixin_target = target
        self._binding_mixin_class = mixin_class
        self._binding_mixin_name = name

    def __getattr__(self, item):
        # forward dynamically into mix-in class
        attribute = getattr(self._binding_mixin_class, item, None)

        if attribute is None:
            raise AttributeError(
                f"'{self._binding_mixin_class.__name__}' has no attribute '{item}'"
            )

        if isinstance(attribute, property):
            return attribute.fget(self._binding_mixin_target)

        if not callable(attribute):
            return attribute

        if isinstance(
            getattr_static(self._binding_mixin_class, item), staticmethod
        ):
            return attribute

        # if attribute is non-static method we decorate it to pass in the controller

        def bound_method(*args, **kwargs):
            return attribute(self._binding_mixin_target, *args, **kwargs)

        return bound_method


def mixin(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        name = f.__name__
        if name not in self.__mixins__:
            mixin_class = f(self)
            if isinstance(mixin_class, str):
                from machinable.project import Project, import_element

                mixin_class = import_element(
                    Project.get().path(), mixin_class, Mixin
                )

            self.__mixins__[name] = bind(self, mixin_class, name)

        # assign to __mixin__ for reference
        self.__mixin__ = self.__mixins__[name]

        return self.__mixins__[name]

    return _wrapper
