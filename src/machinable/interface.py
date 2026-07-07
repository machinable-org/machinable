"""The Interface: machinable's core abstraction and its relation system."""

from __future__ import annotations

import collections.abc
import contextlib
import contextvars
import copy
import inspect
import json
import os
import shlex
import threading
import warnings
from collections.abc import Callable, Sequence
from functools import partial
from typing import TYPE_CHECKING, Any, Literal, Self, cast

import arrow
import cloudpickle
import dill as pickle
import omegaconf
from flatten_dict import flatten
from omegaconf import DictConfig, OmegaConf

import machinable
from machinable import errors, schema
from machinable.api.models import (
    ConfigLayers,
    FindRequest,
)
from machinable.collection import (
    Collection,
    ExecutionCollection,
    InterfaceCollection,
)
from machinable.config import (
    check_unknown_keys,
    from_interface,
    match_method,
    rewrite_config_methods,
)
from machinable.errors import ConfigurationError, MachinableError
from machinable.types import DatetimeType, InterfaceType, VersionType
from machinable.utils import (
    Jsonable,
    id_from_uuid,
    is_directory_version,
    is_machinable_directory,
    joinpath,
    load_file,
    norm_version_call,
    object_hash,
    save_file,
    sentinel,
    serialize,
    unflatten_dict,
    update_dict,
)

if TYPE_CHECKING:
    from machinable.execution import Execution


class ConfigMethod:
    """Resolver binding for ``config_<name>()`` methods during a config build."""

    def __init__(self, interface: Interface, prefix="config") -> None:
        self.interface = interface
        self.prefix = prefix

    def __call__(self, function, args) -> Any:
        """Evaluate the config method ``function(args)`` on its binding."""
        from machinable.project import Project

        definition = f"{function}({args})"
        method = f"{self.prefix}_{function}"

        if hasattr(self.interface, method):
            obj = "self.interface."
        elif hasattr(Project.get().provider(), method):
            obj = "Project.get().provider()."
        else:
            raise ConfigurationError(
                f"{self.prefix.title()} method {definition} specified but"
                f" {type(self.interface).__name__}.{method}() does not exist."
            )

        # Using eval is evil, but in this case there is probably not enough at stake
        # to justify the implementation of a proper parser
        try:
            return eval(  # pylint: disable=eval-used
                obj + method + "(" + args + ")"
            )
        except Exception as _ex:
            raise ConfigurationError(
                f"{_ex} in {self.prefix} method {type(self).__name__}.{method}()"
            ) from _ex


# The `config_method` omegaconf resolver is registered ONCE, globally, and
# dispatches through a per-thread stack of ConfigMethod bindings. omegaconf's
# resolver registry is process-global, so per-build (re-)registration races
# concurrent config builds: one thread's clear/re-bind yanks or repoints the
# resolver under another's in-flight `to_container(resolve=True)`.
_CONFIG_METHOD_STACK = threading.local()


def _push_config_method(method: ConfigMethod) -> ConfigMethod:
    stack = getattr(_CONFIG_METHOD_STACK, "stack", None)
    if stack is None:
        stack = _CONFIG_METHOD_STACK.stack = []
    stack.append(method)
    return method


def _pop_config_method(method: ConfigMethod | None) -> None:
    if method is None:
        return
    stack = getattr(_CONFIG_METHOD_STACK, "stack", None)
    if stack and stack[-1] is method:
        stack.pop()


def _resolve_config_method(function: str, args: str) -> Any:
    stack = getattr(_CONFIG_METHOD_STACK, "stack", None)
    if not stack:
        raise ConfigurationError(
            f"config method '{function}({args})' resolved outside a config build"
        )
    return stack[-1](function, args)


OmegaConf.register_resolver(
    name="config_method", resolver=_resolve_config_method, replace=True
)


def normversion(version: VersionType = None) -> list[str | dict]:
    """Normalize a version into a list of ``~versions`` and override dicts."""
    if isinstance(version, list | tuple | omegaconf.listconfig.ListConfig):
        items: list = list(version)
    else:
        items = [version]

    def _valid(item):
        if item is None or item == {}:
            # skip
            return False

        if not isinstance(item, collections.abc.Mapping | str):
            raise ValueError(
                f"Invalid version. Expected str or dict but found"
                f" {type(item).__name__}: {item}"
            )

        return True

    def _norm(item):
        if isinstance(item, collections.abc.Mapping):
            # convert to dict and unflatten
            return unflatten_dict(
                OmegaConf.to_container(OmegaConf.create(item)), recursive=False
            )
        if isinstance(item, str) and "~" in item:
            return norm_version_call(item)

        return item

    return [_norm(v) for v in items if _valid(v)]


def compact(
    element: str | Sequence[str | dict | None] | None,
    version: VersionType = None,
) -> InterfaceType:
    """The compact ``[module, *version]`` element form of an interface."""
    if isinstance(element, list | tuple | omegaconf.listconfig.ListConfig):
        seq: list = list(element)
        element, default_version = seq[0], seq[1:]
        extra: list = list(version) if isinstance(version, list | tuple) else [version]
        version = default_version + extra

    if not isinstance(element, str):
        raise ValueError(
            f"Invalid module, expected str but found"
            f" <{type(element).__name__}>: {element}"
        )

    return [element] + normversion(version)


def defaultversion(
    module: Any, version: VersionType, element: Any
) -> tuple[Any, VersionType]:
    """Apply an element's registered default module/version."""
    if module is not None:
        return module, normversion(version)

    # handle in-session defaults
    if (
        isinstance(element.default, list | tuple)
        and element.default
        and not isinstance(element.default[0], str)
    ):
        return element.default[0], list(element.default[1:]) + normversion(version)

    default_version = normversion(element.default)

    if len(default_version) == 0:
        return module, normversion(version)

    if isinstance(default_version[0], str) and not default_version[0].startswith("~"):
        if module is None:
            return default_version[0], default_version[1:] + normversion(version)
        else:
            return module, default_version[1:] + normversion(version)

    return module, default_version + normversion(version)


def extract(
    compact_element: str | Sequence[str | dict | None] | None,
) -> tuple[str | None, list[str | dict] | None]:
    """Split a compact element into ``(module, version)``."""
    if compact_element is None:
        return None, None

    if isinstance(compact_element, str):
        return compact_element, None

    if isinstance(compact_element, omegaconf.listconfig.ListConfig):
        elements: list = list(compact_element)
    elif isinstance(compact_element, list | tuple):
        elements = list(compact_element)
    else:
        raise ValueError(
            f"Invalid interface definition. Expected list or str but found"
            f" {type(compact_element)}: {compact_element}"
        )

    if len(elements) == 0:
        raise ValueError(
            "Invalid interface definition. Expected str or non-empty list."
        )

    if not isinstance(elements[0], str):
        raise ValueError(
            "Invalid interface definition. First item in list has to be a string."
        )

    if len(elements) == 1:
        return elements[0], None

    return elements[0], normversion(cast(list, elements[1:]))


def extend(
    module: str | Interface | collections.abc.Iterable | None = None,
    version: VersionType = None,
):
    """Resolve ``module`` (str, class, instance, or element) into module + version."""
    if module is None or isinstance(module, str):
        # default
        return module, version

    if inspect.isclass(module):
        # in-session
        return module, version

    if isinstance(module, Interface):
        # object instance
        return module.module, module.version() + normversion(version)

    # iterable
    m, v = extract(cast("Sequence[str | dict | None]", module))
    return m, normversion(v) + normversion(version)


def equaljson(a: Any, b: Any) -> bool:
    """True when both values serialize to the same JSON."""
    return json.dumps(a, sort_keys=True, default=serialize) == json.dumps(
        b, sort_keys=True, default=serialize
    )


def equalversion(a: VersionType, b: VersionType) -> bool:
    """True when both versions normalize identically."""
    return equaljson(normversion(a), normversion(b))


def transfer_to(src: Interface, destination: Interface) -> Interface:
    """Move ``src``'s model onto ``destination`` and return it."""
    destination.__model__ = src.__model__

    return destination


def uuid_to_id(uuid: str) -> str:
    """Derive the 6-character short id from a hex uuid."""
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    # convert uuid hex to base 62 of length 6
    result = ""
    for i in range(0, 6 * 2, 2):
        result += alphabet[int(uuid[i : i + 2], 16) % 62]

    return result


def instantiate(
    module: str, class_: type[Interface], version: VersionType, **constructor_kwargs
):
    """Construct an interface instance with its project-relative module recorded."""
    try:
        Interface._module_ = module  # assign project-relative module
        instance = class_(version=version, **constructor_kwargs)
        instance.on_instantiate()
        return instance
    except TypeError as _ex:
        raise MachinableError(
            f"Could not instantiate interface {class_.__module__}.{class_.__name__}"
        ) from _ex


