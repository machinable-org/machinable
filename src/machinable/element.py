from typing import TYPE_CHECKING, Any, Callable, List, Optional, Tuple, Union

import collections
import copy
import json
from functools import wraps

import arrow
import machinable
import omegaconf
import pydantic
from machinable import schema
from machinable.collection import Collection
from machinable.config import from_element, match_method, rewrite_config_methods
from machinable.errors import ConfigurationError, MachinableError
from machinable.mixin import Mixin
from machinable.types import ElementType, VersionType
from machinable.utils import Jsonable, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf

if TYPE_CHECKING:
    from machinable.storage import Storage


def belongs_to(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related_class = f()
            use_cache = True
            if isinstance(related_class, tuple):
                related_class, use_cache = related_class
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._key.lower()}.{name}",
            )
            if related is None:
                return None
            element = related_class.from_model(related)
            if not use_cache:
                return element
            self.__related__[name] = element

        return self.__related__.get(name, None)

    return _wrapper


has_one = belongs_to


def has_many(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element") -> Any:
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            args = f()
            use_cache = True
            if len(args) == 2:
                related_class, collection = args
            elif len(args) == 3:
                related_class, collection, use_cache = args
            else:
                assert False, "Invalid number of relation arguments"
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._key.lower()}.{name}",
            )
            if related is None:
                return None
            collected = collection(
                [related_class.from_model(r) for r in related]
            )
            if not use_cache:
                return collected
            self.__related__[name] = collected

        return self.__related__.get(name, None)

    return _wrapper


_CONNECTIONS = collections.defaultdict(lambda: [])


