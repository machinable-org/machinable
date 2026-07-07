"""Configuration: pydantic Config handling, canonical identity, references."""

__all__ = [
    "to_dict",
    "Field",
    "identity_exclude",
    "canonical",
    "canonical_identity_key",
    "predicate_from_manifest",
    "import_object_by_path",
    "resolve_ref",
    "import_ref",
]
import collections.abc
import importlib
import re
import warnings
from inspect import isclass
from typing import TYPE_CHECKING, Any, cast, get_args, get_origin

import omegaconf
from pydantic import BaseModel, ValidationError
from pydantic import Field as PydanticField
from pydantic_core import PydanticUndefined

from machinable.errors import ConfigurationError

if TYPE_CHECKING:
    from machinable.interface import Interface


class _ModelPrototype(BaseModel):
    pass


def _nested_model(annotation: Any) -> "type[BaseModel] | None":
    """The single BaseModel inside an annotation, or ``None``.

    Resolves a direct model and a model behind ``Optional``/unions; a union of
    several models is ambiguous and yields ``None``.
    """
    if isclass(annotation) and issubclass(annotation, BaseModel):
        return annotation
    models = {
        found
        for arg in get_args(annotation)
        if (found := _nested_model(arg)) is not None
    }
    return models.pop() if len(models) == 1 else None


def check_unknown_keys(
    config: collections.abc.Mapping, model: type[BaseModel], _path: str = ""
) -> None:
    """Raise on config keys that the Config (or a nested model) does not declare.

    Pydantic ignores extra keys by default, so a typo in an update would
    validate silently against the defaults and, since config is identity,
    dedup onto the wrong record. A model that sets ``extra`` in its
    ``model_config`` (directly or inherited) keeps its own choice at that
    level; nested models are checked through ``Optional``/single-model unions
    and ``list``/``dict`` containers.
    """
    handles_extras = "extra" in model.model_config
    for key, value in config.items():
        field = model.model_fields.get(key)
        if field is None:
            if handles_extras:
                continue
            declared = ", ".join(model.model_fields) or "<none>"
            error = ConfigurationError(
                f"Unknown config key '{_path}{key}' "
                f"(declared fields: {declared}). Fix the name, or set "
                f'model_config = ConfigDict(extra="allow") on the Config '
                f"to accept free-form keys."
            )
            # structured location for API clients (field-attached error display)
            error.paths = [f"{_path}{key}"]
            raise error
        _check_annotation(value, field.annotation, f"{_path}{key}")


def _check_annotation(value: Any, annotation: Any, path: str) -> None:
    origin = get_origin(annotation)
    args = get_args(annotation)
    if origin in (list, tuple, set, frozenset) and isinstance(value, list | tuple):
        if args:
            for i, item in enumerate(value):
                _check_annotation(item, args[0], f"{path}[{i}]")
        return
    if (
        origin in (dict, collections.abc.Mapping)
        and len(args) == 2
        and isinstance(value, collections.abc.Mapping)
    ):
        for k, v in value.items():
            _check_annotation(v, args[1], f"{path}.{k}")
        return
    nested = _nested_model(annotation)
    if nested is not None and isinstance(value, collections.abc.Mapping):
        check_unknown_keys(value, nested, f"{path}.")


def from_interface(
    interface: "Interface | type[Interface]",
) -> "tuple[dict, type[BaseModel] | None]":
    """The default config dict and Config model class of an interface."""
    if not isclass(interface):
        interface = interface.__class__

    if not hasattr(interface, "Config"):
        return {}, None

    config = getattr(interface, "Config")

    # pydantic model, the only supported Config form
    if isinstance(config, type(_ModelPrototype)):
        with warnings.catch_warnings(record=True):  # ignore pydantic warnings
            try:
                return config().model_dump(), config
            except ValidationError:
                # required field(s) without a default: pydantic forbids the bare
                # ``config()`` instantiation, so build the default map per-field.
                return _model_defaults(config), config

    raise ConfigurationError(
        f"Interface Config must subclass pydantic.BaseModel, but "
        f"{interface.__name__}.Config is a {type(config).__name__}. Plain dict and "
        f"dataclass/bare-class Config are no longer supported; define "
        f"`class Config(pydantic.BaseModel): ...`."
    )


def _model_defaults(model: type[BaseModel]) -> dict:
    """Default config for a pydantic model, tolerant of required fields.

    Mirrors ``model().model_dump()`` but never instantiates the model, so a field
    without a default (``PydanticUndefined``) is omitted rather than raising. Such
    required fields are simply absent from the ``_default_`` layer, which is exactly
    right for identity: with no default to compare against they are never
    default-stripped, hence always part of the canonical form. Nested models are
    recursed into so their defaults are represented too.
    """
    out: dict = {}
    for name, field in model.model_fields.items():
        default = field.get_default(call_default_factory=True)
        if default is PydanticUndefined:
            continue  # required: omit; default-strip keeps the supplied value whole
        if isinstance(default, BaseModel):
            out[name] = default.model_dump()
        else:
            out[name] = default
    return out


