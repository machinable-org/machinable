from typing import TYPE_CHECKING, Any, Callable, List, Optional, Tuple, Union, Dict

from functools import wraps

import arrow
from machinable import schema
from machinable.types import ComponentType, VersionType
from machinable.collection import Collection
from machinable.utils import (
    Jsonable,
    find_subclass_in_module,
    import_from_directory,
    resolve_at_alias,
)


import collections
import copy
import re

import omegaconf
from machinable.errors import ConfigurationError
from machinable.utils import Jsonable, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf
from pydantic.dataclasses import dataclass

if TYPE_CHECKING:
    from machinable.storage import Storage


def belongs_to(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        related_class = f()
        use_cache = True
        if isinstance(related_class, tuple):
            related_class, use_cache = related_class
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._kind.lower()}.{name}",
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
        args = f()
        use_cache = True
        if len(args) == 2:
            related_class, collection = args
        elif len(args) == 3:
            related_class, collection, use_cache = args
        else:
            assert False, "Invalid number of relation arguments"
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._kind.lower()}.{name}",
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


class Connectable:
    """Connectable trait"""

    __connection__: Optional["Connectable"] = None

    @classmethod
    def get(cls) -> "Connectable":
        return cls() if cls.__connection__ is None else cls.__connection__

    def connect(self) -> "Connectable":
        self.__class__.__connection__ = self
        return self

    def close(self) -> "Connectable":
        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        return self

    def __enter__(self):
        self._outer_connection = (  # pylint: disable=attribute-defined-outside-init
            self.__class__.__connection__
        )
        self.connect()
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        if getattr(self, "_outer_connection", None) is not None:
            self.__class__.__connection__ = self._outer_connection



def _rewrite_config_methods(
    config: Union[collections.abc.Mapping, str, list, tuple]
) -> Any:
    if isinstance(config, list):
        return [_rewrite_config_methods(v) for v in config]

    if isinstance(config, tuple):
        return (_rewrite_config_methods(v) for v in config)

    if isinstance(config, collections.abc.Mapping):
        return {k: _rewrite_config_methods(v) for k, v in config.items()}

    if isinstance(config, str):
        fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", config)
        if fn_match is not None:
            function = fn_match.groupdict()["method"]
            args = fn_match.groupdict()["args"]
            return '${config_method:"' + function + '","' + args + '"}'

    return config


