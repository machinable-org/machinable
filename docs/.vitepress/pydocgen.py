#!/usr/bin/env python3

"""Builds a JSON index of available APIs"""

import inspect
import json
import os
import pkgutil
import pydoc
import textwrap

ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
)


def _isclass(object):
    return inspect.isclass(
        object
    )  # and  not isinstance(object, types.GenericAlias)


def _get_signature(obj):
    try:
        sig = inspect.signature(obj)
        return str(sig)
    except (ValueError, TypeError):
        return None


def _get_docstring(obj):
    doc = inspect.getdoc(obj)
    if doc:
        return textwrap.dedent(doc).strip()
    return None


def _get_source_file(obj):
    try:
        f = inspect.getfile(obj)
        return os.path.relpath(f, ROOT)
    except (TypeError, OSError):
        return None


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

    db[path] = {
        "kind": "module",
        "name": name,
        "path": path,
        "doc": _get_docstring(object),
        "file": _get_source_file(object),
    }


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
        if attr[1] in ["method", "class method", "static method"]:
            docroutine(db, name, path + "." + attr[0], attr[3])

    db[path] = {
        "kind": "class",
        "realname": realname,
        "name": name,
        "path": path,
        "parents": list(map(makename, bases)),
        "doc": _get_docstring(object),
        "file": _get_source_file(object),
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
        "signature": _get_signature(object),
        "doc": _get_docstring(object),
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
    data = json.dumps(index(), ensure_ascii=False)
    with open(os.path.join(ROOT, "docs/.vitepress/pydoc.js"), "w") as f:
        f.write(f"export default {data};")


def validate():
    import glob
    import re
    import sys

    db = index()
    docs_dir = os.path.join(ROOT, "docs")
    pattern = re.compile(r"<Pydoc[^>]*>(.*?)</Pydoc>")
    errors = []

    for md_file in glob.glob(
        os.path.join(docs_dir, "**", "*.md"), recursive=True
    ):
        rel_path = os.path.relpath(md_file, ROOT)
        with open(md_file) as f:
            for lineno, line in enumerate(f, 1):
                for match in pattern.finditer(line):
                    ref = match.group(1).strip()
                    if ref not in db:
                        errors.append(f"  {rel_path}:{lineno}: {ref}")

    if errors:
        print(f"ERROR: {len(errors)} unresolved Pydoc reference(s):")
        for e in errors:
            print(e)
        sys.exit(1)
    else:
        print(f"OK: all Pydoc references resolve ({len(db)} API entries)")


if __name__ == "__main__":
    import sys

    if "--validate" in sys.argv:
        validate()
    else:
        generate()
