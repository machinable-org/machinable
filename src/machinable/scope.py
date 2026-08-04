"""Scopes: predicate tagging for grouped runs."""

from machinable.config import to_dict
from machinable.interface import Interface


class Scope(Interface):
    """Tags every interface created inside it with a predicate.

    Runs that share a config stay distinct through their predicates.
    """

    kind = "Scope"
    default = None

    def __call__(self) -> dict:
        """The scope's predicate contribution (its config update)."""
        # an unexpanded scope's update does not carry its axis patch, so using it
        # as a scope would silently apply an empty predicate
        self._assert_expanded("use as a scope")

        return to_dict(self.config._update_)
