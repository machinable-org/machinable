import ast
import glob
import importlib
import inspect
import os
import re
import types

import click

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))


def get_file_list():
    path = os.path.dirname(__file__)
    return glob.glob(os.path.join(path, "_*.md"))


def read_file(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def parse_argumentblock(docstr, level="###"):
    regex = r"\n([^\W0-9]\w*):"

    def repl(m):
        variable = m.group(1)

        return "\n- **" + variable + "**:"

    docstr = re.sub(regex, repl, docstr)

    # highlight expr
    for expr in ("Integer", "String", "Boolean", "True", "False", "None"):
        docstr = docstr.replace(expr, "``" + expr + "``")

    docstr = level + " Arguments\n" + docstr

    return docstr


def parse_docstr(docstr, level="###", intent=4):
    if docstr is None:
        return ""

    # lower the headings
    docstr = docstr.replace((" " * 4) + "# ", "    " + level + " ")
    # remove intent
    docstr = docstr.replace("\n" + (" " * intent), "\n")
    # parse Arguments block
    regex = level + r" Arguments((?:(?:\n|\r\n?).+)+)"
    docstr = re.sub(regex, lambda m: parse_argumentblock(m.group(1), level), docstr)
    return docstr


def parse_method(obj, path, options, level="##"):
    method = getattr(obj, path)
    name = method.__name__.replace("_", "\_")
    signature = inspect.signature(method)
    md = level + " " + str(name) + "\n``" + path + str(signature) + "``\n\n"
    md += parse_docstr(method.__doc__, level=level + "#", intent=8)
    return md


def parse_property(obj, path, options, level="##"):
    p = getattr(obj, path)

    md = level + " " + path + ' <Badge text="property" vertical="middle" />\n\n'
    md += parse_docstr(p.__doc__, level=level + "#", intent=8)
    return md


def parse_class(obj, path, options):
    signature = inspect.signature(obj)
    level = options.get("level", "###")
    if options.get("header", True):
        md = "## " + obj.__name__ + "\n``" + path + str(signature) + "``\n\n"
    else:
        md = "``" + path + str(signature) + "``\n\n"
    md += parse_docstr(obj.__doc__, level=level + "#") + "\n"

    def filter_attributes(array):
        # filter hidden
        array = [m for m in array if not m.startswith("_")]
        # filter no-docs
        array = [m for m in array if getattr(obj, m).__doc__ is not None]

        if options.get("include", False):
            return [m for m in array if m in options["include"]]

        if options.get("exclude", False):
            return [m for m in array if m not in options["exclude"]]

        return array

    # find properties
    properties = [p for p in dir(obj) if isinstance(getattr(obj, p), property)]

    for p in sorted(filter_attributes(properties)):
        md += parse_property(obj, p, {}, level=level) + "\n"

    # find methods
    methods = [
        method_name
        for method_name in dir(obj)
        if callable(getattr(obj, method_name))
        and inspect.ismethod(getattr(obj, method_name))
        is False  # excludes class methods
    ]

    for method in sorted(filter_attributes(methods)):
        md += parse_method(obj, method, {}, level=level) + "\n"

    return md


def parse_module(obj, path, options):
    return parse_docstr(obj.__doc__)


def parse_function(obj, path, options, level="##"):
    signature = inspect.signature(obj)
    md = level + " " + obj.__name__ + "\n``" + path + str(signature) + "``\n\n"
    md += parse_docstr(obj.__doc__, level=level + "#")
    return md


def parse(filename):
    content = read_file(filename)

    regex = r"\{%\s+(.*)\s+%\}"

    def repl(m):
        target = m.group(1)

        try:
            target, options = target.split("::")
        except ValueError:
            options = "{}"

        options = ast.literal_eval(options)
        module, attribute = target.rsplit(".", 1)

        imp = importlib.import_module(module)
        obj = getattr(imp, attribute)
        if isinstance(obj, types.FunctionType):
            return parse_function(obj, target, options)
        if inspect.isclass(type(obj)):
            return parse_class(obj, target, options)
        elif inspect.ismodule(obj):
            return parse_module(obj, target, options)

        raise ValueError("Invalid object")

    md = re.sub(regex, repl, content)
    return md


def generate(filepath=None):
    if filepath is None:
        for fp in get_file_list():
            generate(fp)
        return

    directory, file = os.path.split(filepath)

    with open(
        os.path.join(
            os.path.dirname(os.path.dirname(directory)), "reference", file[1:]
        ),
        "w",
    ) as f:
        f.write(parse(filepath))


def generate_cli():
    from machinable.console.cli import cli

    def get_help(cmd, parent=None):
        ctx = click.core.Context(cli, info_name=cmd.name, parent=parent)
        result = cmd.get_help(ctx) + "\n\n"
        commands = getattr(cmd, "commands", {})
        for sub_command in commands.values():
            result += get_help(sub_command, ctx) + "\n\n"
        return result

    output = "\n\n## --help\n\nUse the `--help` option to inspect options\n\n```\n"
    output += get_help(cli) + "\n```\n"
    with open(os.path.join(ROOT, "reference", "cli.md"), "a",) as f:
        f.write(output)


if __name__ == "__main__":
    generate()
    generate_cli()