# The ambient connection stack (Project / Index / Storage / Scope / Execution)
# is context-local: each asyncio task and each thread sees its own stack. This
# lets a server enter different Project contexts per request concurrently
# without cross-talk. New threads start with a fresh (empty) stack; to inherit
# the connections of the spawning context, run the thread body inside
# ``contextvars.copy_context()`` (see Execution dispatch / heartbeat).
_CONNECTIONS_VAR: contextvars.ContextVar[collections.defaultdict[str, list]] = (
    contextvars.ContextVar("machinable_connections")
)


def _connections() -> collections.defaultdict[str, list]:
    """Return the connection stack for the current context, creating it lazily."""
    try:
        return _CONNECTIONS_VAR.get()
    except LookupError:
        stack: collections.defaultdict[str, list] = collections.defaultdict(list)
        _CONNECTIONS_VAR.set(stack)
        return stack


# The cross-kind ordered `with`-stack lives in its own contextvar (not a reserved
# key inside the kind-keyed connection dict) so that iterating connections never has
# to skip a phantom "kind". It records the order contexts were entered so the folded
# predicate stays invertible (see get_context); kept in sync with connection_scope.
_CONTEXT_ORDER_VAR: contextvars.ContextVar[list] = contextvars.ContextVar(
    "machinable_context_order"
)


def _context_order() -> list:
    """The ordered ``with``-context stack for the current context, created lazily."""
    try:
        return _CONTEXT_ORDER_VAR.get()
    except LookupError:
        order: list = []
        _CONTEXT_ORDER_VAR.set(order)
        return order


def get_inherits(interface: Interface) -> tuple[str, ...]:
    # drop the interface's own class (front) and the framework tail
    # (Interface base is captured; Jsonable and object are excluded)
    """The base-module chain (class MRO) recorded as ``inherits``."""
    return tuple(obj.__module__ for obj in interface.__class__.__mro__[1:-2])


def get_context(interface: Interface) -> list:
    """Snapshot the ordered ambient ``with``-context stack.

    Recorded at creation as ``[[module, compact_version], …]``.
    Identity-neutral: recorded for
    provenance readback only, never folded into config or predicate. Excludes
    ambient infrastructure (``_ambient`` kinds like Project/Index/Storage) and the
    interface itself.
    """
    out: list = []
    for ctx in _context_order():
        if ctx is interface or getattr(ctx, "_ambient", False):
            continue
        out.append([ctx.module, ctx.version()])
    return out


def get_dump(interface: Interface) -> bytes | None:
    """Pickle an in-session interface class (``__session__`` modules only)."""
    module = interface.__model__.module
    if module is not None and module.startswith("__session__"):
        # cloudpickle (not dill) so locally-defined classes with a pydantic Config
        # serialize by value since dill cannot pickle local pydantic model classes.
        # The stream is standard-pickle compatible, so ``pickle.loads`` restores it.
        return cloudpickle.dumps(interface.__class__)


def reset_connections() -> None:
    """Clear the ambient connection and context stacks."""
    _connections().clear()
    _context_order().clear()


@contextlib.contextmanager
def connection_scope():
    """Run with a fresh, isolated ambient connection stack.

    Used to give each server request its own Project/Index/... context so that
    concurrent requests for different projects do not interfere. New connections
    entered within the scope are discarded when it exits.
    """
    token = _CONNECTIONS_VAR.set(collections.defaultdict(list))
    order_token = _CONTEXT_ORDER_VAR.set([])
    try:
        yield
    finally:
        _CONNECTIONS_VAR.reset(token)
        _CONTEXT_ORDER_VAR.reset(order_token)


def cachable(
    memory: bool = True,
    file: bool = True,
    fail_mode: Literal["ignore", "raise", "warn"] = "ignore",
) -> Callable:
    """Decorator caching a method's result in memory and/or the record directory."""
    if not memory and not file:
        raise ValueError("At least one of memory or file cache must be enabled.")

    def _decorator(fn: Any) -> Callable:
        def _wrapper(self, *args, **kwargs):
            if not self._caching_enabled():
                return fn(self, *args, **kwargs)
            try:
                sig = inspect.signature(fn)
                bound_args = sig.bind(self, *args, **kwargs)
                bound_args.apply_defaults()
                key = object_hash(
                    {
                        "fn": fn.__name__,
                        "args": bound_args.args[1:],
                        "kwargs": bound_args.kwargs,
                    }
                )[:8]
            except TypeError as _ex:
                if fail_mode == "raise":
                    raise
                else:
                    if fail_mode == "warn":
                        print(
                            f"Warning: Caching disabled for {fn.__name__}"
                            f" due to unhashable arguments. ({repr(_ex)})"
                        )
                    return fn(self, *args, **kwargs)

            fp = f".cachable_{key}.p"

            # in-memory cache
            if memory and fp in self._cache:
                return self._cache[fp]

            # file cache
            if file:
                miss = object()
                cached = self.load_file(fp, miss)

                if cached is miss:
                    result = fn(self, *args, **kwargs)
                    self.save_file(fp, result)
                    if memory:
                        self._cache[fp] = result
                    return result
            else:
                cached = fn(self, *args, **kwargs)

            if memory:
                self._cache[fp] = cached

            return cached

        return _wrapper

    return _decorator


class Relation:
    """Descriptor declaring a typed relation edge between interface kinds."""

    inverse: bool = False
    multiple: bool = False

    def __init__(
        self,
        fn: Callable[[], type[Interface]],
        cached: bool = True,
        collection: type[Collection] | None = None,
        key: str | None = None,
        rel: str | None = None,
    ) -> None:
        self.fn = fn
        self.fn_name: str = fn.__name__  # ty: ignore[unresolved-attribute]
        self.cached = cached
        self.collection = collection
        self.key = key
        # provenance-graph edge label for this relation (e.g. `derived`/`ancestor` ->
        # "derivation"). None falls back to the attribute name. See Interface.walk.
        self.rel = rel

        self.cls: type[Interface] | None = None
        self._related_cls: type[Interface] | None = None

    @property
    def related_cls(self) -> type[Interface]:
        """The related interface class (resolved lazily)."""
        if self._related_cls is None:
            self._related_cls = self.fn()
        return self._related_cls

    @property
    def name(self) -> str:
        """The persisted relation name (``Kind.Kind.key``)."""
        assert self.cls is not None
        if not self.inverse:
            return f"{self.cls.kind}.{self.related_cls.kind}.{self.key or 'default'}"
        else:
            return f"{self.related_cls.kind}.{self.cls.kind}.{self.key or 'default'}"

    def collect(self, elements: list[Interface]) -> Collection:
        """Wrap related elements in the relation's collection type."""
        if self.collection is None:
            return self.related_cls.collect(elements)
        return self.collection(elements)

    def __set_name__(self, cls, name):
        self.cls = cls
        if cls.__relations__ is None:
            cls.__relations__ = {}
        cls.__relations__[name] = self

    def __get__(self, instance, owner):
        if (
            not instance._relation_cache.get(self.fn_name, None)
            and instance.is_mounted()
        ):
            from machinable.index import Index

            models = Index.get().find_related(
                relation=self.name, uuid=instance.uuid, inverse=self.inverse
            )

            related: Any = None
            if models is not None:
                hydrated = [
                    i
                    for r in models
                    if (i := Interface.find_by_id(cast(str, r.uuid), fetch=False))
                    is not None
                ]
                if self.multiple is False:
                    related = hydrated[0] if len(hydrated) > 0 else None
                else:
                    related = self.collect(hydrated)

            instance._relation_cache[self.fn_name] = self.cached
            instance.__related__[self.fn_name] = related

        return instance.__related__[self.fn_name]


class HasOne(Relation):
    """A single forward relation."""

    pass


class HasMany(Relation):
    """A multiple forward relation."""

    multiple = True


class BelongsTo(Relation):
    """A single inverse relation."""

    inverse = True


class BelongsToMany(Relation):
    """A multiple inverse relation."""

    inverse = True
    multiple = True


def _relation(cls: type[Relation]) -> Any:
    def _wrapper(
        f: Callable | None = None,
        *,
        cached: bool = True,
        collection: type[Collection] | None = None,
        key: str | None = None,
        rel: str | None = None,
    ) -> Any:
        if f is None:
            return partial(cls, cached=cached, collection=collection, key=key, rel=rel)

        return cls(f, cached=cached, collection=collection, key=key, rel=rel)

    return _wrapper


belongs_to = _relation(BelongsTo)
has_one = _relation(HasOne)
has_many = _relation(HasMany)
belongs_to_many = _relation(BelongsToMany)


