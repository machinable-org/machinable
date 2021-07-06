from typing import TYPE_CHECKING, Type

import importlib

from machinable.errors import ConfigurationError, MachinableError
from machinable.project import Project
from machinable.utils import find_subclass_in_module, import_from_directory

if TYPE_CHECKING:
    from machinable.element import Element


def get(name: str, element: Type["Element"]) -> "Element":
    module = import_from_directory(name, Project.get().path())
    if module is None:
        module = importlib.import_module(name)
    view_class = find_subclass_in_module(module, element)
    if view_class is None:
        raise ConfigurationError(
            f"Could not find a view inheriting from {element.__name__}"
            f"Is it correctly defined in '{module.__name__}'?"
        )

    return view_class


def from_element(name: str, element: "Element") -> "Element":
    view_class = get(name, element.__class__)
    try:
        view = view_class("")
    except TypeError as _e:
        raise MachinableError(
            f"Could instantiate view {view_class.__module__}.{view_class.__name__}"
        ) from _e

    view.__model__ = element.__model__
    view._active_view = view_class.__module__

    return view
