import os
import shutil
import json
import inspect
import ast
import re
import importlib
from collections import namedtuple

from ..project import Project
from ...experiment import Experiment
from ...experiment.parser import parse_experiment
from ...utils.formatting import msg
from ...config.interface import ConfigInterface
from . import standalone


def export_experiment(experiment, path=None, overwrite=False, project=None):
    """Exports experiment

    Converts the experiment into a plain Python project
    that can be executed without machinable.

    ::: warning
    This feature may not work reliably in all circumstances and project use cases
    :::

    # Arguments
    experiment: machinable.Experiment, specifies the experiment.
    path: String, directory where exported experiment will be stored. If None defaults to 'exports' in the
        current working directory
    overwrite: Boolean, whether to overwrite an existing export.
    project: Project|Dict|String|None, project used, defaults to current working directory
    """
    if path is None:
        path = os.path.join(os.getcwd(), "exports")

    experiment = Experiment.create(experiment)
    project = Project.create(project)

    config = ConfigInterface(
        project.parse_config(), experiment.specification["version"]
    )

    execution_plan = list(parse_experiment(experiment.specification))
    for index, (node, components, resources) in enumerate(execution_plan):
        node.flags["UID"] = str(index)
        node.flags["EXPERIMENT_ID"] = "EXPORT"
        node.flags["EXECUTION_INDEX"] = index
        node.flags["EXECUTION_CARDINALITY"] = len(execution_plan)
        node.flags["EXECUTION_ID"] = index

        node_config = config.get(node)
        components_config = []
        for component in components:
            c = config.get(component)
            if c is not None:
                components_config.append(c)

        # if more than one job, write into subdirectories
        if len(execution_plan) > 1:
            path = os.path.join(path, str(index))

        export_path = os.path.abspath(path)

        if os.path.exists(export_path) and not overwrite:
            raise FileExistsError(
                f"Export directory '{export_path}' exists. To overwrite, set overwrite=True"
            )

        msg(f"\nExporting to {export_path}", color="yellow")

        export = Export(project.directory_path, export_path)

        # instantiate targets
        nd = node_config["class"](
            config=node_config["args"], flags=node_config["flags"]
        )
        comps = [
            c["class"](config=c["args"], flags=c["flags"], node=nd)
            for c in components_config
        ]

        # export config
        export.write(
            "config.json",
            {
                "node": {
                    "args": nd.config.toDict(evaluate=True),
                    "flags": nd.flags.toDict(evaluate=True),
                },
                "components": [
                    {
                        "args": comps[i].config.toDict(evaluate=True),
                        "flags": comps[i].flags.toDict(evaluate=True),
                        "class": components_config[i]["class"].__name__,
                    }
                    for i in range(len(comps))
                ],
                "store": {"url": "./results"},
            },
            meta=True,
        )

        # export components and node
        export.module(node_config["class"])
        for c in components_config:
            export.module(c["class"])

        # export mixins
        mixins = node_config["args"].get("_mixins_", [])
        for c in components_config:
            mixins.extend(c["args"].get("_mixins_", []))
        for mixin in mixins:
            export.module(
                mixin["origin"].replace("+.", "vendor."), from_module_path=True
            )

        export.write("__init__.py")

        export.machinable()

        export.entry_point(node_config, components_config)

        export.echo()

        msg(
            f"\nExporting finished. Run as 'cd {export_path} && python run.py'",
            color="yellow",
        )


def copy_and_overwrite(from_path, to_path):
    if os.path.exists(to_path):
        shutil.rmtree(to_path)
    shutil.copytree(from_path, to_path)


