#!/usr/bin/env python3

"""Builds a JSON index of available APIs"""

import types

import inspect
import json
import os
import pkgutil
import pydoc

ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
)


def _isclass(object):
    return inspect.isclass(
        object
    )  # and  not isinstance(object, types.GenericAlias)


def docmodule(db, name, path, object):
    all = getattr(object, "__all__", None)

    # classes
    for key, value in inspect.getmembers(object, _isclass):
        if all is not None or (inspect.getmodule(value) or object) is object:
            if pydoc.visiblename(key, all, object):
                docclass(db, name, path + "." + key, value)

    # functions
    for key, value in inspect.getmembers(object, inspect.isroutine):
        if (
            all is not None
            or inspect.isbuiltin(value)
            or inspect.getmodule(value) is object
        ):
            if pydoc.visiblename(key, all, object):
                docroutine(db, name, path + "." + key, value)

    db[path] = {"kind": "module", "name": name, "path": path}


def docclass(db, name, path, object):
    try:
        realname = object.__name__
    except AttributeError:
        realname = None
    name = name or realname
    bases = object.__bases__

    def makename(c, m=object.__module__):
        return pydoc.classname(c, m)

    attrs = [
        (name, kind, cls, value)
        for name, kind, cls, value in pydoc.classify_class_attrs(object)
        if pydoc.visiblename(name, obj=object)
    ]

    for attr in attrs:
        if attr[0].startswith("__"):
            continue
        # todo: fine grained docroutine
        if attr[1] in ["method", "class method", "static method"]:
            docroutine(db, name, path + "." + attr[0], attr[3])

    db[path] = {
        "kind": "class",
        "realname": realname,
        "name": name,
        "path": path,
        "parents": list(map(makename, bases)),
    }


def docroutine(db, name, path, object):
    try:
        realname = object.__name__
    except AttributeError:
        realname = None
    name = name or realname
    db[path] = {
        "kind": "routine",
        "realname": realname,
        "name": name,
        "path": path,
    }


def index():
    db = {}
    for importer, modname, ispkg in pkgutil.walk_packages(["src"], ""):
        object, name = pydoc.resolve(modname)
        # This is an approximation of the reference implementation
        #  for `pydoc.plaintext.document(object, name)` at
        #  https://github.com/python/cpython/blob/e2591e4f5eb717922b2b33e201daefe4f99463dc/Lib/pydoc.py#L475
        if inspect.ismodule(object):
            docmodule(db, name, name, object)
        if _isclass(object):
            docclass(db, name, name, object)
        if inspect.isroutine(object):
            docroutine(db, name, name, object)

    return db


def generate():
    with open(os.path.join(ROOT, "docs/.vitepress/pydoc.js"), "w") as f:
        f.write(f"export default JSON.parse('{json.dumps(index())}');")


if __name__ == "__main__":
    generate()
