from typing import Optional

from machinable.interface import Interface
from machinable.types import VersionType


class Experiment(Interface):
    """Experiment"""

    @classmethod
    def make(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        base_class: "Element" = None,
        **kwargs,
    ) -> "Element":
        if base_class is None:
            base_class = Experiment
        return super().make(module, version, base_class, **kwargs)
