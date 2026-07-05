"""machinable's exception types."""


class MachinableError(Exception):
    """All of machinable exception inherit from this baseclass."""


class ConfigurationError(MachinableError):
    """Invalid configuration.

    Bases: MachinableError
    """


class DependencyMissing(MachinableError, ImportError):
    """Missing optional dependency.

    Bases: ImportError
    """


class StorageError(MachinableError):
    """Storage error.

    Bases: MachinableError
    """


class ExecutionFailed(MachinableError):
    """Execution failed.

    Bases: MachinableError
    """


class DispatchException(MachinableError):
    """Dispatch exception.

    Bases: MachinableError
    """


class NotFound(MachinableError):
    """Requested data does not exist (e.g. evicted/missing on a binary read).

    Surfaced over the API as a typed ``not_found`` error so clients can
    distinguish missing data from a transport failure.

    Bases: MachinableError
    """


class IndexCollision(MachinableError):
    """Two distinct records claim the same record_id.

    Raised by ``Index.materialize`` when an incoming record's identity or
    predicate key differs from the row already stored under that record_id,
    e.g. when ingesting a collaborator's store whose ids collide with yours.
    Never silently merged; relocate/re-key one of the records.

    Bases: MachinableError
    """


class ExecutionInterrupted(BaseException):
    """Raised (best-effort) into a running dispatch when a ``cancelled`` marker appears.

    Inherits :class:`BaseException` (not :class:`Exception`) so a user
    ``except Exception`` in the interface's ``__call__`` cannot swallow the
    cancellation, like KeyboardInterrupt.
    Cancellation is cooperative/best-effort: it is injected at the next Python bytecode
    boundary, so a run blocked in a long C call finishes that call first.
    """
