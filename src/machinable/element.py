from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import collections
import copy
import json
import os
import stat
import sys

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

import arrow
import dill as pickle
import machinable
import omegaconf
import pydantic
from machinable import schema
from machinable.collection import ElementCollection
from machinable.config import from_element, match_method, rewrite_config_methods
from machinable.errors import ConfigurationError, MachinableError
from machinable.mixin import Mixin
from machinable.settings import get_settings
from machinable.types import DatetimeType, ElementType, VersionType
from machinable.utils import Jsonable, sentinel, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf


class ConfigMethod:
    def __init__(self, element: "Element", prefix="config") -> None:
        self.element = element
        self.prefix = prefix

    def __call__(self, function, args) -> Any:
        from machinable.project import Project

        definition = f"{function}({args})"
        method = f"{self.prefix}_{function}"

        if hasattr(self.element, method):
            obj = "self.element."
        elif hasattr(Project.get().provider(), method):
            obj = "Project.get().provider()."
        else:
            raise ConfigurationError(
                f"{self.prefix.title()} method {definition} specified but {type(self.element).__name__}.{method}() does not exist."
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


def normversion(version: VersionType = None) -> List[Union[str, dict]]:
    if not isinstance(
        version,
        (
            list,
            tuple,
            omegaconf.listconfig.ListConfig,
        ),
    ):
        version = [version]

    def _valid(item):
        if item is None or item == {}:
            # skip
            return False

        if not isinstance(item, (collections.abc.Mapping, str)):
            raise ValueError(
                f"Invalid version. Expected str or dict but found {type(item).__name__}: {item}"
            )

        return True

    def _norm(item):
        if isinstance(item, collections.abc.Mapping):
            # convert to dict and unflatten
            return unflatten_dict(
                OmegaConf.to_container(OmegaConf.create(item))
            )

        return item

    return [_norm(v) for v in version if _valid(v)]


def compact(
    element: Union[str, List[Union[str, dict, None]]],
    version: VersionType = None,
) -> ElementType:
    if isinstance(element, (list, tuple, omegaconf.listconfig.ListConfig)):
        element, *default_version = element
        if not isinstance(version, (list, tuple)):
            version = [version]
        version = list(default_version) + version

    if not isinstance(element, str):
        raise ValueError(
            f"Invalid component, expected str but found <{type(element).__name__}>: {element}"
        )

    return [element] + normversion(version)


def defaultversion(
    module: Optional[str], version: VersionType, element: "Element"
) -> Tuple[Optional[str], VersionType]:
    if module is not None:
        return module, normversion(version)

    # handle in-session defaults
    if isinstance(element.default, (list, tuple)) and not isinstance(
        element.default[0], str
    ):
        return element.default[0], element.default[1:] + normversion(version)

    default_version = normversion(element.default)

    if len(default_version) == 0:
        return module, normversion(version)

    if isinstance(default_version[0], str) and not default_version[
        0
    ].startswith("~"):
        if module is None:
            return default_version[0], default_version[1:] + normversion(
                version
            )
        else:
            return module, default_version[1:] + normversion(version)

    return module, default_version + normversion(version)


def extract(
    compact_element: Union[str, List[Union[str, dict]], None]
) -> Tuple[Optional[str], Optional[List[Union[str, dict]]]]:
    if compact_element is None:
        return None, None

    if isinstance(compact_element, str):
        return compact_element, None

    if isinstance(compact_element, omegaconf.listconfig.ListConfig):
        compact_element = list(compact_element)

    if not isinstance(compact_element, (list, tuple)):
        raise ValueError(
            f"Invalid component defintion. Expected list or str but found {type(compact_element)}: {compact_element}"
        )

    if len(compact_element) == 0:
        raise ValueError(
            f"Invalid component defintion. Expected str or non-empty list."
        )

    if not isinstance(compact_element[0], str):
        raise ValueError(
            f"Invalid component defintion. First element in list has to be a string."
        )

    if len(compact_element) == 1:
        return compact_element[0], None

    return compact_element[0], normversion(compact_element[1:])


def equalversion(a: VersionType, b: VersionType) -> bool:
    return json.dumps(normversion(a), sort_keys=True) == json.dumps(
        normversion(b), sort_keys=True
    )


def _filter_enderscores(m: Any):
    if not isinstance(m, collections.abc.Mapping):
        return m
    return {
        k: _filter_enderscores(v) for k, v in m.items() if not k.endswith("_")
    }


def _idversion_filter(value: Union[str, dict]) -> Union[str, dict, None]:
    if isinstance(value, str) and value.endswith("_"):
        return None

    return _filter_enderscores(value)


def idversion(version: VersionType) -> VersionType:
    return normversion([_idversion_filter(v) for v in normversion(version)])


def transfer_to(src: "Element", destination: "Element") -> "Element":
    destination.__model__ = src.__model__

    return destination


def uuid_to_id(uuid: str) -> str:
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    # convert uuid hex to base 62 of length 6
    result = ""
    for i in range(0, 6 * 2, 2):
        result += alphabet[int(uuid[i : i + 2], 16) % 62]

    return result


def resolve_custom_predicate(predicate: str, element: "Element"):
    from machinable.project import Project

    custom = element.on_compute_predicate() or {}
    if isinstance(element, Project):
        custom.update(element.global_predicate() or {})
    else:
        custom.update(Project.get().provider().global_predicate() or {})
    custom.update(getattr(element, "_starred_predicates", {}))

    if custom:
        predicate = predicate.replace(
            "*",
            ",".join(
                [k.replace("*", "") for k in custom.keys() if k.endswith("*")]
            ),
        )
    return [
        p.strip() for p in predicate.split(",") if p.strip() not in ("*", "")
    ]


def instantiate(
    module: str, class_: "Element", version: VersionType, **constructor_kwargs
):
    try:
        Element._module_ = module  # assign project-relative module
        instance = class_(version=version, **constructor_kwargs)
        instance.on_instantiate()
        return instance
    except TypeError as _ex:
        raise MachinableError(
            f"Could not instantiate element {class_.__module__}.{class_.__name__}"
        ) from _ex


_CONNECTIONS = collections.defaultdict(lambda: [])


class Element(Mixin, Jsonable):
    """Element baseclass"""

    kind: Optional[str] = "Element"
    default: Optional["Element"] = None
    _module_: Optional[str] = None

    def __init__(self, version: VersionType = None):
        super().__init__()
        if Element._module_ is None:
            Element._module_ = self.__module__
        self.__model__ = schema.Element(
            kind=self.kind,
            module=Element._module_,
            version=normversion(version),
            lineage=get_lineage(self),
            _dump=pickle.dumps(self.__class__)
            if Element._module_.startswith("__session__")
            else None,
        )
        self.__mixin__ = None
        self.__mixins__ = {}
        self._config: Optional[DictConfig] = None
        self._predicate: Optional[DictConfig] = None
        self._cache = {}

        Element._module_ = None

    @property
    def uuid(self) -> str:
        return self.__model__.uuid

    @property
    def id(self) -> str:
        return self.uuid[:6]

    @property
    def timestamp(self) -> float:
        return self.__model__.timestamp

    def timestamp_at(self) -> DatetimeType:
        return arrow.get(self.__model__.timestamp)

    def version(
        self, version: VersionType = sentinel, overwrite: bool = False
    ) -> List[Union[str, dict]]:
        if version is sentinel:
            return self.__model__.version

        if hasattr(self, "is_mounted") and self.is_mounted():
            raise MachinableError(
                f"Cannot change version of mounted element {self}"
            )

        if overwrite:
            self.__model__.version = normversion(version)
        else:
            self.__model__.version.extend(normversion(version))

        self._clear_caches()

        return self.__model__.version

    @classmethod
    def set_default(
        cls,
        module: Union[str, "Element", None] = None,
        version: VersionType = None,
    ) -> None:
        if module is not None and not isinstance(module, str):
            cls.default = [module] + normversion(version)
            return
        cls.default = compact(module, version)

    def as_default(self) -> Self:
        cls = getattr(machinable, self.kind, Element)
        cls.set_default(self.__model__.module, self.__model__.version)

        return self

    @classmethod
    def connected(cls) -> List["Element"]:
        return _CONNECTIONS[cls.kind]

    @classmethod
    def get(
        cls,
        module: Union[str, "Element", None] = None,
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Element":
        if module is None and version is None:
            if len(_CONNECTIONS[cls.kind]) > 0:
                return _CONNECTIONS[cls.kind][-1]

        if module is None or predicate is None:
            return cls.instance(module, version, **kwargs)

        return cls.singleton(module, version, predicate, **kwargs)

    @classmethod
    def make(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        base_class: "Element" = None,
        **kwargs,
    ) -> "Element":
        if module is None:
            module = cls.__module__

        if base_class is None:
            base_class = getattr(machinable, cls.kind, Element)

        # prevent circular instantiation
        if module == "machinable" or module == base_class.__module__:
            return instantiate(module, base_class, version, **kwargs)

        from machinable.project import Project

        return Project.get().element(
            module=module,
            version=version,
            base_class=base_class,
            **kwargs,
        )

    @classmethod
    def instance(
        cls,
        module: Union[None, str, "Element"] = None,
        version: VersionType = None,
        **kwargs,
    ) -> "Element":
        module, version = defaultversion(module, version, cls)
        return cls.make(module, version, base_class=cls, **kwargs)

    @classmethod
    def singleton(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Element":
        # no-op as elements do not have a storage representation
        return cls.make(module, version, **kwargs)

    @classmethod
    def from_model(cls, model: schema.Element) -> "Element":
        if cls.__module__ != model.module:
            # re-instantiate element class
            if model.module and model.module.startswith("__session__"):
                if model._dump is None:
                    raise RuntimeError(
                        f"Unable to restore element {model.module}"
                    )
                instance = cls.make(pickle.loads(model._dump))
            else:
                instance = cls.make(model.module)
        else:
            instance = cls()

        instance.set_model(model)

        return instance

    def on_compute_predicate(self) -> Optional[Dict]:
        """Event to compute a custom predicate dictionary of the element
        where each key presents a predicate that can be used
        during element lookup. Keys marked with a * are automatically
        matched."""

    @property
    def predicate(self) -> DictConfig:
        if self._predicate is None:
            if self.__model__.predicate is None:
                self.__model__.predicate = OmegaConf.to_container(
                    OmegaConf.create(self.compute_predicate())
                )

            self._predicate = OmegaConf.create(self.__model__.predicate)

        return self._predicate

    @property
    def config(self) -> DictConfig:
        """Element configuration"""
        if self._config is None:
            try:
                if self.__model__.config is not None:
                    self._config = OmegaConf.create(self.__model__.config)
                else:
                    # register resolvers
                    for name in dir(self):
                        if name.startswith("resolver_") and len(name) > 9:
                            method = getattr(self, name, None)
                            if callable(method):
                                OmegaConf.register_new_resolver(
                                    name=name[9:], resolver=method, replace=True
                                )

                    # config method resolver
                    OmegaConf.register_new_resolver(
                        name="config_method",
                        resolver=ConfigMethod(self),
                        replace=True,
                    )

                    # expose default config so events and config methods can use it
                    default_config, config_model = from_element(self)

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
                                    f"Version method {definition} must produce a mapping, but returned {type(version)}: {version}"
                                )

                        config_update = update_dict(config_update, version)

                    # apply update
                    self._config = OmegaConf.merge(self._config, config_update)

                    # enable config methods
                    self._config = OmegaConf.create(
                        rewrite_config_methods(self._config)
                    )

                    # computed configuration transform
                    self.on_configure()

                    # resolve config
                    config = OmegaConf.to_container(self._config, resolve=True)

                    # enforce schema
                    if config_model is not None:
                        config = config_model(**config).dict()

                    # add introspection data
                    config["_default_"] = default_config
                    config["_version_"] = __version
                    config["_update_"] = config_update

                    # make config property accessible for slot components
                    self._config = OmegaConf.create(config)

                    # disallow further transformation
                    OmegaConf.set_readonly(self._config, True)

                    # save to model
                    self.__model__.config = OmegaConf.to_container(self._config)
            except (ValueError, omegaconf.errors.OmegaConfBaseException) as _ex:
                raise ConfigurationError(str(_ex)) from _ex

        return self._config

    @property
    def module(self) -> Optional[str]:
        return self.__model__.module

    @property
    def lineage(self) -> Tuple[str, ...]:
        return self.__model__.lineage

    @classmethod
    def collect(cls, elements) -> ElementCollection:
        return ElementCollection(elements)

    @classmethod
    def model(cls, element: Optional[Any] = None) -> schema.Element:
        if element is not None:
            if isinstance(element, cls):
                return element.__model__

            if isinstance(element, cls.model()):
                return element

            raise ValueError(f"Invalid {cls.kind.lower()} model: {element}.")

        if cls.kind is None:
            return schema.Element

        return getattr(schema, cls.kind)

    def matches(self, element: "Element", predicate: str) -> bool:
        for p in resolve_custom_predicate(predicate, element):
            if not equalversion(self.predicate[p], element.predicate[p]):
                return False

        return True

    def set_model(self, model: schema.Element) -> Self:
        self.__model__ = model

        # invalidate cached config
        self._config = None
        self._predicate = None

        return self

    def serialize(self) -> Dict:
        # ensure that configuration has been parsed
        assert self.config is not None
        return self.__model__.dict()

    @classmethod
    def unserialize(cls, serialized):
        return cls.from_model(cls.model()(**serialized))

    @classmethod
    def is_connected(cls) -> bool:
        return len(_CONNECTIONS[cls.kind]) > 0

    def compute_predicate(self) -> Dict:
        from machinable.project import Project

        custom = self.on_compute_predicate() or {}
        if isinstance(self, Project):
            custom.update(self.global_predicate() or {})
        else:
            custom.update(Project.get().provider().global_predicate() or {})

        config = copy.deepcopy(OmegaConf.to_container(self.config))
        default = config.pop("_default_")
        version = config.pop("_version_")
        update = config.pop("_update_")

        return {
            "config_update": _filter_enderscores(update),
            "config_update_": update,
            "config": _filter_enderscores(config),
            "config_": config,
            "version": idversion(version),
            "version_": version,
            **{k.replace("*", ""): v for k, v in custom.items()},
        }

    def on_instantiate(self) -> None:
        """Event that is invoked whenever the element is instantiated"""

    def on_before_configure(self, config: DictConfig) -> None:
        """Configuration event operating on the raw configuration
        This may be used to apply computed configuration updates
        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def on_configure(self) -> None:
        """Configuration event
        This may be used to apply computed configuration updates
        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def _clear_caches(self) -> None:
        self._config = None
        self.__model__.config = None

    def __getattr__(self, name) -> Any:
        attr = getattr(self.__mixin__, name, None)
        if attr is not None:
            return attr
        raise AttributeError(
            "{!r} object has no attribute {!r}".format(
                self.__class__.__name__, name
            )
        )

    def __enter__(self) -> Self:
        _CONNECTIONS[self.kind].append(self)
        return self

    def __exit__(self, *args, **kwargs):
        try:
            _CONNECTIONS[self.kind].pop()
        except IndexError:
            pass

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (), self.serialize())

    def __getstate__(self):
        return self.serialize()

    def __setstate__(self, state):
        self.__model__ = self.__class__.model()(**state)

    def __repr__(self):
        return f"{self.kind} [{self.id}]"

    def __str__(self):
        return self.__repr__()

    def __eq__(self, other):
        return self.uuid == other.uuid

    def __ne__(self, other):
        return self.uuid != other.uuid


def get_lineage(element: "Element") -> Tuple[str, ...]:
    return tuple(
        obj.module if isinstance(obj, Element) else obj.__module__
        for obj in element.__class__.__mro__[1:-3]
    )


def get_dump(element: "Element") -> Optional[bytes]:
    if element.__model__.module.startswith("__session__"):
        return pickle.dumps(element.__class__)


def reset_connections() -> None:
    _CONNECTIONS.clear()
