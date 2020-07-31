# This file contains modified 3rd party source code from
# https://github.com/drgrib/dotmap
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from collections import OrderedDict
from inspect import ismethod
from json import dumps
from pprint import pprint

from dotmap import DotMap


def config_map(d=None):
    if d is None:
        d = {}
    return ConfigMap(d, _dynamic=False, _evaluate=False, _evaluated=True)


class ConfigMethod(object):
    def __init__(self, obj, method, args, definition):
        self._ = {"obj": obj, "method": method, "args": args, "definition": definition}

    def evaluate(self):
        # disable config evaluation
        try:
            state = self._["obj"].config._evaluate
            self._["obj"].config._evaluate = False
            # todo: disable for sub-components
        except AttributeError:
            state = None

        if self._["args"] == "":
            value = getattr(self._["obj"], self._["method"])()
        else:
            # Yes, using eval is evil but in this case I suppose there is not enough at stake to justify
            # the implementation of a proper parser
            obj = self._["obj"]  # noqa: F841
            value = eval("obj." + self._["method"] + "(" + self._["args"] + ")")

        # reset config evaluation
        if state is not None:
            self._["obj"].config._evaluate = state

        if isinstance(value, dict):
            return ConfigMap(value, _dynamic=False)

        return value

    def __repr__(self):
        return f"ConfigMethod(method={self._['obj'].__class__.__name__}.{self._['method']}, args='{self._['args']}')"

    def __str__(self):
        return self.__repr__()

    def __call__(self, *args, **kwargs):
        return self.evaluate()


class ConfigMap(DotMap):
    def __init__(self, *args, **kwargs):
        self._map = OrderedDict()
        self._dynamic = True
        self._evaluate = True
        self._evaluated = False
        if kwargs:
            if "_dynamic" in kwargs:
                self._dynamic = kwargs["_dynamic"]
            if "_evaluate" in kwargs:
                self._evaluate = kwargs["_evaluate"]
            if "_evaluated" in kwargs:
                self._evaluated = kwargs["_evaluated"]
        if args:
            d = args[0]
            # for recursive assignment handling
            trackedIDs = {id(d): self}
            if isinstance(d, dict):
                for k, v in self.__call_items(d):
                    if isinstance(v, dict):
                        if id(v) in trackedIDs:
                            v = trackedIDs[id(v)]
                        else:
                            v = self.__class__(
                                v,
                                _dynamic=self._dynamic,
                                _evaluate=self._evaluate,
                                _evaluated=self._evaluated,
                            )
                            trackedIDs[id(v)] = v
                    if type(v) is list:
                        lst = []
                        for i in v:
                            n = i
                            if isinstance(i, dict):
                                n = self.__class__(
                                    i,
                                    _dynamic=self._dynamic,
                                    _evaluate=self._evaluate,
                                    _evaluated=self._evaluated,
                                )
                            lst.append(n)
                        v = lst
                    self._map[k] = v
        if kwargs:
            for k, v in self.__call_items(kwargs):
                if k not in ("_dynamic", "_evaluate", "_evaluated"):
                    self._map[k] = v

    def toDict(self, evaluate=None, with_hidden=True):
        if evaluate is None:
            evaluate = bool(self._evaluate)
        d = {}
        for k, v in self.items():
            if (
                with_hidden is False
                and isinstance(k, str)
                and (k.startswith("_") and not k.endswith("_"))
            ):
                continue
            if evaluate and isinstance(v, ConfigMethod):
                v = v.evaluate()
            if issubclass(type(v), DotMap):
                # bizarre recursive assignment support
                if id(v) == id(self):
                    v = d
                else:
                    v = v.toDict(evaluate=evaluate, with_hidden=with_hidden)
            elif type(v) in (list, tuple):
                l = []
                for i in v:
                    n = i
                    if issubclass(type(i), DotMap):
                        n = i.toDict(evaluate=evaluate, with_hidden=with_hidden)
                    l.append(n)
                if type(v) is tuple:
                    v = tuple(l)
                else:
                    v = l
            d[k] = v
        return d

    def pprint(self, pformat="json"):
        if pformat == "json":
            print(dumps(self.toDict(), indent=4, sort_keys=True))
        else:
            pprint(self.toDict())

    def __call_items(self, obj):
        if hasattr(obj, "iteritems") and ismethod(getattr(obj, "iteritems")):
            return obj.iteritems()
        else:
            return obj.items()

    def copy(self):
        return self.__class__(
            self,
            _dynamic=self._dynamic,
            _evaluate=self._evaluate,
            _evaluated=self._evaluated,
        )

    def get_versioning(self):
        return [k[1:] for k in self.keys() if k.startswith("~")]

    def get_deep_diff(self, obj, *args, **kwargs):
        from deepdiff import DeepDiff

        return DeepDiff(self.toDict(), obj, *args, **kwargs)

    def __getitem__(self, k, evaluate=None):
        if (
            k not in self._map
            and self._dynamic
            and k != "_ipython_canary_method_should_not_exist_"
        ):
            # automatically extend to new DotMap
            self[k] = self.__class__()

        var = self._map[k]

        # evaluate
        if evaluate is None:
            evaluate = self._evaluate

        if evaluate:
            if isinstance(var, ConfigMethod):
                var = var.evaluate()

        return var

    def __setattr__(self, k, v):
        if k in {
            "_map",
            "_dynamic",
            "_evaluate",
            "_evaluated",
            "_ipython_canary_method_should_not_exist_",
            "get_versioning",
            "get_deep_diff",
        }:
            super(DotMap, self).__setattr__(k, v)
        else:
            self[k] = v

    def __getattr__(self, k):
        if k in {
            "_map",
            "_dynamic",
            "_evaluate",
            "_evaluated",
            "_ipython_canary_method_should_not_exist_",
            "get_versioning",
            "get_deep_diff",
        }:
            return super(DotMap, self).__getattr__(k)

        try:
            v = super(self.__class__, self).__getattribute__(k)
            return v
        except AttributeError:
            pass

        return self[k]


_reserved_keys = ["_map", "_dynamic", "_evaluate", "_evaluated"]
_used_keys = [
    "toDict",
    "get_deep_diff",
    "get_versioning",
    "pprint",
    "items",
    "next",
    "empty",
    "values",
    "parseOther",
    "clear",
    "copy",
    "get",
    "has_key",
    "keys",
    "pop",
    "popitem",
    "setdefault",
    "update",
    "fromkeys",
    "bannerStr",
    "_getSubMapStr",
    "_getSubMapDotList",
    "_getValueStr",
    "_getListStr",
]
