import os
import shutil
import stat
import subprocess
import sys

import pytest
from pydantic import BaseModel

from machinable import Execution, Interface, Project, errors, get


def _usable_bash():
    """A bash that can run scripts.

    On Windows, PATH may resolve `bash` to the System32 WSL stub, which fails
    when no distribution is installed; probe candidates and fall back to Git
    Bash.
    """
    candidates = [shutil.which("bash")]
    for base in (os.environ.get("ProgramFiles"), os.environ.get("ProgramW6432")):
        if base:
            candidates.append(os.path.join(base, "Git", "bin", "bash.exe"))
    for candidate in candidates:
        if not candidate or not os.path.isfile(candidate):
            continue
        try:
            probe = subprocess.run(
                [candidate, "-c", "echo ok"],
                capture_output=True,
                text=True,
                timeout=30,
            )
        except (OSError, subprocess.TimeoutExpired):
            continue
        if probe.returncode == 0 and probe.stdout.strip() == "ok":
            return candidate
    return None


def test_interface(tmp_storage):
    component = Execution.make("dummy")
    assert component.module == "dummy"
    assert isinstance(str(component), str)
    assert isinstance(repr(component), str)
    assert component.config.a == 1

    assert component.version() == []
    assert component.version("test") == ["test"]
    assert component.version() == ["test"]
    assert component.version("replace", overwrite=True) == ["replace"]
    component.version({"a": -1}, overwrite=True)
    assert component.config.a == -1
    component.version({"a": 1})
    assert component.config.a == 1

    component = Execution.from_model(Execution.model(component))
    serialized = component.serialize()
    assert serialized["config"]["a"] == 1

    component = Execution.make("dummy").materialize()
    assert component.version() == []
    with pytest.raises(errors.MachinableError):
        component.version(["modify"])


def test_interface_launch(tmp_storage):
    component = Interface()
    assert not component.is_mounted()
    component.launch()
    assert component.is_mounted()
    assert component.execution.is_finished()

    component = Interface()
    with Execution() as execution:
        component.launch()
        component.launch()
        component.launch()
    assert len(execution.interfaces) == 1

    class Runnable(Execution):
        class Config(BaseModel):
            run: int = 1

        def __call__(self):
            pass

    with Execution():
        e1 = Runnable().launch()
        e2 = Runnable({"run": 2}).launch()
    assert e1.execution.is_finished()
    assert e2.execution.is_finished()
    assert e1.nickname != e2.nickname

    class Example(Execution):
        def __call__(self):
            print("hello world")

    get(Example).launch()


def test_interface_relations(tmp_storage):
    project = Project.get()
    component = Interface.instance("basic")
    execution = Execution().add(component)
    component.push_related("project", project)
    component.cached(False)
    execution.dispatch()

    assert component.project.name() == "project"
    assert component.executions[0].is_finished()
    assert len(component.uses) == 0

    with pytest.raises(errors.MachinableError):
        component.version("attempt_overwrite")

    derived = Execution.make("dummy", derived_from=component)
    assert derived.ancestor is component
    derived_execution = Execution().add(derived).dispatch()

    component.__related__ = {}
    component._relation_cache = {}
    execution.__related__ = {}
    execution._relation_cache = {}
    derived.__related__ = {}
    derived._relation_cache = {}
    derived_execution.__related__ = {}
    derived_execution._relation_cache = {}

    assert derived.ancestor.id == component.id
    assert derived.ancestor.hello() == "there"
    assert component.derived[0].id == derived.id

    derived = Execution.make("dummy", {"a": 2}, derived_from=component)
    Execution().add(derived).dispatch()
    assert len(component.derived) == 2

    assert component.derive().id != component.id
    derived = component.derive(version=component.config)
    Execution().add(derived).dispatch()


class DataInterface(Interface):
    class Config(BaseModel):
        dataset: str = "mnist"

    def hello(self):
        return "element"


