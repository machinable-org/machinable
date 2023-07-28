from typing import Dict, List, Optional, Union

from machinable import Component
from machinable.interface import Interface
from machinable.types import VersionType


class PredicateComponent(Component):
    class Config:
        a: int = 1
        ignore_: int = 2

    def __init__(self, *args, test_context=None, **kwargs):
        super().__init__(*args, **kwargs)
        self._context = test_context

    def compute_context(self):
        context = super().compute_context()

        if self._context:
            context.pop("config")
            context.update(self._context)

        return context

    def on_compute_predicate(self):
        return {"test": "a"}