class Export:
    def __init__(self, project_path, export_path):
        self.project_path = project_path
        self.export_path = export_path

        shutil.rmtree(self.export_path, ignore_errors=True)

        # optional: move to subdirectory to enable relative imports
        self.subdirectory = ""
        self.export_path = os.path.join(self.export_path, self.subdirectory)
        os.makedirs(self.export_path)

        self._exported = []

    @property
    def export_root(self):
        if self.subdirectory == "":
            return self.export_path
        return self.export_path[: -len(self.subdirectory)]

    def write(self, filepath, data=None, meta=False):
        target_path = self.export_path if not meta else self.export_root
        target = os.path.join(target_path, filepath)
        if data is None:
            open(target, "w").close()
            return True

        if filepath.endswith(".json"):
            with open(target, "w") as f:
                f.write(
                    json.dumps(data, indent=4, sort_keys=True, default=lambda x: str(x))
                )
            return True

        if filepath.endswith(".py"):
            with open(target, "w") as f:
                f.write(data)
            return True

    def _resolve(self, source):
        if not isinstance(source, str):
            return os.path.relpath(inspect.getfile(source), self.project_path)

        return source

    def _imports(self, path):
        Import = namedtuple("Import", ["module", "name", "alias"])

        with open(path) as fh:
            root = ast.parse(fh.read(), path)

        for node in ast.iter_child_nodes(root):
            if isinstance(node, ast.Import):
                module = ""
            elif isinstance(node, ast.ImportFrom):
                module = node.module
            else:
                continue

            for n in node.names:
                yield Import(module, n.name, n.asname)

    def _find_import(self, module, top_level=""):
        module_path = os.path.join(top_level, module.replace(".", "/"))
        module_file = module_path
        if not os.path.isdir(os.path.join(self.project_path, module_file)):
            module_file += ".py"
        if not os.path.exists(os.path.join(self.project_path, module_file)):
            return False

        return module_path, module_file

    def get_imports(self, source):
        Import = namedtuple("Import", ["module", "path", "file"])
        source_filepath = os.path.join(self.project_path, source)
        top_level = os.path.dirname(source)
        if os.path.isdir(source_filepath):
            top_level = os.path.dirname(top_level)
            source_filepath = os.path.join(source_filepath, "__init__.py")
        imports = []
        for i in self._imports(source_filepath):
            module = i.name if i.module == "" else i.module
            resolved = self._find_import(module, top_level)
            if resolved is False:
                # try again as absolute import
                resolved = self._find_import(module)
                if resolved is False:
                    continue
            imports.append(Import(module, resolved[0], resolved[1]))

        return imports

    def echo(self):
        for k in self._exported:
            print(k)

    def copy(self, source, destination=None):
        if source in self._exported:
            return source
        source = self._resolve(source)
        if destination is None:
            destination = source
        # remap recursive vendors
        if destination.count("vendor/") > 1:
            destination = "vendor/" + destination.rsplit("vendor/", 1)[-1]
        dest = os.path.join(self.export_path, destination)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        src = os.path.join(self.project_path, source)
        cp = shutil.copyfile if not os.path.isdir(src) else copy_and_overwrite
        cp(os.path.join(self.project_path, source), dest)
        # create __init__.py files
        dirs = destination.split("/")
        for i in range(len(dirs)):
            init_py = os.path.join(self.export_path, "/".join(dirs[:i]), "__init__.py")
            if not os.path.isfile(init_py):
                open(init_py, "w").close()

        self._exported.append(destination)

        return source

    def get_import_statement(self, obj, alias=None):
        source = self._resolve(obj)
        if os.path.isdir(os.path.join(self.project_path, source)):
            module = source.replace("/", ".")
        else:
            module = source[:-3].replace("/", ".")
        if self.subdirectory != "":
            module = self.subdirectory + "." + module
        statement = f"from {module} import {obj.__name__}"
        if alias is not None and alias != obj.__name__:
            statement += " as " + alias

        return statement

    def module(self, source, from_module_path=False):
        source = self._resolve(source)
        if from_module_path:
            source = source.replace(".", "/")
            if os.path.isdir(os.path.join(self.project_path, source)):
                pass
            elif os.path.isfile(
                os.path.join(self.project_path, source.replace("/", ".") + ".py")
            ):
                source = source + ".py"
            else:
                return False
        self.copy(source)
        for imp in self.get_imports(source):
            self.module(imp.file)

        return source

    def machinable(self):
        with open(standalone.__file__, encoding="utf-8") as f:
            code = f.read()

        # parse import statements
        def parser(m):
            target = m.group(1)
            module, attribute = target.rsplit(".", 1)
            imp = importlib.import_module(module)
            obj = getattr(imp, attribute)

            source = inspect.getsource(obj)
            return source

        parsed = re.sub(r"#\s!include\s+(.*)\n", parser, code).replace(
            "Mixin = object", ""
        )

        with open(os.path.join(self.export_root, "machinable.py"), "w") as f:
            f.write(parsed)

    def entry_point(self, node, components):
        imports = self.get_import_statement(node["class"]) + "\n"
        for k, c in enumerate(components):
            imports += self.get_import_statement(c["class"]) + "\n"
        # language=python
        script = f"""\
import json

{imports}

with open('config.json') as f:
    config = json.load(f)

# load subcomponents
for k in range(len(config['components'])):
    config['components'][k]['class'] = locals()[config['components'][k]['class']]

{node['class'].__name__}(config['node']['args'], config['node']['flags']).dispatch(
    config['components'], config['store']
)
"""

        self.write("run.py", script, meta=True)
