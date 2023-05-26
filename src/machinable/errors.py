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


class ComponentException(MachinableError):
    """Component exception

    Bases: MachinableError"""