def match_method(definition: str) -> tuple[str, str] | None:
    """Parse a ``name(args)`` reference into ``(name, args)``, or ``None``.

    ``args`` may contain balanced nested parentheses (``fit(bounds=(0, 1))``).
    Expression strings like ``"foo(1) + bar(2)"`` do not match, since their
    final parenthesis does not close the opening one; consumers additionally
    verify that ``name`` refers to a real method before acting on a match.
    """
    fn_match = re.match(r"^(?P<method>\w+)\s?\((?P<args>.*)\)$", definition)
    if fn_match is None:
        return None

    args = fn_match.groupdict()["args"]
    depth = 0
    for char in args:
        if char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
            if depth < 0:  # closes the outer call early: not a single call
                return None
    if depth != 0:
        return None

    return fn_match.groupdict()["method"], args


def _has_config_method(interface: "Interface | None", function: str) -> bool:
    """True when ``function(...)`` refers to a real config method.

    Checks the interface and the project provider. Without an interface
    context (legacy callers) assume yes, preserving prior behaviour. This
    stops arbitrary strings that merely contain parentheses (e.g. a label
    ``"foo (bar)"``) from being misread as config methods.
    """
    if interface is None:
        return True
    method = "config_" + function
    if hasattr(interface, method):
        return True
    try:
        from machinable.project import Project

        return hasattr(Project.get().provider(), method)
    except Exception:
        return False


def rewrite_config_methods(
    config: collections.abc.Mapping | str | list | tuple,
    interface: "Interface | None" = None,
) -> Any:
    """Rewrite config-method references into omegaconf resolver calls."""
    if isinstance(config, list):
        return [rewrite_config_methods(v, interface) for v in config]

    if isinstance(config, tuple):
        return (rewrite_config_methods(v, interface) for v in config)

    if isinstance(config, collections.abc.Mapping):
        items = cast("collections.abc.Mapping[Any, Any]", config).items()
        return {k: rewrite_config_methods(v, interface) for k, v in items}

    if isinstance(config, str):
        matched = match_method(config)
        if matched is not None and _has_config_method(interface, matched[0]):
            function, args = matched
            return '${config_method:"' + function + '","' + args + '"}'

    return config


def to_dict(dict_like):
    """Convert omegaconf containers (recursively) into plain dicts."""
    if isinstance(dict_like, omegaconf.DictConfig | omegaconf.ListConfig):
        return omegaconf.OmegaConf.to_container(dict_like)

    if isinstance(dict_like, list | tuple):
        return dict_like.__class__([k for k in dict_like])

    if not isinstance(dict_like, collections.abc.Mapping):
        return dict_like

    return {k: to_dict(v) for k, v in dict_like.items()}


def Field(default: Any = PydanticUndefined, *, identifying: bool = True, **kwargs: Any):
    """``pydantic.Field`` with machinable extensions.

    ``identifying=False`` marks the field as *non-identifying*: it is excluded from
    the config-identity hash (e.g. an environment-dependent storage URI). The flag
    is stored in a namespaced ``json_schema_extra`` slot so it never collides with
    user/JSON-schema keys, and is read back by :func:`identity_exclude`.
    """
    if identifying is False:
        extra = dict(kwargs.pop("json_schema_extra", None) or {})
        namespaced = dict(extra.get("machinable", {}))
        namespaced["identifying"] = False
        extra["machinable"] = namespaced
        kwargs["json_schema_extra"] = extra
    return PydanticField(default, **kwargs)


def identity_exclude(config_cls: Any, _prefix: str = "") -> set[str]:
    """Dotted field paths a pydantic ``Config`` marks non-identifying via :func:`Field`.

    Recurses into nested models (direct or behind ``Optional``), producing
    paths like ``data.uri``. Models inside containers (``list[Sub]``) are not
    reached since exclusion there has no addressable path.
    """
    out: set[str] = set()
    for name, field in getattr(config_cls, "model_fields", {}).items():
        extra = getattr(field, "json_schema_extra", None)
        if isinstance(extra, collections.abc.Mapping):
            namespaced = extra.get("machinable")
            if (
                isinstance(namespaced, collections.abc.Mapping)
                and namespaced.get("identifying") is False
            ):
                # the whole subtree leaves identity; no need to recurse
                out.add(_prefix + name)
                continue
        nested = _nested_model(field.annotation)
        if nested is not None:
            out |= identity_exclude(nested, f"{_prefix}{name}.")
    return out


