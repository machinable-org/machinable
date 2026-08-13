"""machinable discovery."""

from __future__ import annotations

import ast
import os
from dataclasses import dataclass, field
from functools import lru_cache
from typing import TYPE_CHECKING, Literal

from pydantic import BaseModel

from machinable.config import Field
from machinable.interface import Interface
from machinable.utils import file_to_module

if TYPE_CHECKING:
    from machinable.project import Project

Resolved = Literal["full", "partial"]

# Directories never descended into, regardless of the ignore scheme
_FLOOR_DIRS = {"__pycache__", "node_modules", "storage", "tmp"}
# vendored/obfuscated remote sources are parsed into the graph but
# not reported at their physical location
_REMOTES_DIR = ("interface", "remotes")


@dataclass
class ConfigFieldInfo:
    """One reflected Config field; ``fields`` recurses into nested models."""

    name: str
    type: str
    default: object = None
    required: bool = False
    identifying: bool = True
    fields: list[ConfigFieldInfo] | None = None
    #: ``Field(description=...)`` — what the field means, for the editor's tooltip.
    description: str | None = None
    #: pydantic validation constraints as declared (``{"ge": 0, "le": 1}``). Clients
    #: render them (bounded inputs) and may check them before asking the server; the
    #: server stays authoritative, since only it runs the model.
    constraints: dict[str, object] | None = None


#: pydantic's declarative constraints, as they appear in ``Field(...)``. Validators and
#: ``Annotated[...]`` metadata are deliberately out of scope: this reflection is static
#: (the module is parsed, never imported): only literal declarations are readable.
_CONSTRAINT_KEYWORDS = frozenset(
    {
        "gt",
        "ge",
        "lt",
        "le",
        "multiple_of",
        "min_length",
        "max_length",
        "pattern",
        "max_digits",
        "decimal_places",
    }
)


@dataclass
class _FieldSpec:
    """What a field's right-hand side declares, before the annotation is considered."""

    required: bool = False
    default: object = None
    identifying: bool = True
    description: str | None = None
    constraints: dict[str, object] = field(default_factory=dict)


@dataclass
class MethodInfo:
    """A ``version_*`` or ``config_*`` method's static signature."""

    name: str
    signature: str
    doc: str | None = None
    source_line: int | None = None


@dataclass
class WidgetSpec:
    """Static widget descriptor: opaque meta + whether a stylesheet is shipped."""

    meta: dict
    has_css: bool


@dataclass
class ModuleInfo:
    """A discovered interface module (enumeration)."""

    module: str
    kind: str
    doc: str | None = None
    widget: bool = False
    source_file: str | None = None
    source_line: int | None = None
    resolved: Resolved = "full"


@dataclass
class ModuleSchemaInfo:
    """The static config schema for one discovered module."""

    module: str
    kind: str
    doc: str | None = None
    config_fields: list[ConfigFieldInfo] = field(default_factory=list)
    versions: list[str] = field(default_factory=list)
    version_methods: list[MethodInfo] = field(default_factory=list)
    config_methods: list[MethodInfo] = field(default_factory=list)
    axes: list[str] = field(default_factory=list)
    axis_methods: list[MethodInfo] = field(default_factory=list)
    widget: WidgetSpec | None = None
    source_file: str | None = None
    source_line: int | None = None
    resolved: Resolved = "full"


@lru_cache(maxsize=1)
def _anchor_kinds() -> dict[tuple[str, str], str]:
    """``(module, class) -> kind`` for machinable's own interface kinds.

    Built by importing machinable only (zero user code) so a project class is an
    interface iff its resolved base chain terminates at one of these anchors.
    """
    import machinable

    anchors: dict[tuple[str, str], str] = {}
    for name in dir(machinable):
        obj = getattr(machinable, name)
        if isinstance(obj, type) and issubclass(obj, Interface):
            kind = obj.kind or "Interface"
            anchors[(obj.__module__, obj.__name__)] = kind
            anchors[("machinable", name)] = kind  # the re-exported name
    # Manifest is not re-exported from the top level but is a legitimate base
    anchors.setdefault(("machinable.manifest", "Manifest"), "Manifest")
    return anchors


@dataclass
class _ParsedModule:
    module: str
    path: str
    classes: dict[str, ast.ClassDef]
    # local name -> (target_module, target_symbol); symbol "" means a module import
    imports: dict[str, tuple[str, str]]
    has_star: bool


