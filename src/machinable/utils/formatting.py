import datetime
import json
import traceback

from ..utils.dicts import serialize


def msg(text, level="info", color=None):
    color_f = {
        "header": "\033[95m",
        "blue": "\033[94m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "fail": "\033[91m",
    }
    end_f = "\033[0m"

    if isinstance(color, str):
        text = color_f[color.lower()] + text + end_f

    print(text)


def str_to_time(date_time_str):
    if date_time_str is False or date_time_str is None:
        return None

    try:
        return datetime.datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        return datetime.datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")


def prettydict(dict_like, sort_keys=False):
    try:
        return json.dumps(dict_like, indent=4, default=serialize, sort_keys=sort_keys)
    except TypeError:
        return str(dict_like)


def exception_to_str(ex):
    return "".join(
        traceback.format_exception(etype=type(ex), value=ex, tb=ex.__traceback__)
    )