class Connectable:
    """Connectable trait"""

    __connection__: Optional["Connectable"] = None

    @classmethod
    def is_connected(cls) -> bool:
        if getattr(cls, "_key", None) is not None:
            return len(_CONNECTIONS[cls._key]) > 0

        return cls.__connection__ is not None

    @classmethod
    def get(cls) -> "Connectable":
        if getattr(cls, "_key", None) is not None:
            if len(_CONNECTIONS[cls._key]) > 0:
                return _CONNECTIONS[cls._key][-1]
            else:
                # default
                return cls.instance()

        return cls() if cls.__connection__ is None else cls.__connection__

    def connect(self) -> "Connectable":
        if getattr(self, "_key", None) is not None:
            _CONNECTIONS[self._key].append(self)
            return self
        self._outer_connection = (  # pylint: disable=attribute-defined-outside-init
            self.__class__.__connection__
        )
        self.__class__.__connection__ = self
        return self

    def close(self) -> "Connectable":
        if getattr(self, "_key", None) is not None:
            try:
                _CONNECTIONS[self._key].pop()
            except IndexError:
                pass
            return self

        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        if getattr(self, "_outer_connection", None) is not None:
            self.__class__.__connection__ = self._outer_connection
        return self

    def __enter__(self):
        return self.connect()

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.close()


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
            raise AttributeError(
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

    if not isinstance(compact_element, (list, tuple)):
        raise ValueError(
            f"Invalid component defintion. Expected list or str but found {compact_element}"
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


def _idversion_filter(value: Union[str, dict]) -> Union[str, dict, None]:
    if isinstance(value, str) and value.endswith("_"):
        return None

    def _f(m: Any):
        if not isinstance(m, collections.abc.Mapping):
            return m
        return {k: _f(v) for k, v in m.items() if not k.endswith("_")}

    return _f(value)


def idversion(version: VersionType) -> VersionType:
    return normversion([_idversion_filter(v) for v in normversion(version)])


def transfer_to(src: "Element", destination: "Element") -> "Element":
    destination.__model__ = src.__model__

    return destination


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


class Element(Mixin, Jsonable):
    """Element baseclass"""

    _key: Optional[str] = "Element"
    default: Optional["Element"] = None
    _module_: Optional[str] = None

    def __init__(self, version: VersionType = None):
        super().__init__()
        if Element._module_ is None:
            Element._module_ = self.__module__
        self.__model__ = schema.Element(
            module=Element._module_,
            version=normversion(version),
            lineage=get_lineage(self),
        )
        self.__related__ = {}
        self.__mixin__ = None
        self.__mixins__ = {}
        self._config: Optional[DictConfig] = None
        self._cache = {}

        Element._module_ = None

    @classmethod
    def make(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        base_class: "Element" = None,
        **constructor_kwargs,
    ) -> "Element":
        if module is None:
            if (
                cls.__module__.startswith("machinable.element")
                and cls.__name__ == "Element"
            ):
                raise ValueError("You have to provide a module.")

            module = cls.__module__

        if base_class is None:
            base_class = getattr(machinable, cls._key, Element)

        # prevent circular instantiation
        if module == "machinable" or module == base_class.__module__:
            return instantiate(
                module, base_class, version, **constructor_kwargs
            )

        from machinable.project import Project

        return Project.get().element(
            module=module,
            version=version,
            base_class=base_class,
            **constructor_kwargs,
        )

    @classmethod
    def instance(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        **constructor_kwargs,
    ) -> "Element":
        module, version = defaultversion(module, version, cls)
        return cls.make(
            module, version, base_class=Element, **constructor_kwargs
        )

    def mount(self, storage: "Storage", storage_id: Any) -> bool:
        if self.__model__ is None:
            return False

        self.__model__._storage_instance = storage
        self.__model__._storage_id = storage_id

        return True

    def is_mounted(self) -> bool:
        if self.__model__ is None:
            return False

        return (
            self.__model__._storage_instance is not None
            and self.__model__._storage_id is not None
        )

    @classmethod
    def from_model(cls, model: schema.Element) -> "Element":
        if cls.__module__ != model.module:
            # re-instantiate element class
            instance = cls.make(model.module)
        else:
            instance = cls()

        instance.set_model(model)

        return instance

    @classmethod
    def find(cls, element_id: str, *args, **kwargs) -> Optional["Element"]:
        from machinable.storage import Storage

        storage = Storage.get()

        storage_id = getattr(storage, f"find_{cls._key.lower()}")(
            element_id, *args, **kwargs
        )

        if storage_id is None:
            return None

        return cls.from_storage(storage_id, storage)

    @classmethod
    def find_many(cls, elements: List[str]) -> "Collection":
        return cls.collect([cls.find(element_id) for element_id in elements])

    @classmethod
    def find_by_version(
        cls, module: str, version: VersionType = None, mode: str = "default"
    ) -> "Collection":
        from machinable.storage import Storage

        storage = Storage.get()

        storage_ids = getattr(storage, f"find_{cls._key.lower()}_by_version")(
            module, version, mode=mode
        )

        return cls.collect(
            [
                cls.from_storage(storage_id, storage)
                for storage_id in storage_ids
            ]
        )

    @classmethod
    def singleton(cls, module: str, version: VersionType) -> "Element":
        candidates = cls.find_by_version(module, version, mode="id")
        if candidates:
            for candidate in reversed(candidates):
                if candidate.is_finished():
                    return candidate

        return cls.make(module, version)

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

                    # expose raw config so events and config methods can use it
                    config_model = from_element(self) or pydantic.BaseModel
                    raw_config = config_model().dict()

                    self._config = OmegaConf.create(raw_config)

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
                    config = config_model(**config).dict()

                    # add introspection data
                    config["_raw_"] = raw_config
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

    @property
    def storage_id(self) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_id

    @property
    def storage_instance(self) -> Optional["Storage"]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance

    @classmethod
    def from_storage(cls, storage_id, storage=None) -> "Element":
        if storage is None:
            from machinable.storage import Storage

            storage = Storage.get()

        return cls.from_model(
            getattr(storage, f"retrieve_{cls._key.lower()}")(storage_id)
        )

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def model(cls, element: Optional[Any] = None) -> schema.Element:
        if element is not None:
            if isinstance(element, cls):
                return element.__model__

            if isinstance(element, cls.model()):
                return element

            raise ValueError(f"Invalid {cls._key.lower()} model: {element}.")

        if cls._key is None:
            return schema.Element

        return getattr(schema, cls._key)

    def set_model(self, model: schema.Element) -> "Element":
        self.__model__ = model

        # invalidate cached config
        self._config = None

        return self

    @classmethod
    def set_default(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
    ) -> None:
        cls.default = compact(module, version)

    def serialize(self) -> dict:
        # ensure that configuration has been parsed
        assert self.config is not None
        return self.__model__.dict()

    @classmethod
    def unserialize(cls, serialized):
        return cls.from_model(cls.model()(**serialized))

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (), self.serialize())

    def __getstate__(self):
        return self.serialize()

    def __setstate__(self, state):
        self.__model__ = self.__class__.model()(**state)

    def __str__(self):
        return self.__repr__()

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

    def __getattr__(self, name) -> Any:
        attr = getattr(self.__mixin__, name, None)
        if attr is not None:
            return attr
        raise AttributeError(
            "{!r} object has no attribute {!r}".format(
                self.__class__.__name__, name
            )
        )


def get_lineage(element: "Element") -> Tuple[str, ...]:
    return tuple(
        obj.module if isinstance(obj, Element) else obj.__module__
        for obj in element.__class__.__mro__[1:-3]
    )