@dataclass
class _Ref:
    """The resolution of a base expression."""

    anchor_kind: str | None = None
    anchor_name: str | None = None
    module: str | None = None
    classname: str | None = None

    @property
    def unresolved(self) -> bool:
        return self.anchor_kind is None and self.module is None


class SymbolGraph:
    """Lazily-parsed AST index that resolves inheritance across modules.

    ``files`` maps a dotted module name to its absolute path (every candidate in
    the project, including vendored and obfuscated-remote sources, so base chains
    resolve across those boundaries).
    """

    def __init__(self, project_dir: str, files: dict[str, str]):
        self.project_dir = project_dir
        self._files = files
        self._parsed: dict[str, _ParsedModule | None] = {}

    # -- parsing ------------------------------------------------------------- #

    def module(self, module: str) -> _ParsedModule | None:
        """The parsed module (cached), or ``None`` when absent/unparseable."""
        if module in self._parsed:
            return self._parsed[module]
        path = self._files.get(module)
        parsed = self._parse(module, path) if path else None
        self._parsed[module] = parsed
        return parsed

    def _parse(self, module: str, path: str) -> _ParsedModule | None:
        try:
            with open(path, encoding="utf-8") as handle:
                tree = ast.parse(handle.read(), filename=path)
        except (OSError, SyntaxError, ValueError):
            return None
        classes = {
            node.name: node for node in tree.body if isinstance(node, ast.ClassDef)
        }
        imports: dict[str, tuple[str, str]] = {}
        has_star = False
        for node in tree.body:
            if isinstance(node, ast.Import):
                for alias in node.names:
                    top = (alias.asname or alias.name).split(".")[0]
                    target = alias.name if alias.asname else top
                    imports[alias.asname or top] = (target, "")
            elif isinstance(node, ast.ImportFrom):
                base = self._resolve_from(module, node)
                if base is None:
                    continue
                for alias in node.names:
                    if alias.name == "*":
                        has_star = True
                        continue
                    imports[alias.asname or alias.name] = (base, alias.name)
        return _ParsedModule(module, path, classes, imports, has_star)

    def _resolve_from(self, module: str, node: ast.ImportFrom) -> str | None:
        """The absolute module a ``from … import`` targets (handles relative)."""
        if not node.level:
            return node.module
        # relative: drop `level` trailing segments of the current package
        parts = module.split(".")
        package = parts[: -node.level] if node.level <= len(parts) else []
        if node.module:
            package = [*package, *node.module.split(".")]
        return ".".join(package) or None

    # -- name resolution ----------------------------------------------------- #

    def _resolve_expr(
        self, pm: _ParsedModule, expr: ast.expr
    ) -> tuple[str | None, str]:
        """Resolve a name/attribute expression to ``(module, symbol)``."""
        if isinstance(expr, ast.Name):
            if expr.id in pm.imports:
                return pm.imports[expr.id]
            if expr.id in pm.classes:
                return (pm.module, expr.id)
            return (None, expr.id)
        if isinstance(expr, ast.Attribute):
            mod, sym = self._resolve_expr(pm, expr.value)
            if sym == "" and mod is not None:  # module.Attr
                return (mod, expr.attr)
            return (None, expr.attr)
        return (None, "")

    def resolve_base(self, pm: _ParsedModule, expr: ast.expr) -> _Ref:
        """Resolve a base-class expression to an anchor kind or a graph class."""
        mod, sym = self._resolve_expr(pm, expr)
        if mod is not None:
            anchors = _anchor_kinds()
            if (mod, sym) in anchors:
                return _Ref(
                    anchor_kind=anchors[(mod, sym)], anchor_name=sym, module=mod
                )
            target = self.module(mod)
            if target is not None and sym in target.classes:
                return _Ref(module=mod, classname=sym)
        return _Ref()  # unresolved (third-party, star-import, dynamic)

    # -- the interface MRO chain -------------------------------------------- #

    def chain(
        self, module: str, classname: str, _seen: set | None = None
    ) -> tuple[list[tuple[_ParsedModule, ast.ClassDef]], str | None, bool, set[str]]:
        """Resolved ancestry of a class.

        Returns ``(chain, anchor_kind, complete, anchor_names)``:
        the ``(module, ClassDef)`` pairs of the class and every project ancestor
        (nearest first), the kind of the terminating machinable anchor (or None
        if none was reached), whether resolution was complete (no unresolved
        base), and the set of anchor class names hit (e.g. ``{"Widget"}``).
        """
        _seen = _seen if _seen is not None else set()
        pm = self.module(module)
        if pm is None or classname not in pm.classes or (module, classname) in _seen:
            return [], None, True, set()
        _seen.add((module, classname))
        node = pm.classes[classname]
        acc: list[tuple[_ParsedModule, ast.ClassDef]] = [(pm, node)]
        kind: str | None = None
        complete = True
        anchor_names: set[str] = set()
        for base in node.bases:
            ref = self.resolve_base(pm, base)
            if ref.anchor_kind is not None:
                kind = kind or ref.anchor_kind
                if ref.anchor_name:
                    anchor_names.add(ref.anchor_name)
            elif ref.module is not None and ref.classname is not None:
                sub, sub_kind, sub_complete, sub_anchors = self.chain(
                    ref.module, ref.classname, _seen
                )
                acc.extend(sub)
                kind = kind or sub_kind
                complete = complete and sub_complete
                anchor_names |= sub_anchors
            elif isinstance(base, ast.Name) and base.id in ("BaseModel", "object"):
                continue  # benign non-interface base
            else:
                complete = False
        return acc, kind, complete, anchor_names

    # -- the module's interface class --------------------------------------- #

    def interface_class(self, module: str) -> tuple[str, str, Resolved] | None:
        """The first confirmed interface class in ``module``, à la.

        ``find_subclass_in_module``. Returns ``(classname, kind, resolved)`` or
        ``None`` when the module defines no interface.
        """
        pm = self.module(module)
        if pm is None:
            return None
        for name, node in pm.classes.items():
            _chain, kind, complete, _anchors = self.chain(module, name)
            if kind is not None:
                explicit = _class_kind_literal(node)
                resolved: Resolved = "full" if complete else "partial"
                return name, explicit or kind, resolved
        return None


