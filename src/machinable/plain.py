"""Plain-config records: interfaces whose record any implementation can write.

A record's bytes normally come from Python: config resolution (defaults,
``~versions``, config methods, interpolation, pydantic coercion), hooks, the
ambient scopes and the ``with``-stack. An interface whose ``Config`` subclasses
:class:`PlainConfig` gives all of that up, so that its record is a function of
plain inputs only (project name, module, config, label, ``created_at_ns``,
``created_by``, the module's bases) and a non-Python writer derives the same
``id.json``, ``model.json``, record id and home as Python does
(``docs/design/format.md``, "Plain writer").

The rules are checked where they can be: the ``Config`` class's own rules when
it is defined (:class:`PlainConfig`), the interface's when the interface class
is defined (:func:`check_plain_interface`), and the rest when the record is made
(``Interface`` consults :func:`is_plain`). :func:`plain_record` is the reference
plain writer: the bytes it returns are the ones Python's materialization writes,
and the corpus's ``plain_records.json`` is generated from it.
"""

from __future__ import annotations

__all__ = [
    "PlainConfig",
    "PlainConfigError",
    "is_plain",
    "plain_record",
    "project_root",
]

import collections.abc
import json
import math
import types
import typing
from typing import Any, Literal, Union, get_args, get_origin

from pydantic import BaseModel, ConfigDict

from machinable.errors import ConfigurationError

# interface hooks a plain-config interface may not override: each runs Python
# a non-Python writer cannot reproduce (see plans/plain-config-records.md)
FORBIDDEN_HOOKS = (
    # config resolution
    "on_before_configure",
    "on_configure",
    "on_after_configure",
    # making the record
    "on_instantiate",
    "on_compute_predicate",
    "on_before_materialize",
    "on_materialize",
    "on_after_materialize",
    "on_commit",
    # what the record's keys and home are computed from
    "compute_predicate",
    "compute_predicate_key",
    "catalog_identity_key",
    "parent",
)

# model_config entries that would transform a value on the way to model_dump()
_TRANSFORMING_SETTINGS = (
    "alias_generator",
    "coerce_numbers_to_str",
    "str_strip_whitespace",
    "str_to_lower",
    "str_to_upper",
    "use_enum_values",
    "json_encoders",
)

# machinable's own modules, whose definitions of the hooks are the plain ones
_MACHINABLE_BASES = ("machinable.interface", "machinable.data")


class PlainConfigError(ConfigurationError):
    """A plain-config rule is broken.

    Raised when a :class:`PlainConfig` (or an interface using one) is defined
    against a rule, or when a record of one is made against a runtime rule.
    The message names the rule.

    Bases: ConfigurationError
    """


def _fail(owner: str, rule: str, detail: str) -> PlainConfigError:
    return PlainConfigError(f"{owner}: {detail} (plain-config rule: {rule})")


# ------------------------------------------------------------ the Config base


class PlainConfig(BaseModel):
    """The base of a ``Config`` whose record any implementation can write.

    ``class Config(PlainConfig)`` declares that the config is plain data: every
    field is required (no default, no factory), identifying, of a JSON type
    (``str``, ``int``, ``float``, ``bool``, ``None``, ``list`` and ``dict`` of
    those, ``Literal`` of JSON scalars, a nested :class:`PlainConfig`), and the
    model is strict with ``extra="forbid"`` and has no validators, aliases,
    serializers or computed fields. A valid config therefore dumps as it was
    given, which is what makes ``canonical(config)`` the config itself.
    Breaking a rule raises :class:`PlainConfigError` when the class is defined.
    """

    model_config = ConfigDict(strict=True, extra="forbid")

    @classmethod
    def __pydantic_init_subclass__(cls, **kwargs: Any) -> None:
        super().__pydantic_init_subclass__(**kwargs)
        check_plain_config(cls)


