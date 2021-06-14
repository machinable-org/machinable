from typing import TYPE_CHECKING

import importlib

from machinable.errors import ConfigurationError, MachinableError
from machinable.project import Project
from machinable.utils import find_subclass_in_module, import_from_directory

if TYPE_CHECKING:
    from machinable.element import Element


class View:
    def __init__(self, element: "Element") -> None:
        self.element = element

    @classmethod
    def make(cls, name: str, element: "Element") -> "View":
        module = import_from_directory(name, Project.get().path())
        if module is None:
            module = importlib.import_module(name)
        view_class = find_subclass_in_module(module, View)
        if view_class is None:
            raise ConfigurationError(
                f"Could not find a view inheriting from the View base class. "
                f"Is it correctly defined in '{module.__name__}'?"
            )
        try:
            return view_class(element)
        except TypeError as _e:
            raise MachinableError(
                f"Could instantiate view {view_class.__module__}.{view_class.__name__}"
            ) from _e