def _class_kind_literal(node: ast.ClassDef) -> str | None:
    """An explicit ``kind = "…"`` class attribute, if present."""
    for stmt in node.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "kind":
                    if isinstance(stmt.value, ast.Constant) and isinstance(
                        stmt.value.value, str
                    ):
                        return stmt.value.value
    return None


def _docstring(node: ast.ClassDef | ast.FunctionDef) -> str | None:
    return ast.get_docstring(node)


def _literal(node: ast.expr | None) -> tuple[object, bool]:
    """``(value, ok)`` — literal-eval a default expression, best-effort."""
    if node is None:
        return None, True
    try:
        return ast.literal_eval(node), True
    except (ValueError, SyntaxError, TypeError):
        return None, False


def _format_signature(node: ast.FunctionDef) -> str:
    """A readable call signature with ``self`` dropped (``(value=0.01)``)."""
    args = node.args
    positional = list(args.posonlyargs) + list(args.args)
    if positional and positional[0].arg == "self":
        positional = positional[1:]
    defaults = list(args.defaults)
    # defaults align to the tail of posonlyargs+args (including self); recompute
    # against the self-stripped list by trimming the same number from the front
    n_all = len(args.posonlyargs) + len(args.args)
    offset = n_all - len(defaults)
    parts: list[str] = []
    for i, a in enumerate(positional, start=n_all - len(positional)):
        piece = a.arg
        if a.annotation is not None:
            piece += f": {ast.unparse(a.annotation)}"
        if i >= offset:
            dv = defaults[i - offset]
            sep = " = " if a.annotation is not None else "="
            piece += f"{sep}{ast.unparse(dv)}"
        parts.append(piece)
    if args.vararg is not None:
        parts.append(f"*{args.vararg.arg}")
    elif args.kwonlyargs:
        parts.append("*")
    for a, d in zip(args.kwonlyargs, args.kw_defaults):
        piece = a.arg
        if a.annotation is not None:
            piece += f": {ast.unparse(a.annotation)}"
        if d is not None:
            sep = " = " if a.annotation is not None else "="
            piece += f"{sep}{ast.unparse(d)}"
        parts.append(piece)
    if args.kwarg is not None:
        parts.append(f"**{args.kwarg.arg}")
    return "(" + ", ".join(parts) + ")"


