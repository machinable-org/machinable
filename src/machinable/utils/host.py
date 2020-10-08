import getpass
import inspect
import os
import platform
import socket
import sys

from ..registration import Registration

_getters = {}


def register_host_info(function):
    name = function.__name__
    if name.startswith("_"):
        name = name[1:]
    _getters[name] = function


def get_host_info(registration=True):
    if registration:
        registration = Registration.get()
        for name, method in inspect.getmembers(
            registration,
            predicate=lambda x: inspect.isfunction(x) or inspect.ismethod(x),
        ):
            if name.startswith("host_"):
                _getters[name[5:]] = method

    return {name: getter() for name, getter in _getters.items()}


@register_host_info
def _network_name():
    return platform.node()


@register_host_info
def _hostname():
    return socket.gethostname()


@register_host_info
def _machine():
    return platform.machine()


@register_host_info
def _python_version():
    return platform.python_version()


@register_host_info
def _user():
    return getpass.getuser()


@register_host_info
def _environ():
    return os.environ.copy()


@register_host_info
def _argv():
    return sys.argv


@register_host_info
def _machinable_version():
    try:
        import pkg_resources

        return pkg_resources.require("machinable")[0].version
    except:  # noqa: E722
        return "unknown"