class ConfigMethod:
    def __init__(self, component: "Component") -> None:
        self.component = component

    def __call__(self, function, args) -> Any:
        definition = f"{function}({args})"
        method = f"config_{function}"

        if hasattr(self.component, method):
            prefix = "self.component."
        elif hasattr(self.component.parent, method):
            prefix = "self.component.parent."
        else:
            raise AttributeError(
                f"Config method {definition} specified but {type(self.component).__name__}.{method}() does not exist."
            )

        # Using eval is evil, but in this case there is probably not enough at stake
        # to justify the implementation of a proper parser
        try:
            return eval(  # pylint: disable=eval-used
                prefix + method + "(" + args + ")"
            )
        except Exception as _ex:
            raise ConfigurationError(
                f"{_ex} in config method {type(self.component).__name__}.{method}()"
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
            # convert to dict
            return OmegaConf.to_container(OmegaConf.create(item))
        return item

    return [_norm(v) for v in version if _valid(v)]


def compact(
    component: Union[str, List[Union[str, dict, None]]],
    version: VersionType = None,
) -> ComponentType:
    if isinstance(component, (list, tuple, omegaconf.listconfig.ListConfig)):
        component, *default_version = component
        if not isinstance(version, (list, tuple)):
            version = [version]
        version = list(default_version) + version

    if not isinstance(component, str):
        raise ValueError(
            f"Invalid component, expected str but found <{type(component).__name__}>: {component}"
        )

    return [component] + normversion(version)


def extract(
    compact_component: Union[str, List[Union[str, dict]], None]
) -> Tuple[Optional[str], Optional[List[Union[str, dict]]]]:
    if compact_component is None:
        return None, None

    if isinstance(compact_component, str):
        return compact_component, None

    if not isinstance(compact_component, (list, tuple)):
        raise ValueError(
            f"Invalid component defintion. Expected list or str but found {compact_component}"
        )

    if len(compact_component) == 0:
        raise ValueError(
            f"Invalid component defintion. Expected str or non-empty list."
        )

    if not isinstance(compact_component[0], str):
        raise ValueError(
            f"Invalid component defintion. First element in list has to be a string."
        )

    if len(compact_component) == 1:
        return compact_component[0], None

    return compact_component[0], normversion(compact_component[1:])


def _internal_key(key):
    return key.startswith("_") and key.endswith("_")



class Element(Jsonable):
    """Element baseclass"""

    _kind = None
    default: Optional["Element"] = None

    def __new__(cls, *args, **kwargs):
        view = kwargs.pop("view", cls._kind in ["Experiment", "Execution"])
        if view is True:
            view = args[0] if len(args) > 0 else False
        if getattr(cls, "_active_view", None) is None and isinstance(view, str):
            from machinable.project import Project

            module = import_from_directory(view, Project.get().path())
            view_class = find_subclass_in_module(module, cls)
            if view_class is not None:
                return super().__new__(view_class)

        return super().__new__(cls)

    def __init__(self, version: VersionType = None, parent: Union["Element", None] = None):
        super().__init__()
        
        self.__model__: schema.Model = None
        self.__related__ = {}
        self._cache = {}
        self.__config: Optional[dict] = None
        self.__version = normversion(version)
        self.__parent = parent
        self._config: Optional[DictConfig] = None
        self._resolved_components: Dict[str, "Component"] = {}

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

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    def __getitem__(self, view: str) -> "Element":
        from machinable.view import from_element

        return from_element(
            resolve_at_alias(view, f"{self._kind.lower()}s"), self
        )

    @classmethod
    def from_model(cls, model: schema.Model) -> "Element":
        instance = cls()
        instance.__model__ = model
        return instance

    @classmethod
    def find(cls, element_id: str, *args, **kwargs) -> Optional["Element"]:
        from machinable.repository import Repository

        storage = Repository.get().storage()

        storage_id = getattr(storage, f"find_{cls._kind.lower()}")(
            element_id, *args, **kwargs
        )

        if storage_id is None:
            return None

        return cls.from_storage(storage_id, storage)

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
            from machinable.repository import Repository

            storage = Repository.get().storage()

        return cls.from_model(
            getattr(storage, f"retrieve_{cls._kind.lower()}")(storage_id)
        )

    @classmethod
    def find_many(cls, elements: List[str]) -> "Collection":
        return cls.collect([cls.find(element_id) for element_id in elements])

    def find_latest(self, limit=10, since=None):
        if since is None:
            condition = {"<=": arrow.now()}
        else:
            condition = {">": since}
        raise NotImplementedError

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def model(cls, element: Optional[Any] = None) -> schema.Model:
        if element is not None:
            if isinstance(element, cls):
                return element.__model__

            if isinstance(element, cls.model()):
                return element

            raise ValueError(f"Invalid {cls._kind.lower()} model: {element}.")

        if cls._kind is None:
            return schema.Model

        return getattr(schema, cls._kind)
    
    @classmethod
    def make(
        cls,
        name: Optional[str] = None,
        version: VersionType = None,
        slots: Optional[dict] = None,
        parent: Union["Element", "Component", None] = None,
    ) -> "Component":
        if name is None:
            if (
                cls.__module__.startswith("machinable.component")
                and cls.__name__ == "Component"
            ):
                raise ValueError("You have to provide a component name.")

            name = cls.__module__

        from machinable.project import Project

        return Project.get().get_component(name, version, slots, parent)

    @classmethod
    def set_default(
        cls,
        name: Optional[str] = None,
        version: VersionType = None,
    ) -> None:
        cls.default = compact(name, version)

    @property
    def components(self) -> Dict[str, "Component"]:
        from machinable.project import Project

        for slot, component in self.config.get("_uses_", {}).items():
            if slot not in self._resolved_components:
                self._resolved_components[slot] = Project.get().get_component(
                    component[0], component[1:], parent=self
                )

        return self._resolved_components

    @property
    def parent(self) -> Optional["Component"]:
        return self.__parent if isinstance(self.__parent, Component) else None

    @property
    def config(self) -> DictConfig:
        """Component configuration"""
        if self._config is None:
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
                name="config_method", resolver=ConfigMethod(self), replace=True
            )

            __config = copy.deepcopy(self.__config)
            __version = copy.deepcopy(self.__version)

            lineage = copy.deepcopy(self.__config.get("_lineage_", []))
            uses = copy.deepcopy(self.__config.get("_uses_", {}))
            # parse slots
            available_slots = {
                key[1:-1]: value
                for key, value in __config.items()
                if key.startswith("<") and key.endswith(">")
            }

            dynamic_uses = False
            if "_dynamic_uses_" in __config:
                dynamic_uses = __config.pop("_dynamic_uses_")
            # validate uses
            if not dynamic_uses:
                for use in uses:
                    if use not in available_slots:
                        raise ConfigurationError(
                            f"'{self.__module__}' has no slot '{use}'"
                        )

            # we assign the raw config
            self._config = OmegaConf.create(__config)

            self.on_before_configure(self._config)

            slot_update = {}
            for slot, slot_config in available_slots.items():
                if slot_config is None:
                    continue
                if not isinstance(slot_config, collections.abc.Mapping):
                    slot_config = {"_default_": slot_config}
                if slot not in uses:
                    # default available?
                    default = slot_config.get("_default_", None)
                    if default is not None:
                        uses[slot] = normversion(default)
                if slot in uses:
                    slot_update = update_dict(slot_update, slot_config)

            self._config = OmegaConf.merge(self._config, slot_update)

            # compose configuration update
            config_update = {}
            for version in __version:
                if isinstance(version, collections.abc.Mapping):
                    version = unflatten_dict(version)
                elif isinstance(version, str) and version.startswith("~"):
                    # from local version
                    name = version[1:]
                    path = name.split(":")
                    version = {}
                    level = self._config
                    try:
                        for key in path:
                            level = level["~" + key]
                            # extract config on this level
                            patch = {
                                k: copy.deepcopy(v)
                                for k, v in level.items()
                                if not k.startswith("~")
                            }
                            version = update_dict(version, patch)
                    except KeyError as _e:
                        raise ConfigurationError(
                            f"'~{name}' could not be resolved."
                        ) from _e

                config_update = update_dict(config_update, version)

            # apply update
            self._config = OmegaConf.merge(self._config, config_update)

            # remove versions and uses
            config = {
                k: v
                for k, v in OmegaConf.to_container(self._config).items()
                if not (
                    k.startswith("~") or (k.startswith("<") and k.endswith(">"))
                )
            }

            # enable config methods
            self._config = OmegaConf.create(_rewrite_config_methods(config))

            # computed configuration transform
            self.on_configure()

            # resolve config
            config = OmegaConf.to_container(self._config, resolve=True)

            slot_version = {
                name: copy.deepcopy(config.get(name, {})) for name in uses
            }

            # parse config if config class is available
            if hasattr(self.__class__, "Config"):
                config["_schematized_"] = True

                class SchemaConf:
                    extra = "forbid"

                schema = dataclass(config=SchemaConf)(
                    getattr(self.__class__, "Config")
                ).__pydantic_model__

                parsed = schema(
                    **{
                        k: v
                        for k, v in config.items()
                        if not (_internal_key(k) or k in uses)
                    }
                )

                config = parsed.dict()
            else:
                config["_schematized_"] = False

            # add introspection data
            config["_lineage_"] = lineage
            config["_uses_"] = uses
            config["_raw_"] = self.__config
            config["_component_"] = self.__class__.__module__
            config["_version_"] = self.__version
            config["_slot_update_"] = slot_update
            config["_update_"] = config_update

            # make config property accessible for slot components
            self._config = OmegaConf.create(config)

            # resolve slot components
            self._resolved_components = {}
            for name, component in self.components.items():
                # we prepend the version to allow for slot component overrides
                component.__version = [slot_version[name]] + component.__version
                self._config[name] = component.config

            # disallow further transformation
            OmegaConf.set_readonly(self._config, True)

        return self._config

    def serialize(self) -> dict:
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