def _methods(
    chain: list[tuple[_ParsedModule, ast.ClassDef]], prefix: str
) -> list[MethodInfo]:
    """``prefix``-named methods merged along the chain (child overrides)."""
    seen: dict[str, MethodInfo] = {}
    for _pm, node in chain:  # nearest first → first write wins
        for stmt in node.body:
            if isinstance(stmt, ast.FunctionDef) and stmt.name.startswith(prefix):
                token = stmt.name[len(prefix) :]
                if token and token not in seen:
                    seen[token] = MethodInfo(
                        name=token,
                        signature=_format_signature(stmt),
                        doc=_docstring(stmt),
                        source_line=stmt.lineno,
                    )
    return list(seen.values())


def _annotation_model_names(annotation: ast.expr) -> list[str]:
    """Candidate model class names referenced anywhere in an annotation."""
    names: list[str] = []
    for sub in ast.walk(annotation):
        if isinstance(sub, ast.Name):
            names.append(sub.id)
        elif isinstance(sub, ast.Attribute):
            names.append(sub.attr)
    return names


class _ConfigReflector:
    """Reflects Config fields, resolving nested models through the graph."""

    def __init__(self, graph: SymbolGraph):
        self.graph = graph
        self.ok = True  # cleared on any un-evaluable default

    def _resolve_class(
        self, pm: _ParsedModule, expr: ast.expr
    ) -> tuple[_ParsedModule, ast.ClassDef] | None:
        """A model/interface class referenced by name or ``Owner.Nested``."""
        if isinstance(expr, ast.Name):
            if expr.id in pm.classes:
                return pm, pm.classes[expr.id]
            if expr.id in pm.imports:
                mod, sym = pm.imports[expr.id]
                target = self.graph.module(mod) if mod else None
                if target is not None and sym in target.classes:
                    return target, target.classes[sym]
            return None
        if isinstance(expr, ast.Attribute):
            owner = self._resolve_class(pm, expr.value)
            if owner is not None:
                opm, onode = owner
                for node in onode.body:
                    if isinstance(node, ast.ClassDef) and node.name == expr.attr:
                        return opm, node
        return None

    def find_model(
        self, pm: _ParsedModule, name: str, local: dict[str, ast.ClassDef]
    ) -> tuple[_ParsedModule, ast.ClassDef] | None:
        """Locate a model class by name: Config-local, module-level, or imported."""
        if name in local:
            return pm, local[name]
        if name in pm.classes:
            return pm, pm.classes[name]
        if name in pm.imports:
            mod, sym = pm.imports[name]
            target = self.graph.module(mod) if mod else None
            if target is not None and sym in target.classes:
                return target, target.classes[sym]
        return None

    def fields(
        self,
        pm: _ParsedModule,
        model: ast.ClassDef,
        depth: int = 6,
        _seen: frozenset = frozenset(),
    ) -> list[ConfigFieldInfo]:
        if depth <= 0 or (pm.module, model.name) in _seen:
            return []
        seen = _seen | {(pm.module, model.name)}
        local = {n.name: n for n in model.body if isinstance(n, ast.ClassDef)}
        # inherited fields first (a Config extending another model), child overrides
        out: dict[str, ConfigFieldInfo] = {}
        for base in model.bases:
            found = self._resolve_class(pm, base)
            if found is not None:
                for f in self.fields(found[0], found[1], depth, seen):
                    out[f.name] = f
        for stmt in model.body:
            if not isinstance(stmt, ast.AnnAssign) or not isinstance(
                stmt.target, ast.Name
            ):
                continue
            name = stmt.target.id
            if name.startswith("_") or name.endswith("_") or name == "model_config":
                continue
            out[name] = self._field(pm, name, stmt, local, depth, seen)
        return list(out.values())

    def _field(
        self,
        pm: _ParsedModule,
        name: str,
        stmt: ast.AnnAssign,
        local: dict[str, ast.ClassDef],
        depth: int,
        seen: frozenset,
    ) -> ConfigFieldInfo:
        spec = self._default(stmt.value)
        nested = None
        for candidate in _annotation_model_names(stmt.annotation):
            found = self.find_model(pm, candidate, local)
            if found is not None:
                sub = self.fields(found[0], found[1], depth - 1, seen)
                if sub:
                    nested = sub
                break
        return ConfigFieldInfo(
            name=name,
            type=ast.unparse(stmt.annotation),
            default=spec.default,
            required=spec.required,
            identifying=spec.identifying,
            fields=nested,
            description=spec.description,
            constraints=spec.constraints or None,
        )

    def _default(self, value: ast.expr | None) -> _FieldSpec:
        """The declared spec from a field's right-hand side."""
        if value is None:
            return _FieldSpec(required=True)
        if isinstance(value, ast.Call) and _call_name(value.func) in (
            "Field",
            "PydanticField",
        ):
            return self._field_call(value)
        default, ok = _literal(value)
        if not ok:
            self.ok = False
        return _FieldSpec(default=default)

    def _field_call(self, call: ast.Call) -> _FieldSpec:
        spec = _FieldSpec()
        has_default = False
        for kw in call.keywords:
            if kw.arg == "identifying":
                spec.identifying = _literal(kw.value)[0] is not False
            elif kw.arg == "default_factory":
                has_default = True
            elif kw.arg == "default":
                has_default = True
                spec.default = _literal(kw.value)[0]
            elif kw.arg == "description":
                described, ok = _literal(kw.value)
                if ok and isinstance(described, str):
                    spec.description = described
            elif kw.arg in _CONSTRAINT_KEYWORDS:
                bound, ok = _literal(kw.value)
                if ok:
                    spec.constraints[kw.arg] = bound
        if call.args:  # positional default
            first = call.args[0]
            if not (isinstance(first, ast.Name) and first.id == "PydanticUndefined"):
                has_default = True
                spec.default = _literal(first)[0]
        spec.required = not has_default
        return spec


