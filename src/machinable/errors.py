class MachinableError(Exception):
    """All of machinable exception inherit from this baseclass"""


class ConfigurationError(MachinableError):
    """Invalid configuration

    Bases: MachinableError"""


class DependencyMissing(MachinableError, ImportError):
    """Missing optional dependency

    Bases: ImportError"""


class StorageError(MachinableError):
    """Storage error

    Bases: MachinableError"""


class ExecutionFailed(MachinableError):
    """Execution failed

    Bases: MachinableError"""

    def __init__(self, message, reason=None):
        super().__init__(message)
        self.reason = reason


class ExecutionInterrupt(ExecutionFailed):
    """Execution was interrupted

    Bases: ExecutionFailed"""

    def __init__(self, message):
        super().__init__(message, reason="interrupt")