def test_interface_lifecycle(tmp_storage):
    component = Execution.make("interface.events_check")
    component.launch()
    assert len(component.load_file("events.json")) == 6


class ExportInterface(Execution):
    def __call__(self):
        print("Hello world")
        self.save_file("test_run.json", {"success": True})


def test_interface_export(tmp_storage):
    component = ExportInterface()

    script = Execution().dispatch_code(component, inline=False)

    with pytest.raises(FileNotFoundError):
        exec(script)

    Execution().add(component).materialize()

    script = Execution().dispatch_code(component, inline=False)

    assert not component.execution.is_started()

    exec(script)

    assert component.execution.is_finished()
    assert component.load_file("test_run.json")["success"]

    component = ExportInterface()
    Execution().add(component).materialize()
    script = Execution().dispatch_code(component, inline=True)
    script_filepath = component.save_file("run.sh", script)
    st = os.stat(script_filepath)
    os.chmod(script_filepath, st.st_mode | stat.S_IEXEC)

    bash = _usable_bash()
    if bash is None:
        pytest.skip("no usable bash available")
    output = subprocess.run(
        [bash, script_filepath], capture_output=True, text=True, check=True
    ).stdout
    print(output)
    assert component.execution.is_finished()
    assert component.load_file("test_run.json")["success"]

    class OuterContext(Execution):
        def __call__(self):
            assert False, "Should not be called"

    c = ExportInterface().materialize()
    with OuterContext():
        script = Execution().dispatch_code(c, inline=False)
    exec(script)

    class EscapeTest(Execution):
        class Config(BaseModel):
            test: str = "method('valid_escape')"

        def config_method(self, value):
            # the return value must match the field's annotation (str)
            return f"escaped-{value}"

    c = EscapeTest().materialize()
    assert c.config.test == "escaped-valid_escape"
    exec(Execution().dispatch_code(c, inline=False))

    assert Execution().dispatch_code(c, inline=True).find("\n") == -1

    inline_cmd = Execution().dispatch_code(c, inline=True)
    # strip the shell wrapper: '<python>' -c "<program>"
    prefix = "'{}' -c \"".format(sys.executable.replace("\\", "/"))
    assert inline_cmd.startswith(prefix)
    exec(inline_cmd[len(prefix) : -1])


def test_interface_predicates(tmp_storage):
    e1 = get("predicate", {"a": 2})
    e1.launch()
    e2 = get("predicate", {"ignore_": 3})
    e2.launch()
    assert e1 != e2
    e3 = get("predicate", {"a": 4})
    e3.launch()
    assert e2 != e3


def test_interface_interactive_session(tmp_storage):
    class T(Execution):
        def is_valid(self):
            return True

    t = get(T)
    assert t.module == "__session__T"
    assert t.__model__._dump is not None

    t.launch()
    exec(Execution().dispatch_code(t, inline=False) + "\nassert interface__.is_valid()")
    assert t == get(T)

    class T(Execution):
        def extended(self):
            return True

        def is_valid(self):
            return True

    rt = get(T)
    assert rt.extended()

    class TT(T):
        pass

    rtt = get(TT)
    assert rtt != rt

    from tests.samples.in_session import InSession

    t = get(InSession, {"a": 2})
    t.launch()
    t2 = get(InSession, {"a": 2})
    assert t == t2


def test_interface_from_index(tmp_storage):
    c = Execution.make("dummy", {"a": 9}).materialize()
    cp = Execution.find_by_id(c.uuid, fetch=False)
    assert c.seed == c.seed
    assert c.nickname == cp.nickname


def test_deferred_collection(tmp_storage):
    # readiness is a collection question: deferred execution gathers the
    # grid, cached() answers per run
    c = Interface()
    with Execution().deferred() as execution:
        c.launch()
    assert execution.interfaces[0] is c
    assert not c.cached()
    c.launch()
    assert c.cached()
