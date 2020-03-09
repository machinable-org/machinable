import os
import platform
import socket
import pkg_resources

_getters = {}


def register_host_info(function):
    name = function.__name__
    if name.startswith('_'):
        name = name[1:]
    _getters[name] = function


def get_host_info():
    return {
        name: getter() for name, getter in _getters.items()
    }


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
def _environ():
    return os.environ.copy()


@register_host_info
def _machinable_version():
    try:
        return pkg_resources.require("machinable")[0].version
    except:  # noqa: E722
        return 'unknown'