def check_plain_config(model: type[BaseModel]) -> None:
    """Refuse a ``Config`` class that breaks a plain-config rule."""
    owner = model.__qualname__
    settings = model.model_config
    if settings.get("strict") is not True:
        raise _fail(owner, "strict", "the model must be strict (strict=True)")
    if settings.get("extra") != "forbid":
        raise _fail(owner, "extra=forbid", 'the model must set extra="forbid"')
    for name in _TRANSFORMING_SETTINGS:
        if settings.get(name):
            raise _fail(
                owner,
                "no transformation",
                f"model_config.{name} transforms values on the way to model_dump()",
            )

    decorators = model.__pydantic_decorators__
    for kind, rule in (
        ("validators", "no validators"),
        ("field_validators", "no validators"),
        ("root_validators", "no validators"),
        ("model_validators", "no validators"),
        ("field_serializers", "no serializers"),
        ("model_serializers", "no serializers"),
        ("computed_fields", "no computed fields"),
    ):
        found = getattr(decorators, kind, None)
        if found:
            raise _fail(
                owner, rule, f"declares {kind.replace('_', ' ')} {sorted(found)}"
            )

    for klass in model.__mro__:
        if klass in (PlainConfig, BaseModel) or not issubclass(klass, BaseModel):
            break
        for method in ("__init__", "model_post_init", "model_dump"):
            if method in klass.__dict__ and not getattr(
                klass.__dict__[method], "__module__", ""
            ).startswith("pydantic"):
                raise _fail(
                    owner,
                    "no code",
                    f"overrides {method}(), which runs on every config",
                )

    from machinable.config import identity_exclude

    excluded = identity_exclude(model)
    for name, field in model.model_fields.items():
        path = f"{owner}.{name}"
        if not field.is_required() or field.default_factory is not None:
            raise _fail(
                path,
                "no defaults",
                "has a default; every field of a plain config is required, so the"
                " record's _default_ layer is {}",
            )
        if name in excluded:
            raise _fail(
                path,
                "every field identifying",
                "is identifying=False; a plain config's identity is all of it",
            )
        if field.alias or field.validation_alias or field.serialization_alias:
            raise _fail(path, "no aliases", "has an alias")
        if field.exclude:
            raise _fail(path, "no exclusion", "is excluded from model_dump()")
        for meta in field.metadata:
            if getattr(meta, "strict", None) is False:
                raise _fail(path, "strict", "relaxes strict mode")
            for transform in ("strip_whitespace", "to_lower", "to_upper"):
                if getattr(meta, transform, None):
                    raise _fail(path, "no transformation", f"declares {transform}")
        _check_type(field.annotation, path)


_SCALARS = (str, int, float, bool, type(None))


def _check_type(annotation: Any, path: str) -> None:
    """Refuse a field type that is not plain JSON."""
    if annotation in _SCALARS or annotation is None:
        return
    if annotation in (list, dict):
        return
    if isinstance(annotation, type) and issubclass(annotation, BaseModel):
        if not issubclass(annotation, PlainConfig):
            raise _fail(
                path,
                "JSON types",
                f"nests {annotation.__name__}, which is not a PlainConfig",
            )
        return
    origin = get_origin(annotation)
    args = get_args(annotation)
    if origin is typing.Annotated:
        _check_type(args[0], path)
        return
    if origin in (Union, types.UnionType):
        for arg in args:
            _check_type(arg, path)
        return
    if origin is Literal:
        for arg in args:
            if not isinstance(arg, _SCALARS):
                raise _fail(path, "JSON types", f"Literal of {arg!r}")
        return
    if origin is list:
        for arg in args:
            _check_type(arg, f"{path}[]")
        return
    if origin is dict:
        if args:
            if args[0] is not str:
                raise _fail(path, "JSON types", "dict keys must be str")
            _check_type(args[1], f"{path}{{}}")
        return
    raise _fail(
        path,
        "JSON types",
        f"has type {annotation!r}; a plain config holds str, int, float, bool,"
        " None, list, dict (str keys), Literal and nested PlainConfig",
    )


# ------------------------------------------------------ the interface class


def _owner_of(cls: type, name: str) -> type | None:
    for klass in cls.__mro__:
        if name in klass.__dict__:
            return klass
    return None


def _is_machinable(klass: type | None) -> bool:
    return klass is None or klass.__module__ in _MACHINABLE_BASES