def _call_name(func: ast.expr) -> str | None:
    if isinstance(func, ast.Name):
        return func.id
    if isinstance(func, ast.Attribute):
        return func.attr
    return None


def _class_attr(node: ast.ClassDef, name: str) -> ast.expr | None:
    for stmt in node.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == name:
                    return stmt.value
        elif isinstance(stmt, ast.AnnAssign) and isinstance(stmt.target, ast.Name):
            if stmt.target.id == name and stmt.value is not None:
                return stmt.value
    return None


def _widget_spec(
    graph: SymbolGraph, chain: list[tuple[_ParsedModule, ast.ClassDef]]
) -> WidgetSpec | None:
    """A widget descriptor when the class ships an ``_esm`` frontend."""
    esm = css = meta_node = None
    for _pm, node in chain:  # nearest first
        esm = esm if esm is not None else _class_attr(node, "_esm")
        css = css if css is not None else _class_attr(node, "_css")
        meta_node = (
            meta_node if meta_node is not None else _class_attr(node, "widget_meta")
        )
    if esm is None:
        return None
    esm_value, _ = _literal(esm)
    if not esm_value:  # inherited empty default / unset
        return None
    css_value, _ = _literal(css) if css is not None else (None, True)
    meta, _ = _literal(meta_node) if meta_node is not None else ({}, True)
    return WidgetSpec(
        meta=meta if isinstance(meta, dict) else {}, has_css=bool(css_value)
    )


def _config_class(
    graph: SymbolGraph, chain: list[tuple[_ParsedModule, ast.ClassDef]]
) -> tuple[_ParsedModule, ast.ClassDef] | None:
    """The nested ``Config`` the interface uses (own, else nearest ancestor's)."""
    for pm, node in chain:
        for stmt in node.body:
            if isinstance(stmt, ast.ClassDef) and stmt.name == "Config":
                return pm, stmt
    return None


