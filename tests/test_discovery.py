"""Static, import-free interface discovery (machinable.discovery)."""

import textwrap

from machinable.discovery import Discovery
from machinable.project import Project


def _write(root, rel, content):
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(textwrap.dedent(content))
    return path


def _project(tmp_path):
    """A minimal project with an interface/project.py provider."""
    _write(tmp_path, "interface/project.py", "from machinable import Project\n")
    return str(tmp_path)


def _modules(project_dir):
    with Project(project_dir) as project:
        return {m.module: m for m in project.modules()}


def _schema(project_dir, module):
    with Project(project_dir) as project:
        return project.module_schema(module)


def test_enumeration_and_kinds(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "exp.py",
        """
        from machinable import Interface

        class Exp(Interface):
            '''An experiment.'''
        """,
    )
    _write(
        tmp_path,
        "run.py",
        """
        from machinable import Execution

        class Run(Execution):
            pass
        """,
    )
    mods = _modules(str(tmp_path))
    assert mods["exp"].kind == "Interface"
    assert mods["exp"].doc == "An experiment."
    assert mods["exp"].resolved == "full"
    assert mods["run"].kind == "Execution"


def test_config_and_version_and_source(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "m.py",
        """
        from pydantic import BaseModel
        from machinable import Interface

        class M(Interface):
            class Config(BaseModel):
                lr: float = 0.1

            def version_big(self, layers: int = 4):
                '''Bigger.'''
                return {"layers": layers}
        """,
    )
    schema = _schema(str(tmp_path), "m")
    fields = {f.name: f for f in schema.config_fields}
    assert fields["lr"].default == 0.1 and fields["lr"].required is False
    assert set(schema.versions) == {"big"}
    method = schema.version_methods[0]
    assert "layers" in method.signature and method.doc == "Bigger."
    assert schema.source_file == "m.py"
    assert method.source_line > schema.source_line


def test_nested_and_list_config_models(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "p.py",
        """
        from pydantic import BaseModel
        from machinable import Interface

        class Sub(BaseModel):
            n: int = 1

        class P(Interface):
            class Config(BaseModel):
                sub: Sub = Sub()
                many: list[Sub] = []
                flat: str = "x"
        """,
    )
    fields = {f.name: f for f in _schema(str(tmp_path), "p").config_fields}
    assert [f.name for f in fields["sub"].fields] == ["n"]
    assert [f.name for f in fields["many"].fields] == ["n"]  # through list[]
    assert fields["flat"].fields is None


def test_inheritance_across_modules(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "base.py",
        """
        from pydantic import BaseModel
        from machinable import Interface

        class Base(Interface):
            class Config(BaseModel):
                shared: int = 7

            def version_common(self):
                return {}
        """,
    )
    _write(
        tmp_path,
        "child.py",
        """
        from base import Base

        class Child(Base):
            pass
        """,
    )
    mods = _modules(str(tmp_path))
    assert mods["child"].kind == "Interface" and mods["child"].resolved == "full"
    schema = _schema(str(tmp_path), "child")
    # inherited Config and version method resolve across the module boundary
    assert any(f.name == "shared" for f in schema.config_fields)
    assert set(schema.versions) == {"common"}


def test_extended_config_merges_parent_fields(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "base.py",
        """
        from pydantic import BaseModel
        from machinable import Interface

        class Base(Interface):
            class Config(BaseModel):
                a: int = 1
        """,
    )
    _write(
        tmp_path,
        "ext.py",
        """
        from base import Base

        class Ext(Base):
            class Config(Base.Config):
                b: int = 2
        """,
    )
    fields = {f.name for f in _schema(str(tmp_path), "ext").config_fields}
    assert fields == {"a", "b"}


def test_config_methods_union_provider(tmp_path):
    _write(
        tmp_path,
        "interface/project.py",
        """
        from machinable import Project

        class P(Project):
            def config_prov(self):
                return 1
        """,
    )
    _write(
        tmp_path,
        "m.py",
        """
        from machinable import Interface

        class M(Interface):
            def config_local(self):
                return 2
        """,
    )
    names = {c.name for c in _schema(str(tmp_path), "m").config_methods}
    assert {"local", "prov"} <= names