def is_plain(cls: type) -> bool:
    """Whether interface class ``cls`` makes plain-config records."""
    return bool(getattr(cls, "__plain__", False))


def plain_config_class(cls: type) -> type[BaseModel] | None:
    """The interface's ``Config`` when it is a :class:`PlainConfig`."""
    config = getattr(cls, "Config", None)
    if isinstance(config, type) and issubclass(config, PlainConfig):
        return config
    return None


def check_plain_interface(cls: type) -> None:
    """Refuse an interface class that breaks a plain-config rule.

    Called when an interface class whose ``Config`` is a :class:`PlainConfig`
    (or which is a ``machinable.Data``) is defined.
    """
    owner = cls.__qualname__
    for name in FORBIDDEN_HOOKS:
        defined = _owner_of(cls, name)
        if defined is not None and not _is_machinable(defined):
            raise _fail(
                f"{owner}.{name}",
                f"{name} not overridden",
                f"is overridden in {defined.__qualname__}; a plain-config"
                " interface's record is computed without it",
            )
    for klass in cls.__mro__:
        if _is_machinable(klass) or klass is object:
            continue
        for name in klass.__dict__:
            if name.startswith("config_"):
                raise _fail(
                    f"{owner}.{name}",
                    "no config methods",
                    "is a config method; a plain config is taken as given",
                )


# --------------------------------------------------------- runtime: the config


def check_json(value: Any, path: str = "config") -> None:
    """Refuse a value that is not plain JSON (str keys, finite numbers)."""
    if value is None or isinstance(value, str | bool | int):
        return
    if isinstance(value, float):
        if not math.isfinite(value):
            raise PlainConfigError(
                f"{path} is {value!r}; NaN and infinities are not JSON"
                " (plain-config rule: JSON values)"
            )
        return
    if isinstance(value, list):
        for i, item in enumerate(value):
            check_json(item, f"{path}[{i}]")
        return
    if isinstance(value, collections.abc.Mapping):
        for key, item in value.items():
            if not isinstance(key, str):
                raise PlainConfigError(
                    f"{path} has key {key!r}; keys are strings"
                    " (plain-config rule: JSON values)"
                )
            check_json(item, f"{path}.{key}")
        return
    raise PlainConfigError(
        f"{path} is a {type(value).__name__}, not a JSON value"
        " (plain-config rule: JSON values)"
    )


def sorted_json(value: Any) -> Any:
    """``value`` with every object's keys in sorted order (as stored)."""
    if isinstance(value, collections.abc.Mapping):
        return {key: sorted_json(value[key]) for key in sorted(value)}
    if isinstance(value, list):
        return [sorted_json(item) for item in value]
    return value


def plain_version_config(owner: str, version: list) -> dict:
    """The config a plain interface's version denotes: one mapping, or none."""
    for item in version:
        if isinstance(item, str):
            if item.startswith("~~"):
                raise PlainConfigError(
                    f"{owner}: version {item!r} is an axis; a plain config is one"
                    " mapping, given whole (plain-config rule: no ~~axis)"
                )
            if item.startswith("~"):
                raise PlainConfigError(
                    f"{owner}: version {item!r} calls a version method; a plain"
                    " config is one mapping, given whole (plain-config rule:"
                    " no ~version)"
                )
            raise PlainConfigError(
                f"{owner}: version {item!r} is not a mapping; a plain config is"
                " one mapping, given whole (plain-config rule: one mapping)"
            )
    if len(version) > 1:
        raise PlainConfigError(
            f"{owner}: version has {len(version)} mappings; a plain config is one"
            " mapping, given whole (plain-config rule: one mapping)"
        )
    return dict(version[0]) if version else {}


def validate_plain_config(owner: str, model: type[BaseModel] | None, config: dict):
    """Validate ``config`` against ``model``; it must dump exactly as given."""
    from machinable.utils import normjson

    check_json(config)
    if model is None:
        if config:
            raise PlainConfigError(
                f"{owner}: has no Config but was given {sorted(config)}; declare"
                " `class Config(PlainConfig)` (plain-config rule: declared fields)"
            )
        return
    try:
        dumped = model.model_validate_json(json.dumps(config)).model_dump()
    except Exception as ex:  # pydantic.ValidationError
        raise PlainConfigError(
            f"{owner}: config is not valid for the strict {model.__qualname__}"
            f" (plain-config rule: strict JSON types): {ex}"
        ) from ex
    if normjson(dumped) != normjson(config):
        raise PlainConfigError(
            f"{owner}: config {normjson(config)} validates as {normjson(dumped)};"
            " give each value as its field's type (e.g. 1.0, not 1, for a float"
            " field) (plain-config rule: strict JSON types)"
        )


