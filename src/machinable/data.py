"""Data held in a record: an input, never a run."""

from __future__ import annotations

from typing import Self

from machinable.errors import MachinableError
from machinable.interface import Interface


class Data(Interface):
    """A plain-config interface whose record holds data and is never executed.

    A module subclasses ``Data`` for a format (a folder of raw recordings, a
    dataset): its ``Config`` is a :class:`~machinable.plain.PlainConfig` that
    names the content (a format and the hash of its file listing, say), its
    artifact namespace (``local_directory()``) holds the data, and its methods
    read it. A run ``uses`` it like any other input. Since its record is plain,
    a writer without Python (an uploader) makes the same record Python does
    (``docs/design/format.md``, "Plain writer").

    A data record is an ordinary ``Interface`` record (``kind`` stays
    ``Interface``) that never has run-records or status markers. Readers tell
    inputs from runs by ``inherits``: a data record's bases include
    ``machinable.data``. ``launch`` (and so dispatching one) is refused.
    """

    __plain__ = True

    def launch(self) -> Self:
        """Refused: a data record is an input, never executed."""
        raise MachinableError(
            f"{self.__class__.__name__} is machinable.Data: an input that runs use,"
            " never executed itself"
        )