def canonical(
    resolved: collections.abc.Mapping,
    default: collections.abc.Mapping | None = None,
    exclude: collections.abc.Collection[str] = (),
) -> dict:
    """Canonical (identity) form of a *resolved* config mapping.

    Recursively strips keys that equal their default (compared against ``default``,
    machinable's ``_default_`` layer) and drops non-identifying ``exclude`` fields
    (dotted paths reaching into nested mappings, e.g. ``data.uri``). Keys absent
    from ``default`` (free-form deviations and required fields) are kept
    verbatim. Numerics are **not** folded: pydantic coercion has already aligned
    types upstream, so a plain ``==`` against the coerced default is correct, and
    free-form container contents are hashed as-is.
    """
    default = default or {}
    out: dict = {}
    for key, value in resolved.items():
        if key in exclude:
            continue
        nested_exclude = {
            path[len(key) + 1 :] for path in exclude if path.startswith(f"{key}.")
        }
        if key in default:
            dv = default[key]
            if isinstance(value, collections.abc.Mapping) and isinstance(
                dv, collections.abc.Mapping
            ):
                sub = canonical(value, dv, nested_exclude)
                if sub:  # whole nested dict at default → stripped
                    out[key] = sub
                continue
            if value == dv:
                continue
        elif nested_exclude and isinstance(value, collections.abc.Mapping):
            sub = canonical(value, {}, nested_exclude)
            if sub:
                out[key] = sub
            continue
        out[key] = value
    return out


def canonical_identity_key(
    module: str | None,
    resolved: collections.abc.Mapping,
    default: collections.abc.Mapping | None = None,
    exclude: collections.abc.Collection[str] = (),
) -> str:
    """Content-addressed config identity: ``hash(module + canonical(config))``.

    The single source of truth for ``identity_key`` so the live (materialize) and
    reindex sites cannot drift. Default-strip needs only the resolved/`_default_`
    layers (always present in ``model.json``); ``exclude`` (``identifying=False``
    fields) needs the Config class and is supplied where available.
    """
    from machinable.utils import object_hash

    return object_hash(
        {"module": module, "config": canonical(resolved, default, exclude)}
    )[:24]


def predicate_from_manifest(
    location: str,
    *keys: str,
    manifest: str = "manifest.json",
) -> dict:
    """Build a content predicate from keys in a blob's JSON manifest.

    Convenience for ``on_compute_predicate`` in the volatile-location pattern: an
    interface excludes its environment-dependent ``*_uri`` from identity (via
    ``Field(..., identifying=False)``) and re-identifies the underlying data here by
    a stable id stored in a manifest beside it. ``location`` may be a plain path or a
    ``scheme://`` URI.
    """
    from machinable.utils import load_file, uri_to_path

    base = uri_to_path(location) if "://" in str(location) else location
    data = load_file([base, manifest], None)
    if not isinstance(data, collections.abc.Mapping):
        raise FileNotFoundError(f"No manifest {manifest!r} found at {base!r}")
    return {key: data[key] for key in keys}


def import_object_by_path(path: str) -> Any:
    """Import an object by a dotted or ``module:attr`` path.

    Resolves through :func:`importlib.import_module` so a given path maps to the
    single ``sys.modules``-cached object, avoiding the duplicate-class import
    boundary (two loads of the same module under different names → distinct class
    objects). Use canonically importable paths.
    """
    if ":" in path:
        module_path, _, attr = path.partition(":")
    else:
        module_path, _, attr = path.rpartition(".")
    if not module_path or not attr:
        raise ValueError(f"Invalid import path: {path!r}")
    obj: Any = importlib.import_module(module_path)
    for part in attr.split("."):
        obj = getattr(obj, part)
    return obj


def resolve_ref(ref: Any) -> tuple[Any, dict] | None:
    """Resolve a reference to ``(object, merged_kwargs)``.

    A reference is a ``get(module, version)`` element, ``"pkg.obj"`` or
    ``("pkg.obj", {...}, {...})``, reusing machinable's own parser (``extract``)
    and deep merge (``update_dict``):

        None                            -> None
        "pkg.Foo"                       -> Foo, {}
        ("pkg.Foo", {"a": 1})           -> Foo, {"a": 1}
        ("pkg.Foo", {"a": 1}, {"a": 2}) -> Foo, {"a": 2}   # deep, rightmost wins
    """
    if ref is None:
        return None
    from machinable.interface import extract  # lazy: interface imports config
    from machinable.utils import update_dict

    module, versions = extract(ref)
    if module is None:
        raise ValueError(f"Invalid reference: {ref!r}")
    obj = import_object_by_path(module)
    kwargs: dict = {}
    for version in versions or []:
        kwargs = update_dict(kwargs, version)
    return obj, to_dict(kwargs)


def import_ref(ref: Any) -> Any:
    """Resolve and instantiate a reference (``cls(**kwargs)``); ``None`` -> ``None``.

    Use :func:`resolve_ref` instead when you need to control construction.
    """
    resolved = resolve_ref(ref)
    if resolved is None:
        return None
    obj, kwargs = resolved
    return obj(**kwargs)