def plain_config_layers(config: dict) -> dict:
    """The ``config`` field of ``model.json`` for plain ``config``."""
    config = sorted_json(config)
    return {
        **config,
        "_default_": {},
        "_version_": [config],
        "_update_": config,
    }


def omegaconf_literal(value: Any) -> Any:
    """``value`` escaped so that OmegaConf reads every ``${`` as data."""
    import re

    if isinstance(value, str):
        # a run of n backslashes before ${ reads as n backslashes and a
        # literal ${ when written as 2n + 1 backslashes
        return re.sub(
            r"(\\*)\$\{", lambda m: "\\" * (2 * len(m.group(1)) + 1) + "${", value
        )
    if isinstance(value, collections.abc.Mapping):
        return {key: omegaconf_literal(item) for key, item in value.items()}
    if isinstance(value, list):
        return [omegaconf_literal(item) for item in value]
    return value


# ---------------------------------------------------- the reference writer


def project_root(name: str) -> dict:
    """The root of project ``name``: its keys and record id (``roots.json``)."""
    from machinable.config import canonical_identity_key
    from machinable.utils import object_hash

    identity_key = canonical_identity_key("machinable.project", {}, {})
    predicate_key = object_hash({"name": name})[:32]
    return {
        "identity_key": identity_key,
        "predicate_key": predicate_key,
        "record_id": "P"
        + object_hash({"identity": identity_key, "predicate": predicate_key})[:11],
    }


def plain_record(
    *,
    project: str,
    module: str,
    config: dict,
    inherits: list[str] | tuple[str, ...],
    created_at_ns: int,
    created_by: str | None,
    label: str | None = None,
) -> dict:
    """What a plain writer writes for one record (the reference implementation).

    Returns the record id, its keys and parent, its home relative to the
    storage root, the exact bytes of ``id.json`` and ``model.json`` (UTF-8,
    as Python's ``json.dumps(..., ensure_ascii=False)`` writes them), the
    ``.machinable`` sentinel's content, and the catalog-log entry a remote home
    gets (named for ``created_at_ns`` here; a writer uses its clock at the time
    of the write).
    """
    from machinable.claims import shared_record_id
    from machinable.config import canonical_identity_key
    from machinable.format import FORMAT_VERSION
    from machinable.utils import object_hash

    check_json(config)
    root = project_root(project)
    identity_key = canonical_identity_key(module, config, {})
    predicate_key = object_hash({})[:32]
    uuid = shared_record_id(root["record_id"], identity_key, predicate_key)
    stored = sorted_json(config)
    id_json = {
        "format": FORMAT_VERSION,
        "uuid": uuid,
        "kind": "Interface",
        "identity_key": identity_key,
        "predicate_key": predicate_key,
        "parent": root["record_id"],
    }
    model_json = {
        "uuid": uuid,
        "kind": "Interface",
        "module": module,
        "version": [stored],
        "config": plain_config_layers(config),
        "predicate": {},
        "inherits": list(inherits),
        "context": [],
        "created_at_ns": created_at_ns,
        "created_by": created_by,
        "label": label,
    }
    home = "/".join(
        [root["identity_key"], root["predicate_key"], identity_key, predicate_key]
    )
    return {
        "record_id": uuid,
        "identity_key": identity_key,
        "predicate_key": predicate_key,
        "parent": root["record_id"],
        "home": home,
        "id_json": json.dumps(id_json, ensure_ascii=False),
        "model_json": json.dumps(model_json, ensure_ascii=False),
        "sentinel": uuid,
        "catalog_entry": {
            "name": f".catalog/{created_at_ns:020d}-{uuid}",
            "content": home,
        },
    }