class Discovery(Interface):
    """Enumerates a project's interface modules and their static schema.

    The base does a read-only, import-free AST walk honoring ``.gitignore``.
    Subclass :meth:`excluded` to swap the ignore scheme, or :meth:`discover` for
    a wholly different source (a remote catalog). Declared via
    ``Project.on_resolve_discovery()``.
    """

    kind = "Discovery"

    class Config(BaseModel):
        ignore_files: list[str] = Field(default=[".gitignore"], identifying=False)
        patterns: list[str] = Field(default=[], identifying=False)

    # -- the ignore seam ----------------------------------------------------- #

    def _matcher(self, project_dir: str):
        """A gitignore matcher over the configured ignore files (+ patterns)."""
        try:
            import pathspec
        except ImportError:  # pathspec absent → safety floor only
            return None
        lines: list[str] = list(self.config.patterns or [])
        for name in self.config.ignore_files or []:
            path = os.path.join(project_dir, name)
            try:
                with open(path, encoding="utf-8") as handle:
                    lines.extend(handle.read().splitlines())
            except OSError:
                continue
        if not lines:
            return None
        # pathspec >=1.0 renamed the git matcher to "gitignore"; fall back to the
        # 0.12 name so both are supported.
        try:
            return pathspec.PathSpec.from_lines("gitignore", lines)
        except (KeyError, LookupError, ValueError):
            return pathspec.PathSpec.from_lines("gitwildmatch", lines)

    def excluded(self, rel_path: str, *, is_dir: bool) -> bool:
        """Whether ``rel_path`` (project-relative, ``/``-separated) is ignored."""
        spec = getattr(self, "_spec", None)
        if spec is None:
            return False
        probe = rel_path + "/" if is_dir else rel_path
        return spec.match_file(probe)

    # -- the source walk ----------------------------------------------------- #

    def _walk(self, project_dir: str) -> dict[str, str]:
        """``module -> path`` for every candidate source file (best-effort)."""
        self._spec = self._matcher(project_dir)
        files: dict[str, str] = {}
        visited: set[str] = set()
        for root, dirs, names in os.walk(project_dir, followlinks=True):
            real = os.path.realpath(root)
            if real in visited:  # symlink cycle (nested vendors)
                dirs[:] = []
                continue
            visited.add(real)
            rel_root = os.path.relpath(root, project_dir)
            kept: list[str] = []
            for d in sorted(dirs):
                if d.startswith(".") or d in _FLOOR_DIRS:
                    continue
                rel = d if rel_root == "." else f"{rel_root}/{d}"
                if self.excluded(rel.replace(os.sep, "/"), is_dir=True):
                    continue
                kept.append(d)
            dirs[:] = kept
            for name in sorted(names):
                if not name.endswith(".py") or name.startswith("_"):
                    continue
                rel = name if rel_root == "." else f"{rel_root}/{name}"
                rel = rel.replace(os.sep, "/")
                if self.excluded(rel, is_dir=False):
                    continue
                files[file_to_module(rel)] = os.path.join(root, name)
        return files

    def _graph(self, project_dir: str) -> SymbolGraph:
        return SymbolGraph(project_dir, self._walk(project_dir))

    # -- enumeration --------------------------------------------------------- #

    def discover(
        self,
        graph: SymbolGraph | None = None,
        *,
        project: Project,
        catalog: Catalog,
    ) -> SymbolGraph:
        """Report local interface modules into ``catalog`` (first-wins)."""
        graph = graph or self._graph(project.path())
        remotes_prefix = ".".join(_REMOTES_DIR) + "."
        for module in graph._files:
            if module.startswith(remotes_prefix):
                continue  # obfuscated remote sources are named by RemoteDiscovery
            info = _module_info(graph, module)
            if info is not None:
                catalog.add(info)
        return graph

    def module_schema(
        self, module: str, *, project: Project, graph: SymbolGraph | None = None
    ) -> ModuleSchemaInfo:
        """The static schema for one module (raises ``LookupError`` if absent)."""
        graph = graph or self._graph(project.path())
        schema = _module_schema(graph, module, project)
        if schema is None:
            raise LookupError(f"No interface module '{module}' in {project.path()}")
        return schema


class RemoteDiscovery(Discovery):
    """Reports remotes declared via ``on_resolve_remotes()`` by their declared name.

    Static and non-fetching: a declared-but-unfetched remote is listed
    ``partial``; already-fetched sources (``interface/remotes/{obf}.py``) are
    parsed under the declared name.
    """

    def _declared(self, project: Project) -> dict:
        try:
            return project.provider().on_resolve_remotes() or {}
        except Exception:  # noqa: BLE001 — best-effort
            return {}

    def discover(
        self,
        graph: SymbolGraph | None = None,
        *,
        project: Project,
        catalog: Catalog,
    ) -> SymbolGraph:
        """Report declared remotes by name (parsing fetched sources if present)."""
        graph = graph or self._graph(project.path())
        for declared in self._declared(project):
            obf = ".".join([*_REMOTES_DIR, declared.replace(".", "_")])
            info = _module_info(graph, obf, name=declared)
            if info is None:  # not fetched → known to exist, not introspectable
                info = ModuleInfo(module=declared, kind="Interface", resolved="partial")
            catalog.add(info)
        return graph

    def module_schema(
        self, module: str, *, project: Project, graph: SymbolGraph | None = None
    ) -> ModuleSchemaInfo:
        """Schema for a declared remote (``partial`` when unfetched)."""
        graph = graph or self._graph(project.path())
        if module in self._declared(project):
            obf = ".".join([*_REMOTES_DIR, module.replace(".", "_")])
            schema = _module_schema(graph, obf, project, name=module)
            if schema is not None:
                return schema
            return ModuleSchemaInfo(module=module, kind="Interface", resolved="partial")
        raise LookupError(f"'{module}' is not a declared remote")