def test_dynamic_base_is_not_discovered(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "dyn.py",
        """
        import types
        Base = types.new_class("Base")

        class Dyn(Base):
            pass
        """,
    )
    # unresolvable base, no machinable anchor
    assert "dyn" not in _modules(str(tmp_path))


def test_unevaluable_default_marks_partial(tmp_path):
    _project(tmp_path)
    _write(
        tmp_path,
        "u.py",
        """
        from pydantic import BaseModel
        from machinable import Interface, Field

        def _factory():
            return []

        class U(Interface):
            class Config(BaseModel):
                items: list = Field(default_factory=_factory)
                weird: int = int("1")
        """,
    )
    schema = _schema(str(tmp_path), "u")
    assert schema.resolved == "partial"
    # a default_factory field is still non-required, just without a literal value
    items = next(f for f in schema.config_fields if f.name == "items")
    assert items.required is False


def test_side_effects_are_never_executed(tmp_path):
    _project(tmp_path)
    marker = tmp_path / "SIDE_EFFECT"
    _write(
        tmp_path,
        "boom.py",
        f"""
        from machinable import Interface
        open({str(marker)!r}, "w").write("x")   # top-level side effect

        class Boom(Interface):
            pass
        """,
    )
    mods = _modules(str(tmp_path))
    assert "boom" in mods  # discovered…
    assert not marker.exists()  # …without executing its side effect


def test_gitignore_and_floor_are_respected(tmp_path):
    _project(tmp_path)
    _write(tmp_path, ".gitignore", "ignored/\n")
    _write(
        tmp_path,
        "ignored/hidden.py",
        "from machinable import Interface\nclass Hidden(Interface): pass\n",
    )
    _write(
        tmp_path,
        ".venv/pkg.py",
        "from machinable import Interface\nclass Venv(Interface): pass\n",
    )
    _write(
        tmp_path,
        "__pycache__/junk.py",
        "from machinable import Interface\nclass Junk(Interface): pass\n",
    )
    mods = _modules(str(tmp_path))
    assert "ignored.hidden" not in mods  # gitignored
    assert not any(m.startswith(".venv") for m in mods)  # safety floor (dot-dir)
    assert not any("junk" in m for m in mods)  # __pycache__ floor


def test_excluded_matcher(tmp_path):
    _write(tmp_path, ".gitignore", "*.tmp\nbuild/\n")
    d = Discovery()
    d._spec = d._matcher(str(tmp_path))
    assert d.excluded("x.tmp", is_dir=False) is True
    assert d.excluded("build", is_dir=True) is True
    assert d.excluded("keep.py", is_dir=False) is False


def test_remotes_reported_by_declared_name(tmp_path):
    _write(
        tmp_path,
        "interface/project.py",
        """
        from machinable import Project

        class P(Project):
            def on_resolve_remotes(self):
                return {"remote.exp": "url+https://example.com/exp.py"}
        """,
    )
    mods = _modules(str(tmp_path))
    # declared under its dotted name, partial because unfetched, never crashes
    assert "remote.exp" in mods
    assert mods["remote.exp"].resolved == "partial"


def test_local_shadows_remote_first_wins(tmp_path):
    _write(
        tmp_path,
        "interface/project.py",
        """
        from machinable import Project

        class P(Project):
            def on_resolve_remotes(self):
                return {"shadowed": "url+https://example.com/x.py"}
        """,
    )
    _write(
        tmp_path,
        "shadowed.py",
        "from machinable import Interface\nclass Shadowed(Interface): pass\n",
    )
    # local discovery runs first; the local module keeps the name (full, not partial)
    assert _modules(str(tmp_path))["shadowed"].resolved == "full"


def test_discovery_module_is_fastapi_free():
    # a fresh interpreter so we never mutate this process's sys.modules
    import subprocess
    import sys

    code = (
        "import sys, machinable.discovery\n"
        "assert 'fastapi' not in sys.modules, sorted(m for m in sys.modules "
        "if m.startswith('fastapi'))\n"
    )
    result = subprocess.run(
        [sys.executable, "-c", code], capture_output=True, text=True
    )
    assert result.returncode == 0, result.stderr