def _uuid_symlink(directory, uuid, mode=None):
    dst = os.path.join(directory, "related", id_from_uuid(uuid))
    try:
        if mode is None:
            return uuid

        os.makedirs(dst, exist_ok=True)
        if mode == "file":
            with open(os.path.join(dst, "link"), "w") as f:
                f.write("../../" + uuid)
        else:
            os.symlink("../../" + uuid, os.path.join(dst, "link"))
    except OSError:
        pass

    return uuid


def _config_layers_from_model(model: schema.Interface) -> ConfigLayers:
    import copy

    config = copy.deepcopy(model.config) or {}
    if config:
        default = config.pop("_default_", {})
        version = config.pop("_version_", model.version)
        update = config.pop("_update_", {})
    else:
        default = {}
        version = model.version
        update = {}
    return ConfigLayers(
        default=default,
        version=list(version) if version else [],
        update=update,
        resolved=config,
    )


def _find_request_from_fingerprint(
    fingerprint: dict, *, kind: str | None = None
) -> FindRequest:
    module: str | None = None
    for field, value in fingerprint.items():
        if field == "module":
            module = value
    # Version matching is done in-memory via matches(); SQL only pre-filters by module.
    return FindRequest(
        module=module,
        kind=kind,
        limit=1000,
    )


# Config classes that already triggered the identifying=False-without-predicate
# guardrail: warn once per class, not once per materialization.
_warned_excluded: set[type] = set()