def _source_ref(graph: SymbolGraph, pm: _ParsedModule, node: ast.ClassDef):
    try:
        rel = os.path.relpath(pm.path, graph.project_dir)
    except ValueError:
        return None, None
    if rel.startswith(".."):
        return None, None
    return rel.replace(os.sep, "/"), node.lineno


def _module_info(
    graph: SymbolGraph, module: str, *, name: str | None = None
) -> ModuleInfo | None:
    found = graph.interface_class(module)
    if found is None:
        return None
    classname, kind, resolved = found
    chain, _kind, _complete, anchor_names = graph.chain(module, classname)
    pm = graph.module(module)
    if pm is None:  # unreachable once interface_class succeeded; narrows the type
        return None
    node = pm.classes[classname]
    widget = _widget_spec(graph, chain)
    source_file, source_line = _source_ref(graph, pm, node)
    return ModuleInfo(
        module=name or module,
        kind=kind,
        doc=_docstring(node),
        widget=widget is not None,
        source_file=source_file,
        source_line=source_line,
        resolved=resolved,
    )


def _module_schema(
    graph: SymbolGraph, module: str, project: Project, *, name: str | None = None
) -> ModuleSchemaInfo | None:
    found = graph.interface_class(module)
    if found is None:
        return None
    classname, kind, resolved = found
    chain, _kind, _complete, _anchors = graph.chain(module, classname)
    pm = graph.module(module)
    if pm is None:  # unreachable once interface_class succeeded; narrows the type
        return None
    node = pm.classes[classname]

    reflector = _ConfigReflector(graph)
    config_fields: list[ConfigFieldInfo] = []
    cfg = _config_class(graph, chain)
    if cfg is not None:
        config_fields = reflector.fields(cfg[0], cfg[1])
    if not reflector.ok and resolved == "full":
        resolved = "partial"

    version_methods = _methods(chain, "version_")
    config_methods = _methods(chain, "config_")
    axis_methods = _methods(chain, "axis_")
    for extra in _provider_methods(graph, project, "config_"):
        if all(m.name != extra.name for m in config_methods):
            config_methods.append(extra)
    for extra in _provider_methods(graph, project, "axis_"):
        if all(m.name != extra.name for m in axis_methods):
            axis_methods.append(extra)

    source_file, source_line = _source_ref(graph, pm, node)
    return ModuleSchemaInfo(
        module=name or module,
        kind=kind,
        doc=_docstring(node),
        config_fields=config_fields,
        versions=[m.name for m in version_methods],
        version_methods=version_methods,
        config_methods=config_methods,
        axes=[m.name for m in axis_methods],
        axis_methods=axis_methods,
        widget=_widget_spec(graph, chain),
        source_file=source_file,
        source_line=source_line,
        resolved=resolved,
    )


def _provider_methods(
    graph: SymbolGraph, project: Project, prefix: str
) -> list[MethodInfo]:
    """``prefix``-named methods declared on the project's provider class (via AST)."""
    module = getattr(project, "_provider", "interface/project")
    if not isinstance(module, str):
        return []
    module = module.replace("/", ".")
    found = graph.interface_class(module)
    if found is None:
        return []
    chain, _kind, _complete, _anchors = graph.chain(module, found[0])
    return _methods(chain, prefix)


class Catalog:
    """Ordered module accumulator; the first scheme to claim a name keeps it."""

    def __init__(self):
        self._items: dict[str, ModuleInfo] = {}

    def add(self, info: ModuleInfo) -> None:
        """Record ``info`` unless its module name was already claimed."""
        self._items.setdefault(info.module, info)

    def entries(self) -> list[ModuleInfo]:
        """The accumulated modules, sorted by name."""
        return sorted(self._items.values(), key=lambda m: m.module)