class Interface(Jsonable):
    """The unit of machinable.

    Research code with a typed ``Config``, storage for its results, and a
    content-addressed identity.
    """

    kind: str | None = "Interface"
    default: Interface | list | None = None
    _module_: str | None = None
    # ambient infrastructure (Project/Index/Storage): plumbing that is entered as a
    # `with`-context but is not part of an interface's recipe. Excluded from the
    # recorded context stack (see get_context). Subclasses set this to True.
    _ambient: bool = False
    # provenance edge label when this node is the dependency endpoint of an edge
    # (e.g. a Manifest reached via `uses` is a `manifest` edge). None -> use the
    # relation's own label. Lets new provenance-bearing kinds opt in by declaration.
    __provenance_rel__: str | None = None
    # class level relationship information
    # note that the actual data is kept in
    # the __related__ object property and
    # existence should be checked on
    # actual interface instance
    __relations__: dict[str, Relation] | None = None

    def __init__(
        self,
        version: VersionType = None,
        uses: None | Interface | list[Interface] = None,
        derived_from: Interface | None = None,
    ):
        super().__init__()
        if Interface._module_ is None:
            Interface._module_ = self.__module__
        module = Interface._module_

        # resolve callables
        if isinstance(version, list | tuple | omegaconf.listconfig.ListConfig):
            version_items: list = list(version)
        else:
            version_items = [version]
        version = cast(
            "list[str | dict | None]",
            [
                v(self) if callable(v) else v  # ty: ignore[call-top-callable]
                for v in version_items
            ],
        )

        self.__model__ = getattr(schema, self.kind or "Interface", schema.Interface)(
            kind=self.kind or "Interface",
            module=module,
            version=normversion(version),
            inherits=get_inherits(self),
            uuid=None,
            _dump=cloudpickle.dumps(self.__class__)  # ty: ignore[unknown-argument]
            if module.startswith("__session__")
            else None,
        )
        self._config: DictConfig | None = None
        self._predicate: DictConfig | None = None
        self._markers: dict[str, Any] = {}
        self._cache: dict[str, Any] = {}
        self._kwargs: dict[str, Any] = {}

        Interface._module_ = None

        # re-home the model on the Interface schema and wire up relations
        self.__model__ = schema.Interface(
            kind=self.kind or "Interface",
            module=module,
            config=self.__model__.config,
            version=self.__model__.version,
            inherits=get_inherits(self),
        )
        self.__model__._dump = get_dump(self)

        self._kwargs["uses"] = uses
        self._kwargs["derived_from"] = derived_from

        # initialize relation data
        self.__related__: dict[str, Any] = {}
        self._relation_cache: dict[str, bool] = {}
        if self.__relations__ is None:
            self.__relations__ = {}
        for name, relation in self.__relations__.items():
            if relation.multiple:
                self.__related__[name] = relation.collect([])
            else:
                self.__related__[name] = None
        if uses:
            if not isinstance(uses, list | tuple):
                uses = [uses]
            for use in uses:
                self.__related__["uses"].append(use)
            self._relation_cache["uses"] = True

        if derived_from:
            self.__related__["ancestor"] = derived_from
            self._relation_cache["ancestor"] = True

        self._deferred_data = {}
        self._current_execution_context = None
        # the IndexEntry captured at materialization (identity/predicate keys +
        # parent), the source for the record's id.json format header.
        self._index_entry = None
        # server-push support: injected by the API server before dispatch
        self._emit_queue: Any = None  # asyncio.Queue | None
        self._emit_loop: Any = None  # asyncio.AbstractEventLoop | None
        self._emit_callbacks: list = []  # sync observers registered via on_emit()

    @property
    def uuid(self) -> str | None:
        """The record id assigned at materialization, or ``None``."""
        return self.__model__.uuid

    @property
    def id(self) -> str | None:
        """Short (6-character) form of the record id."""
        if self.uuid is None:
            return None
        return id_from_uuid(self.uuid)

    @property
    def hash(self) -> str | None:
        """The model's hash, if computed."""
        return self.__model__.hash

    @property
    def timestamp(self) -> int:
        """Creation time in epoch nanoseconds."""
        return cast(int, self.__model__.timestamp)

    def created_at(self) -> DatetimeType:
        """Creation time recorded at materialization."""
        return arrow.get(cast(int, self.__model__.timestamp) / 1e9)

    @property
    def created_by(self) -> str | None:
        """User attributed as creator, captured at first materialization."""
        return self.__model__.created_by

    @property
    def label(self) -> str | None:
        """Optional mutable, human-facing label (config stays immutable)."""
        return self.__model__.label

    def set_label(self, label: str | None) -> Self:
        """Set the mutable ``label``; persists immediately when materialized.

        Unlike config, the label can change after materialization (FCFS /
        last-write-wins) without affecting the interface id, storage path,
        identity, or predicate.
        """
        self.__model__.label = label
        if self.is_materialized():
            from machinable.index import Index

            Index.get().set_label(cast(str, self.uuid), label)
            if self.is_mounted():
                save_file([self.local_directory(), "model.json"], self.__model__)
                self.touch()
        return self

    def version(
        self, version: VersionType = sentinel, overwrite: bool = False
    ) -> list[str | dict]:
        """Read (no arguments) or extend/overwrite the compact version list."""
        if version is sentinel:
            return self.__model__.version

        if hasattr(self, "is_mounted") and self.is_mounted():
            raise MachinableError(f"Cannot change version of mounted interface {self}")

        if overwrite:
            self.__model__.version = normversion(version)
        else:
            self.__model__.version.extend(normversion(version))

        self._clear_caches()

        return self.__model__.version

    @classmethod
    def set_default(
        cls,
        module: str | Interface | None = None,
        version: VersionType = None,
    ) -> None:
        """Set the default module + version used when this kind is resolved bare."""
        if module is not None and not isinstance(module, str):
            cls.default = [module] + normversion(version)
            return
        cls.default = compact(module, version)

    def as_default(self) -> Self:
        """Register this module + version as its kind's default."""
        cls = getattr(machinable, self.kind or "Interface", type(self))
        cls.set_default(self.__model__.module, self.__model__.version)

        return self

    @classmethod
    def connected(cls) -> list[Self]:
        """The instances of this kind currently entered as ``with``-contexts."""
        return cast("list[Self]", _connections()[cls.kind or "Interface"])

    @classmethod
    def get(
        cls,
        module: str | Interface | None = None,
        version: VersionType = None,
        **kwargs,
    ) -> Self:
        """The connected instance of this kind, or a resolved one (like ``make``)."""
        connected = _connections()[cls.kind or "Interface"]
        if module is None and version is None:
            if len(connected) > 0:
                return cast(Self, connected[-1])

        if module is None:
            return cast(Self, cls.make(module, version, **kwargs))

        return cast(Self, cls.singleton(module, version, **kwargs))

    @classmethod
    def make(
        cls,
        module: None | str | Interface | type[Interface] = None,
        version: VersionType = None,
        base_class: type[Interface] | None = None,
        **kwargs,
    ) -> Interface:
        """Instantiate ``module`` (project module path, class, or instance) with.

        ``version``.
        """
        if module is None:
            module = cls.__module__

        if base_class is None:
            base_class = getattr(machinable, cls.kind or "Interface", Interface)

        # prevent circular instantiation
        if module == "machinable" or module == base_class.__module__:
            return instantiate(cast(str, module), base_class, version, **kwargs)

        from machinable.project import Project

        return Project.get().interface(
            module=module,
            version=version,
            base_class=base_class,
            **kwargs,
        )

    @classmethod
    def instance(
        cls,
        module: None | str | Interface = None,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        """Instantiate this class with its registered defaults applied."""
        module, version = defaultversion(module, version, cls)
        return cls.make(module, version, base_class=cls, **kwargs)

    @classmethod
    def from_model(cls, model: schema.Interface) -> Interface:
        """Instantiate an interface from a schema model."""
        if cls.__module__ != model.module:
            # re-instantiate interface class
            if model.module and model.module.startswith("__session__"):
                if model._dump is None:
                    raise RuntimeError(f"Unable to restore interface {model.module}")
                instance = cls.make(pickle.loads(model._dump))
            else:
                instance = cls.make(model.module)
        else:
            instance = cls()

        instance.set_model(model)

        return instance

    def compute_fingerprint(self) -> dict | None:
        """Computes identity constraints used to match this interface.

        Returns:
            Optional[Dict]: ``{"module": ..., "identity_key": ...}``, the
                content-addressed identity of the *resolved* config (the canonical
                normal form), **not** the literal version. Two version spellings
                that evaluate to the same config therefore match. The ambient
                predicate lives separately (``pkey``). Returning None means no
                matching (e.g. Execution never re-uses an existing run-record).

        """
        return {
            "module": self.module,
            "identity_key": self.catalog_identity_key(),
        }

    def on_compute_predicate(self) -> dict:
        """Event to compute additional predicates that identify this interface.

        Returns:
            Dict: Maps the names used during lookup to their JSON-able value.

        """
        return {}

    def compute_predicate(self) -> dict:
        """The predicate: ``on_compute_predicate()`` merged with ambient scopes."""
        predicate = self.on_compute_predicate() or {}

        # apply scopes
        for scope in _connections()["Scope"]:
            predicate.update(scope())

        return predicate

    def compute_predicate_key(self) -> str:
        """Stable index path segment derived from :meth:`compute_predicate`."""
        return object_hash(self.compute_predicate())[:32]

    @property
    def predicate(self) -> dict:
        """The computed predicate dict (scopes + ``on_compute_predicate``)."""
        return self.compute_predicate()

    @property
    def predicate_key(self) -> str:
        """Stable hash of the predicate, used as an index path segment."""
        return self.compute_predicate_key()

    @property
    def fingerprint(self) -> dict | None:
        """The identity constraints used to match this interface."""
        return self.compute_fingerprint()

    def matching_fingerprint(self) -> dict:
        """Fingerprint for collection filtering.

        Ignores the Execution ``None`` override.
        """
        return {
            "module": self.module,
            "identity_key": self.catalog_identity_key(),
            "predicate": self.predicate,
        }

    def _warn_excluded_without_predicate(self) -> None:
        """Guardrail: a Config that drops fields from identity via.

        ``identifying=False`` but adds nothing back through
        ``on_compute_predicate`` collapses every instance to one identity. Warn
        once per class so the mistake is visible without spamming.
        """
        from machinable.config import identity_exclude

        cls = self.__class__
        if cls in _warned_excluded:
            return
        exclude = identity_exclude(getattr(cls, "Config", None))
        if exclude and not (self.__model__.predicate or {}):
            _warned_excluded.add(cls)
            warnings.warn(
                f"{cls.__name__}.Config marks {sorted(exclude)} as identifying=False "
                f"(excluded from identity), but on_compute_predicate() is empty, so "
                f"every instance collapses to the same identity. Re-identify the "
                f"excluded data via on_compute_predicate().",
                stacklevel=2,
            )

    def _caching_enabled(self) -> bool:
        if self.cached():
            return True
        return self.is_materialized() and self.kind != "Execution"

    @property
    def config(self) -> DictConfig:
        """Interface configuration."""
        if self._config is None:
            __cm_token = None
            try:
                if self.__model__.config is not None:
                    self._config = OmegaConf.create(self.__model__.config)
                else:
                    # bind this interface's config methods for the duration of
                    # the build (thread-local; the resolver itself is global;
                    # see _resolve_config_method)
                    __cm_token = _push_config_method(ConfigMethod(self))

                    # expose default config so events and config methods can use it
                    default_config, config_model = from_interface(self)

                    self._config = OmegaConf.create(default_config)

                    self.on_before_configure(self._config)

                    # apply versioning
                    __version = copy.deepcopy(self.__model__.version)

                    # compose configuration update
                    config_update = {}
                    for version in __version:
                        if isinstance(version, str) and version.startswith("~"):
                            definition = version[1:]

                            if not definition.endswith(")"):
                                definition = definition + "()"

                            method = match_method(definition)

                            if method is None:
                                raise ConfigurationError(
                                    f"Invalid version: {definition}"
                                )

                            version = ConfigMethod(self, "version")(*method)
                            if version is None:
                                version = {}

                            if not isinstance(version, collections.abc.Mapping):
                                raise ConfigurationError(
                                    f"Version method {definition} must produce"
                                    f" a mapping, but returned"
                                    f" {type(version)}: {version}"
                                )

                        config_update = update_dict(config_update, version)

                    # apply update
                    self._config = cast(
                        DictConfig, OmegaConf.merge(self._config, config_update)
                    )

                    # enable config methods (only rewrite real config_* methods, so
                    # arbitrary strings containing parentheses stay literal)
                    self._config = cast(
                        DictConfig,
                        OmegaConf.create(rewrite_config_methods(self._config, self)),
                    )

                    # computed configuration transform
                    self.on_configure()

                    # resolve config
                    config = cast(
                        "dict[str, Any]",
                        OmegaConf.to_container(self._config, resolve=True),
                    )

                    # enforce schema (typos first: pydantic would silently
                    # ignore unknown keys, which corrupts identity)
                    if config_model is not None:
                        check_unknown_keys(config, config_model)
                        config = config_model(**config).model_dump()

                    # add introspection data
                    config["_default_"] = default_config
                    config["_version_"] = __version
                    config["_update_"] = config_update

                    # make config property accessible for slot components
                    self._config = OmegaConf.create(config)

                    # disallow further transformation
                    OmegaConf.set_readonly(self._config, True)

                    # save to model
                    self.__model__.config = cast(
                        dict, OmegaConf.to_container(self._config)
                    )

                    _pop_config_method(__cm_token)
                    __cm_token = None

                    self.on_after_configure()
            except Exception as _ex:
                _pop_config_method(__cm_token)
                raise ConfigurationError(str(_ex)) from _ex

        assert self._config is not None
        return self._config

    @property
    def module(self) -> str | None:
        """The project-relative module path this interface was resolved from."""
        return self.__model__.module

    @property
    def inherits(self) -> tuple[str, ...]:
        """Class-MRO base-module chain (inheritance)."""
        return self.__model__.inherits

    @property
    def context(self) -> list:
        """Ordered ``with``-context stack the interface was created under, as.

        ``[[module, compact_version], …]`` (identity-neutral, captured at
        materialize).
        """
        return self.__model__.context

    def lineage(self) -> InterfaceCollection:
        """The derivation chain, from root down to the immediate parent.

        Excludes ``self``; empty for an independent interface.
        """
        chain: list[Interface] = []
        node = self.ancestor
        while node is not None:
            chain.append(node)
            node = node.ancestor
        chain.reverse()
        return InterfaceCollection(chain)

    def provenance(self, depth: int = 8, rels: set[str] | None = None):
        """The provenance graph rooted here, as a normalized node-link DAG.

        Recipe (config/context/derivation) plus history (executions, each
        with the Manifest it used). One assembler shared with the REST and
        MCP surfaces. Core (no HTTP/FastAPI dependency), so it works on a
        base install.
        """
        from machinable.provenance import build_provenance_graph

        return build_provenance_graph(self, depth=depth, rels=rels)

    def on_provenance_attributes(self) -> dict:
        """The provenance-node ``attributes`` facet for this kind.

        Base (recipe) kinds attach ``extra()`` + config layers + context; history kinds
        (Execution, Manifest) override to omit config layers. Lives here so the
        recipe/history split follows the class hierarchy rather than a kind-string
        denylist.
        """
        attrs: dict = dict(self.__model__.extra() or {})
        attrs.pop("_dump", None)
        try:
            layers = self.config_layers()
            attrs["config_layers"] = {
                "default": layers.default,
                "version": layers.version,
                "update": layers.update,
                "resolved": layers.resolved,
            }
        except Exception:  # noqa: BLE001 - config is best-effort here
            pass
        context = getattr(self.__model__, "context", None)
        if context:
            attrs["context"] = context
        return attrs

    @classmethod
    def model(cls, instance: Any | None = None) -> type[schema.Interface]:
        """The schema model class of this kind (or validate ``instance`` against it)."""
        if instance is not None:
            if isinstance(instance, cls):
                return instance.__model__

            if isinstance(instance, cls.model()):
                return instance

            raise ValueError(
                f"Invalid {(cls.kind or 'interface').lower()} model: {instance}."
            )

        if cls.kind is None:
            return schema.Interface

        return getattr(schema, cls.kind)

    def matches(self, fingerprint: dict | None = None) -> bool:
        """True when this interface satisfies the given fingerprint constraints."""
        if fingerprint is None:
            return False

        if not fingerprint:
            return True

        for field, value in fingerprint.items():
            if field == "module":
                if self.module != value:
                    return False
            elif field == "identity_key":
                # canonical config identity, version-spelling independent
                if self.catalog_identity_key() != value:
                    return False
            elif field == "predicate" and value:
                stored = self.__model__.predicate or {}
                for key, item in value.items():
                    if key not in stored or not equaljson(stored[key], item):
                        return False

        return True

    def set_model(self, model: schema.Interface) -> Self:
        """Replace the underlying schema model (invalidates cached config)."""
        self.__model__ = model

        # invalidate cached config
        self._config = None
        self._predicate = None

        return self

    def serialize(self) -> dict:
        # ensure that configuration has been parsed and predicated computed
        """The interface's model as a plain dict."""
        assert self.config is not None
        self.__model__.predicate = self.compute_predicate()
        return self.__model__.model_dump()

    def mark(self, name: str | list[str], value: Any = True) -> str:
        """Tag the live object with an in-memory marker (read back via ``marker``).

        Markers are transient: they live on this Python object only and are
        never written to storage, so they disappear with the object. Use them
        to flag interfaces while iterating or filtering; use
        :meth:`save_file` for anything that should persist.
        """
        name = joinpath(name)

        self._markers[name] = value

        return name

    def marker(self, name: str | list[str], default=None) -> Any | None:
        """Read a marker previously set with ``mark``."""
        name = joinpath(name)

        value = self._markers.get(name, None)

        return value if value is not None else default

    @classmethod
    def unserialize(cls, serialized):
        """Rebuild an interface from ``serialize()`` output."""
        return cls.from_model(cls.model()(**serialized))

    @classmethod
    def is_connected(cls) -> bool:
        """True when an instance of this kind is entered as a ``with``-context."""
        return len(_connections()[cls.kind or "Interface"]) > 0

    def on_instantiate(self) -> None:
        """Event that is invoked whenever the interface is instantiated."""

    def on_before_configure(self, config: DictConfig) -> None:
        """Configuration event operating on the raw configuration.

        This may be used to apply computed configuration updates
        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def on_configure(self) -> None:
        """Configuration event.

        This may be used to apply computed configuration updates
        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def on_after_configure(self) -> None:
        """Configuration event operating on the resolved, read-only configuration.

        This may be used to validate given the interface instance. If validation
        can be performed without the instance, use a config schema instead.
        """

    def _clear_caches(self) -> None:
        self._config = None
        self.__model__.config = None

    def __enter__(self) -> Self:
        _connections()[self.kind or "Interface"].append(self)
        # a single cross-kind ordered stack so the `with`-context order the
        # interface was created under is recoverable (see get_context).
        _context_order().append(self)
        return self

    def __exit__(self, *args, **kwargs):
        try:
            _connections()[self.kind or "Interface"].pop()
        except IndexError:
            pass
        try:
            _context_order().pop()
        except IndexError:
            pass

    def __reduce__(self) -> str | tuple[Any, ...]:
        return (self.__class__, (), self.serialize())

    def __getstate__(self):
        return self.serialize()

    def __setstate__(self, state):
        self.__model__ = self.__class__.model()(**state)

    def __repr__(self):
        name = self.kind if self.module is None else self.module
        if self.uuid is None:
            return f"{name} [unmaterialized]"
        return f"{name} [{self.id}]"

    def __str__(self):
        return self.__repr__()

    def __eq__(self, other):
        if self.uuid is None:
            return self is other
        return self.uuid == getattr(other, "uuid", None)

    def __ne__(self, other):
        return not self == other

    @classmethod
    def collect(cls, elements) -> InterfaceCollection:
        """Wrap ``elements`` in an :class:`InterfaceCollection`."""
        return InterfaceCollection(elements)

    def push_related(self, key: str, value: Interface) -> None:
        """Attach ``value`` to the ``key`` relation in memory."""
        assert self.__relations__ is not None
        if self.__relations__[key].multiple:
            self.__related__[key].append(value)
        else:
            self.__related__[key] = value
        self._relation_cache[key] = True

    def is_materialized(self) -> bool:
        """True when the interface has been assigned a record id."""
        return self.__model__.uuid is not None

    def catalog_identity_key(self) -> str:
        """The canonical config identity key (``hash(module + canonical(config))``)."""
        from machinable.config import canonical_identity_key, identity_exclude

        layers = self.config_layers()
        exclude = identity_exclude(getattr(self.__class__, "Config", None))
        return canonical_identity_key(
            self.module, layers.resolved, layers.default, exclude
        )

    def config_layers(self):
        """The config layers (default, version, update, resolved)."""
        assert self.config is not None
        self.__model__.config = cast(dict, OmegaConf.to_container(self.config))
        return _config_layers_from_model(self.__model__)

    @property
    def parent(self):
        """The entry this record scopes under.

        The connected Storage entry, or the project root.
        """
        from machinable.project import Project
        from machinable.storage import Storage

        if Storage.is_connected():
            storage = Storage.get()
            if getattr(storage, "_entry", None) is not None:
                return storage._entry
        if Project.is_connected():
            root = getattr(Project.get(), "_root_entry", None)
            if root is not None:
                return root
        return None

    def materialize(
        self,
        parent_id: str | None = None,
        force: bool = False,
        record_id: str | None = None,
    ) -> Self:
        """Register the interface in the index and write its record directory."""
        if self.is_materialized():
            return self

        if self.on_before_materialize() is False:
            return self

        assert self.__relations__ is not None
        for k, v in self.__related__.items():
            r = self.__relations__[k]
            items = [v] if not r.multiple else v
            for item in items:
                if item is not None and not item.is_materialized():
                    item.materialize(parent_id=parent_id, force=force)

        if self.on_materialize() is False:
            return self

        from machinable.index import Index

        index = Index.get()
        # capture the ordered with-context stack (identity-neutral) before persisting
        self.__model__.context = get_context(self)
        effective_parent = parent_id
        if effective_parent is None and self.parent is not None:
            effective_parent = self.parent.record_id

        response = index.materialize_from(
            self, parent_id=effective_parent, force=force, record_id=record_id
        )
        self._index_entry = response.entry
        self.__model__.uuid = response.entry.record_id
        self.__model__.created_at_ns = response.entry.created_at_ns
        self.__model__.predicate = self.compute_predicate()
        self._warn_excluded_without_predicate()

        uuid = cast(str, self.uuid)
        for k, v in self.__related__.items():
            r = self.__relations__[k]
            items = [v] if not r.multiple else v
            for item in items:
                if item is None:
                    continue
                if r.inverse:
                    index.create_relation(r.name, cast(str, item.uuid), uuid)
                else:
                    index.create_relation(r.name, uuid, cast(str, item.uuid))

        # The Project is a self-referential root entry whose directory is the
        # (version-controlled) project folder itself; it is represented solely by
        # its index row (the .machinable.sqlite db) and never writes marker /
        # model files into the project root.
        if self.kind != "Project":
            self.to_directory(self.local_directory(create=True))

        from machinable.storage import Storage

        if self.on_commit() is not False:
            for storage in Storage.connected():
                storage.commit(self)

        for filepath, data in self._deferred_data.items():
            self.save_file(filepath, data)
        self._deferred_data = {}

        self.on_after_materialize()

        return self

    def on_before_materialize(self):
        """Event hook before interface is materialized."""

    def on_materialize(self):
        """Event hook during materialization before persistence."""

    def on_after_materialize(self):
        """Event hook after interface has been materialized."""

    # -- dispatch lifecycle hooks -------------------------------------------
    # Declared here (as no-ops) so any Interface dispatched as a run target has the full
    # contract discoverable on the base class, and Execution.dispatch can call them
    # unconditionally instead of duck-typing with hasattr. Override as needed.

    def on_before_dispatch(self) -> bool | None:
        """Hook: invoked on the run target before its lifecycle begins."""

    def on_success(self) -> None:
        """Hook: the run target completed without error."""

    def on_failure(self, exception: BaseException) -> None:
        """Hook: the run target raised ``exception``."""

    def on_finish(self, success: bool) -> None:
        """Hook: the run target finished (``success`` indicates outcome)."""

    def on_after_dispatch(self, success: bool) -> None:
        """Hook: after the run target's dispatch, success or failure."""

    def on_heartbeat(self) -> None:
        """Hook: fired on the run target every heartbeat interval."""

    def on_write_meta_data(self) -> bool | None:
        """Hook: return False to prevent writing of run metadata.

        Consulted alongside the execution's hook, so a component can veto
        metadata writes based on what it knows (e.g. only the controller
        rank writes under MPI).
        """

    def on_commit(self) -> bool | None:
        """Hook: return False to skip mirroring to connected storages.

        Applies to the automatic mirror on materialize; explicit
        ``storage.upload(...)`` is unaffected. E.g. non-controller MPI ranks
        return False so a shared record is not committed once per rank.
        """

    @belongs_to
    def project():
        """The project this interface belongs to."""
        from machinable.project import Project

        return Project

    @has_many(
        cached=False,
        key="derivatives",
        collection=InterfaceCollection,
        rel="derivation",
    )
    def derived() -> type[Interface]:
        """Returns a collection of derived interfaces."""
        return Interface

    @belongs_to(key="derivatives", rel="derivation")
    def ancestor() -> type[Interface]:
        """Returns parent interface or None if interface is independent."""
        return Interface

    @has_many(key="using", rel="uses")
    def uses() -> type[Interface]:
        """Interfaces this one uses (dependencies/inputs)."""
        return Interface

    @belongs_to_many(key="using", rel="uses")
    def used_by() -> type[Interface]:
        """Interfaces that use this one (inverse of ``uses``)."""
        return Interface

    def _iter_edges(self):
        """Yield ``(source, rel, target)`` for every edge incident to ``self``.

        Run-record ``executions`` are included. Edges are oriented
        **canonically**: an inverse
        relation (``ancestor``/``used_by``) points *toward* self, a forward relation
        (``derived``/``uses``) points *away*, so a parent↔child pair is one
        ``parent→child`` edge from either endpoint, never a 2-cycle. The edge label is
        the relation's declared ``rel`` (fallback: attribute name), overridden by the
        dependency endpoint's ``__provenance_rel__`` (a Manifest reached via ``uses`` is
        a ``manifest`` edge). The single edge source ``related`` and ``walk`` share.
        """
        for attr, relationship in (self.__relations__ or {}).items():
            value = getattr(self, attr, None)
            if not value:
                continue
            related = list(value) if relationship.multiple else [value]
            for r in related:
                if r is None or getattr(r, "uuid", None) is None:
                    continue
                if relationship.inverse:
                    source, target = r, self
                else:
                    source, target = self, r
                rel = getattr(target, "__provenance_rel__", None) or (
                    relationship.rel or attr
                )
                yield source, rel, target
        if self.is_materialized():
            for execution in self.executions:
                if execution is not None and execution.uuid is not None:
                    yield self, "runs", execution

    @staticmethod
    def _edge_neighbour(origin: Interface, source: Interface, target: Interface):
        """The endpoint of an oriented edge that is *not* ``origin``.

        That is, the node to traverse to from the node being expanded.
        """
        return target if source.uuid == origin.uuid else source

    def walk(self, rels: set[str] | None = None, depth: int = 1):
        """BFS over the typed relation graph from ``self``.

        Yields ``(source, rel, target)`` oriented edge triples out to
        ``depth`` hops. ``rels`` (a set of edge
        labels) filters which edges are followed; ``None`` follows all. Each node is
        expanded once, but an edge to an already-seen node is still yielded, so shared
        nodes (the DAG diamonds) are represented without duplicating the node. Edges are
        canonically oriented (see ``_iter_edges``), so the result is an acyclic DAG.
        """
        seen = {self.uuid}
        queue = collections.deque([(self, 0)])
        while queue:
            node, d = queue.popleft()
            if d >= depth:
                continue
            for source, rel, target in node._iter_edges():
                if rels is not None and rel not in rels:
                    continue
                yield source, rel, target
                neighbour = self._edge_neighbour(node, source, target)
                if neighbour.uuid not in seen:
                    seen.add(neighbour.uuid)
                    queue.append((neighbour, d + 1))

    def related(self, deep: bool = False) -> InterfaceCollection:
        """A collection of related interfaces.

        The depth-1 neighbours across every relation, or (``deep=True``) the
        full transitive closure of reachable nodes.
        """
        neighbours = [
            self._edge_neighbour(self, s, t) for s, _, t in self._iter_edges()
        ]
        if not deep:
            return InterfaceCollection(neighbours).unique(lambda x: x.uuid)
        seen = {self.uuid}
        collection: list[Interface] = []
        queue = collections.deque(neighbours)
        while queue:
            node = queue.popleft()
            if node.uuid in seen:
                continue
            seen.add(node.uuid)
            collection.append(node)
            if hasattr(node, "_iter_edges"):
                for s, _, t in node._iter_edges():
                    nb = self._edge_neighbour(node, s, t)
                    if nb.uuid not in seen:
                        queue.append(nb)
        return InterfaceCollection(collection).unique(lambda x: x.uuid)

    def widget(self):
        """Render this interface in the web client (Jupyter).

        Returns an anywidget view of the interface's ItemView — config,
        launch/track, result, execution, provenance — the visual twin of the
        code. Rarely needed directly: ``display(interface)`` (or the interface
        as a cell's last expression) renders the same view via the display
        protocol. It renders against the connected :class:`Server
        <machinable.server.Server>` (``with Server(...):``); with none
        connected, a kernel-local default is connected and reused.
        """
        if not self.module:
            raise MachinableError(
                "This interface has no module path; only project modules can "
                "be opened in the web client."
            )
        from machinable.server import Server

        return Server.ensure().view(
            view="item", target=self.module, version=self.version()
        )

    def _repr_mimebundle_(self, include=None, exclude=None, **kwargs):
        # IPython display hook: `display(interface)` / a bare interface at the
        # end of a cell renders the web client's ItemView; anything missing
        # (anywidget, uvicorn, a module path) falls back to the plain repr.
        try:
            view = self.widget()
            return view._repr_mimebundle_(include=include, exclude=exclude, **kwargs)
        except Exception:  # noqa: BLE001 - display is best-effort by contract
            return None

    def to_cli(self) -> str:
        """This interface rendered as its compact CLI command."""
        cli: list[str] = [cast(str, self.module)]
        for v in self.__model__.version:
            if isinstance(v, str):
                cli.append(v)
            else:
                cli.extend(
                    [
                        f"{key}={shlex.quote(str(val))}"
                        for key, val in flatten(v, reducer="dot").items()
                    ]
                )

        return " ".join(cli)

    def derive(
        self,
        module: str | Interface | None = None,
        version: VersionType = None,
        **kwargs,
    ) -> Self:
        """Create (or find) an interface derived from this one."""
        if module is None:
            return cast(Self, self.make(module, version, derived_from=self, **kwargs))

        return cast(
            Self,
            self.derived.singleton(module, version, derived_from=self, **kwargs),
        )

    @classmethod
    def singleton(
        cls,
        module: str | Interface,
        version: VersionType = None,
        **kwargs,
    ) -> Interface:
        """The existing matching interface, or a fresh one if none matches."""
        if module in [
            "machinable.storage",
            "machinable.project",
        ] and is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        candidates = cls.find(
            module,
            version,
            **kwargs,
        ).filter(lambda x: not x.hidden())

        if candidates:
            last = candidates[-1]
            if inspect.isclass(module):
                fresh = cls.make(module, version, **kwargs)
                last_dump = getattr(last.__model__, "_dump", None)
                fresh_dump = getattr(fresh.__model__, "_dump", None)
                if last_dump != fresh_dump:
                    return fresh
            return last

        return cls.make(module, version, **kwargs)

    def is_mounted(self) -> bool:
        """True when the record's directory exists locally."""
        if not self.is_materialized():
            return False

        from machinable.index import Index

        return os.path.exists(Index.get().local_directory(cast(str, self.uuid)))

    @classmethod
    def find_by_id(cls, uuid: str, fetch: bool = True) -> Interface | None:
        """Load an interface by record id, or ``None`` if unknown."""
        from machinable.index import Index, entry_to_model

        index = Index.get()
        entry = index.get_by_id(uuid)
        if entry is None:
            return None

        module = entry.module
        if fetch is False and (module is None or not module.startswith("__session__")):
            return cls.from_model(entry_to_model(entry))

        local_directory = index.local_directory(entry.record_id)

        if is_machinable_directory(local_directory):
            return cls.from_directory(local_directory)

        from machinable.storage import fetch as fetch_from_storage

        if fetch_from_storage(entry.record_id, local_directory):
            return cls.from_directory(local_directory)

        return cls.from_model(entry_to_model(entry))

    @classmethod
    def find_many_by_id(
        cls, uuids: list[str], fetch: bool = True
    ) -> InterfaceCollection:
        """Load several interfaces by record id."""
        return cls.collect([cls.find_by_id(uuid, fetch) for uuid in uuids])

    @classmethod
    def find_by_fingerprint(
        cls, fingerprint_hash: str, fetch: bool = True
    ) -> InterfaceCollection:
        """Find interfaces whose record id ends with ``fingerprint_hash``."""
        from machinable.api.models import FindRequest
        from machinable.index import Index

        index = Index.get()
        resp = index.find(FindRequest(record_id_suffix=fingerprint_hash, limit=1000))
        return cls.collect(
            [cls.find_by_id(item.record_id, fetch) for item in resp.items]
        )

    @classmethod
    def find(
        cls,
        module: str | Interface | type[Interface] | None,
        version: VersionType = None,
        **kwargs,
    ) -> InterfaceCollection:
        """Find stored interfaces matching ``module`` and ``version``.

        Matching is by canonical identity, so any equivalent version spelling
        finds the same records.
        """
        from machinable.index import Index

        index = Index.get()

        if module is None:
            # Build a predicate filter directly from ambient Scopes
            # (not via fingerprint)
            scope_predicate: dict = {}
            for scope in _connections()["Scope"]:
                scope_predicate.update(scope())
            req = FindRequest(
                kind=cls.kind,
                predicate=scope_predicate or None,
                limit=1000,
            )
            items = index.find(req).items
            return cls.collect(
                [
                    hydrated
                    for item in items
                    if (hydrated := cls.find_by_id(item.record_id, fetch=False))
                    is not None
                ]
            )

        try:
            candidate = cls.make(module, version, **kwargs)
        except ModuleNotFoundError:
            return cls.collect([])

        fingerprint = candidate.compute_fingerprint()

        found = []

        from machinable.utils import sanitize_filename

        parent_id = None
        from machinable.project import Project
        from machinable.storage import Storage

        if Storage.is_connected():
            entry = getattr(Storage.get(), "_entry", None)
            if entry is not None:
                parent_id = entry.record_id
        if parent_id is None and Project.is_connected():
            Project.get().ensure_project_root()
            root = getattr(Project.get(), "_root_entry", None)
            if root is not None:
                parent_id = root.record_id

        slot = index.get_entry(
            parent_id=parent_id,
            identity_key=sanitize_filename(
                candidate.catalog_identity_key(), max_len=128
            ),
            predicate_key=candidate.predicate_key,
        )
        if slot is not None:
            hydrated = cls.find_by_id(slot.record_id, fetch=True)
            if hydrated is not None:
                found.append(hydrated)

        if fingerprint is None:
            return cls.collect(found)

        kind_filter = cls.kind if module is None else None
        for item in index.find(
            _find_request_from_fingerprint(fingerprint, kind=kind_filter)
        ).items:
            if slot is not None and item.record_id == slot.record_id:
                continue
            hydrated = cls.find_by_id(item.record_id, fetch=True)
            if hydrated is not None:
                found.append(hydrated)

        matching = dict(fingerprint or {})
        matching["predicate"] = candidate.predicate
        return cls.collect(found).filter(lambda i: i.matches(matching))

    @classmethod
    def from_directory(cls, directory: str) -> Self:
        """Returns an interface from a storage directory.

        Note that this does not verify the integrity of the directory.
        In particular, the interface may be missing or not be indexed.
        """
        data = load_file([directory, "model.json"])

        model = getattr(schema, data["kind"], None)
        if model is None:
            # TODO: users should have an option to register custom interface types
            raise ValueError(f"Invalid interface kind: {data['kind']}")

        interface = model(**data)
        if interface.module.startswith("__session__"):
            interface._dump = load_file([directory, "dump.p"], None)

        return cast(Self, cls.from_model(interface))

    @staticmethod
    def _write_relation_meta(d, r, uuid, related_uuid):
        save_file(
            [d, "related", "metadata.jsonl"],
            {
                "uuid": uuid,
                "related_uuid": related_uuid,
                "name": r.name,
                "multiple": r.multiple,
                "inverse": r.inverse,
                "cached": r.cached,
                "fn": r.fn_name,
            },
            mode="a",
        )

    def _write_relation_mirror(self, directory: str, k: str, v: list) -> None:
        """Append one relation's on-disk mirror.

        Writes the forward file + metadata, and the inverse side on each
        neighbour. The disk mirror is authoritative for reindex, so every
        persisted edge must go through here.
        """
        assert self.__relations__ is not None
        r = self.__relations__[k]
        # forward
        save_file(
            [directory, "related", k],
            "\n".join([_uuid_symlink(directory, i.uuid) for i in v]) + "\n",
            mode="a",
        )
        for u in v:
            if r.inverse:
                self._write_relation_meta(directory, r, u.uuid, self.uuid)
            else:
                self._write_relation_meta(directory, r, self.uuid, u.uuid)
        # inverse
        for i in v:
            try:
                ir = [
                    _
                    for _ in i.__relations__.values()
                    if _.name == r.name and _ is not r
                ][0]
                save_file(
                    [i.local_directory(), "related", ir.fn_name],
                    _uuid_symlink(i.local_directory(), self.uuid) + "\n",
                    mode="a",
                )
                if ir.inverse:
                    self._write_relation_meta(
                        i.local_directory(), ir, i.uuid, self.uuid
                    )
                else:
                    self._write_relation_meta(
                        i.local_directory(), ir, self.uuid, i.uuid
                    )
            except Exception:
                pass

    def relate(self, name: str, other: Interface) -> None:
        """Record a relation edge to both the index and the on-disk mirror.

        Used after materialization. Because the index is a rebuildable cache,
        the disk
        ``related/metadata.jsonl`` must carry the edge too so it survives a reindex;
        this is the single post-materialize edge-persistence path (e.g. a run→Manifest
        ``uses`` edge captured at dispatch).
        """
        from machinable.index import Index

        self.push_related(name, other)
        assert self.__relations__ is not None
        r = self.__relations__[name]
        if r.inverse:
            Index.get().create_relation(
                r.name, cast(str, other.uuid), cast(str, self.uuid)
            )
        else:
            Index.get().create_relation(
                r.name, cast(str, self.uuid), cast(str, other.uuid)
            )
        if self.is_materialized():
            self._write_relation_mirror(self.local_directory(), name, [other])
            self.touch()

    def _resolve_index_entry(self):
        """The record's IndexEntry.

        Captured at materialization, or resolved from the index for hydrated
        instances (``find_by_id`` etc.).
        """
        if self._index_entry is not None:
            return self._index_entry
        uuid = self.__model__.uuid
        if uuid is None:
            return None
        from machinable.index import Index

        self._index_entry = Index.get().get_by_id(uuid)
        return self._index_entry

    def to_directory(self, directory: str, relations: bool = True) -> Self:
        """Write the record files (sentinel, header, model, relations) to.

        ``directory``.
        """
        from machinable.format import bump_updated_at, write_id

        save_file([directory, ".machinable"], self.__model__.uuid)
        entry = self._resolve_index_entry()
        if entry is not None:
            # the format-v1 header (id.json): written once and immutable, which makes
            # the directory self-describing so ingest is a pure copy.
            write_id(
                directory,
                uuid=cast(str, self.__model__.uuid),
                kind=self.__model__.kind,
                identity_key=entry.identity_key,
                predicate_key=entry.predicate_key,
                parent=entry.parent_id,
            )
        save_file([directory, "model.json"], self.__model__)
        if self.__model__._dump is not None:
            save_file([directory, "dump.p"], self.__model__._dump)

        if relations:
            assert self.__relations__ is not None
            for k, v in self.__related__.items():
                if not v:
                    continue
                r = self.__relations__[k]
                items = v if r.multiple else [v]
                self._write_relation_mirror(directory, k, items)

        bump_updated_at(directory)
        return self

    def fetch(self, directory: str | None = None, force: bool = False) -> bool:
        """Ensure the record's files are locally available.

        Pulls from a connected storage if needed.
        """
        if not self.is_materialized():
            return False

        if "fetched" in self._cache and not force:
            return True

        if directory is None:
            from machinable.index import Index

            directory = Index.get().local_directory(cast(str, self.uuid))

        if not os.path.exists(directory) or force:
            from machinable.storage import fetch

            if not fetch(cast(str, self.uuid), directory):
                return False

        self._cache["fetched"] = True
        return True

    def local_directory(self, *append: str, create: bool = False) -> str:
        """The record's local working directory, with optional segments appended."""
        if not self.is_materialized():
            raise RuntimeError("Interface not yet materialized")

        from machinable.index import Index

        directory = Index.get().local_directory(cast(str, self.uuid), *append)

        if create:
            os.makedirs(directory, exist_ok=True)

        return directory

    def load_file(self, filepath: str | list[str], default=None) -> Any | None:
        """Read a file from the record directory (format chosen by extension)."""
        filepath = joinpath(filepath)
        if not self.is_mounted():
            # has write been deferred?
            if filepath in self._deferred_data:
                return self._deferred_data[filepath]

            return default

        data = load_file(self.local_directory(filepath), default=None)

        return data if data is not None else default

    def on_emit(self, callback: Any) -> Any:
        """Register a callback to be called on every :meth:`emit`.

        Can be used as a decorator or called directly::

            @interface.on_emit
            def handle(payload):
                print(payload)

            # or
            interface.on_emit(lambda p: results.append(p))

        The callback receives the raw ``payload`` passed to :meth:`emit`.
        Returns the callback unchanged so it can be used as a decorator.
        """
        self._emit_callbacks.append(callback)
        return callback

    def emit(self, payload: Any) -> None:
        """Push an event to all registered observers and connected API clients.

        Calls every callback registered with :meth:`on_emit`, then forwards
        the event to the API server queue when one is attached.  Safe to call
        from a synchronous ``__call__`` method; a no-op when no observers or
        server are attached.
        """
        for callback in self._emit_callbacks:
            callback(payload)
        if self._emit_queue is None or self._emit_loop is None:
            return
        self._emit_loop.call_soon_threadsafe(
            self._emit_queue.put_nowait,
            {"type": "event", "payload": payload},
        )

    def save_file(self, filepath: str | list[str], data: Any) -> str:
        """Write data to the record directory (format chosen by extension)."""
        filepath = joinpath(filepath)

        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until interface storage is mounted
            self._deferred_data[filepath] = data
            return "$deferred"

        file = save_file(self.local_directory(filepath), data, makedirs=True)
        # official mutating APIs keep updated_at reliable for sync tooling
        self.touch()

        return file

    def touch(self) -> None:
        """Mark the record as changed by bumping its ``updated_at`` marker.

        The marker is written through to the index. Called automatically by
        every official mutating API (``save_file``, ``update_status``,
        ``relate``, ``set_label``, ``to_directory``); call it manually after
        writing files into the record directory by other means. Sync tooling
        relies on this value, never directory mtimes.
        """
        if not self.is_mounted():
            return
        import time as _time

        from machinable.format import bump_updated_at, read_updated_at_ns

        directory = self.local_directory()
        bump_updated_at(directory)
        now = _time.monotonic()
        # The marker file (the source of truth) is bumped on every call; the
        # index write-through is debounced because write bursts (a dispatch
        # does many save_file calls) would otherwise pay a database round-trip
        # per write for a value the cache only needs approximately (ingest
        # re-derives it exactly from the marker).
        if now - getattr(self, "_last_touch_sync", 0.0) < 0.5:
            return
        self._last_touch_sync = now
        from machinable.index import Index

        updated_ns = read_updated_at_ns(directory)
        if updated_ns is not None:
            Index.get().set_updated_at(cast(str, self.uuid), updated_ns)

    @property
    def current_execution_context(self) -> Execution:
        """The Execution used when none is connected (created lazily)."""
        if self._current_execution_context is None:
            from machinable.execution import Execution

            self._current_execution_context = Execution()
        return self._current_execution_context

    @property
    def executions(self) -> ExecutionCollection:
        """Every Execution run-record of this interface."""
        from machinable.index import Index

        items = (
            Index.get().find(FindRequest(parent_id=self.uuid, kind="Execution")).items
        )
        return ExecutionCollection(
            [
                hydrated
                for item in items
                if (hydrated := Interface.find_by_id(item.record_id)) is not None
            ]
        )

    @property
    def execution(self) -> Execution:
        """The run-record for this interface (its latest child, or the ambient or lazy.

        Execution).
        """
        from machinable.execution import Execution
        from machinable.index import Index

        related = None
        if self.is_mounted():
            children = (
                Index.get()
                .find(FindRequest(parent_id=self.uuid, kind="Execution", limit=1))
                .items
            )
            if children:
                related = Interface.find_by_id(children[0].record_id)

        if related is None:
            if Execution.is_connected():
                related = Execution.get()
            else:
                related = self.current_execution_context

        related = cast("Execution", related)
        related.of(self)
        return related

    def launch(self) -> Self:
        """Materialize and compute this interface through an Execution."""
        from machinable.errors import MachinableError
        from machinable.execution import Execution

        self.fetch()

        if Execution.is_connected():
            execution = Execution.get()
            if execution.is_materialized():
                if self.cached():
                    return self
                if (
                    self.is_mounted()
                    and self.execution.is_materialized()
                    and self.execution.is_started()
                    and not self.execution.is_finished()
                ):
                    try:
                        self.execution.dispatch_interface(self)
                    except errors.DispatchException as ex:
                        raise errors.ExecutionFailed("Execution failed") from ex
                    return self
                raise MachinableError(
                    f"{repr(execution)} already exists and cannot be modified."
                )
            execution.add(self)
            return self

        # Execution().add(...).launch() chains on the runner; dispatch it directly.
        if isinstance(self, Execution) and self._interfaces:
            self.dispatch()
            return self

        runner = self.current_execution_context
        if (
            runner.is_materialized()
            and runner.is_started()
            and not runner.is_finished()
        ):
            try:
                runner.dispatch_interface(self)
            except errors.DispatchException as ex:
                raise errors.ExecutionFailed("Execution failed") from ex
            return self

        if runner.is_materialized():
            runner = Execution()
            self._current_execution_context = runner

        runner.add(self)
        try:
            runner.dispatch()
        except errors.DispatchException as ex:
            raise errors.ExecutionFailed("Execution failed") from ex

        return self

    def _catalog_record_id(self) -> str:
        """Record id for catalog-level markers (e.g. ``cached``), not run-records."""
        if not self.is_materialized():
            raise RuntimeError("Interface not yet materialized")

        from machinable.index import Index

        uuid = cast(str, self.uuid)
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return uuid
        if (
            entry.kind == "Execution"
            and entry.parent_id
            and "started_at" in (entry.predicate or {})
        ):
            return entry.parent_id
        return uuid

    def _catalog_marker_path(self, name: str, catalog_id: str | None = None) -> str:
        from machinable.index import Index

        record_id = catalog_id or self._catalog_record_id()
        return Index.get().local_directory(record_id, name)

    def cached(
        self,
        cached: bool | None = None,
        reason: str = "user",
        *,
        catalog_id: str | None = None,
    ) -> bool:
        """Read or set the cached marker; True when a finished result exists."""
        if cached is None:
            if not self.is_materialized():
                return "cached" in self._deferred_data
            return (
                load_file(
                    self._catalog_marker_path("cached", catalog_id),
                    default=None,
                )
                is not None
            )
        elif cached is True:
            path = self._catalog_marker_path("cached", catalog_id)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            save_file(path, str(reason))
            if (
                self.is_materialized()
                and catalog_id is None
                and self.uuid != self._catalog_record_id()
            ):
                try:
                    os.remove(self.local_directory("cached"))
                except OSError:
                    pass
            return True
        elif cached is False:
            if not self.is_materialized() and catalog_id is None:
                self._deferred_data.pop("cached", None)
                return False
            try:
                os.remove(self._catalog_marker_path("cached", catalog_id))
            except OSError:
                pass

        return cached

    def __call__(self) -> Any:
        """Override in Execution subclasses to provide runnable computation."""

    @property
    def interfaces(self) -> InterfaceCollection:
        """The interfaces this aggregate lays out, collected without running them."""
        if "interfaces" not in self._cache:
            from machinable.execution import Execution

            with Execution().deferred() as e:
                self.launch()
            self._cache["interfaces"] = e.interfaces

        return self._cache["interfaces"]

    def hidden(self, hidden: bool | None = None, reason: str = "user") -> bool:
        """Read or set this record's per-person hidden flag.

        Stored in the index's private overlay and never written to the record
        directory, so your hiding does not travel when the record is shared.
        The optional ``reason`` is kept in the overlay's ``private_json``.
        """
        from machinable.index import Index

        index = Index.get()
        uuid = cast(str, self.uuid)
        if hidden is None:
            if not self.is_materialized():
                return False
            entry = index.get_by_id(uuid)
            return bool(entry.hidden) if entry is not None else False
        elif hidden is True:
            index.hide(uuid)
            index.set_private(uuid, {"hidden_reason": str(reason)})
            return True
        elif hidden is False:
            index.unhide(uuid)
            index.set_private(uuid, {"hidden_reason": None})

        return hidden

    # a posteriori modifiers

    def all(self) -> InterfaceCollection:
        """Every stored run matching this interface's module and version."""
        name = cast(str, self.module)
        module = name if not name.startswith("__session__") else self.__class__
        return self.find(module, self.__model__.version, **self._kwargs)

    def new(self) -> Self:
        """A fresh, unmaterialized copy with the same module, version, and kwargs."""
        kwargs = dict(self._kwargs)
        return cast(Self, self.make(self.module, self.__model__.version, **kwargs))
