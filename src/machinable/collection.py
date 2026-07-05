"""Collections: ordered containers of live interfaces and executions."""

# This file contains modified 3rd party source code from
# https://github.com/sdispater/backpack/blob/master/backpack/collections/base_collection.py.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file
# at the root of this repository.

from functools import reduce
from json import dumps
from pprint import pprint
from typing import TYPE_CHECKING, Any, Union

from machinable.types import VersionType

long = int
unicode = str
basestring = str

if TYPE_CHECKING:
    from machinable.interface import Interface


def _get_value(val):
    if callable(val):
        return val()

    return val


def data_get(target, key, default=None):
    """Get an item from a list, a dict or an object using "dot" notation.

    :param target: The target element
    :type target: list or dict or object

    :param key: The key to get
    :type key: string or list

    :param default: The default value
    :type default: mixed

    :rtype: mixed
    """
    if key is None:
        return target

    if not isinstance(key, list):
        key = key.split(".")

    for segment in key:
        if isinstance(target, list | tuple):
            try:
                target = target[segment]
            except IndexError:
                return _get_value(default)
        elif isinstance(target, dict):
            try:
                target = target[segment]
            except IndexError:
                return _get_value(default)
        else:
            try:
                target = target[segment]
            except (IndexError, KeyError, TypeError):
                try:
                    target = getattr(target, segment)
                except AttributeError:
                    return _get_value(default)

    return target


class Collection:
    """Ordered container of live items with filter/map/reduce-style helpers."""

    def __init__(self, items=None):
        """Creates a new Collection.

        # Arguments
        items: ``list``|``Collection``|``map`` of items to collect
        """
        if items is None:
            items = []
        else:
            items = self._get_items(items)

        self._items = items

    @property
    def items(self):
        """Items of the collection."""
        return self._items

    @classmethod
    def make(cls, items=None):
        """Create a new Collection instance if the value isn't one already.

        # Arguments
        items: ``list``|``Collection``|``map`` of items to collect
        """
        if isinstance(items, cls):
            return items

        return cls(items)

    def all(self):
        """Get all of the items in the collection.

        Returns the underlying list represented by the
        collection

        ``` python
        Collection([1, 2, 3]).all()

        # [1, 2, 3]
        ```
        """
        return self.items

    def count(self):
        """Returns the total number of items in the collection.

        ``` python
        collection = Collection([1, 2, 3, 4])

        collection.count()

        # 4
        ```

        The `len` function can also be used:

        ``` python
        len(collection)

        # 4
        ```
        """
        return len(self._items)

    def contains(self, key, value=None):
        """Determines if an element is in the collection.

        # Arguments
        key: ``Integer``|``String``|``callable`` The element
        value: The value of the element

        ``` python
        collection = Collection(['foo', 'bar'])

        collection.contains('foo')

        # True
        ```

        You can also use the `in` keyword:

        ``` python
        'foo' in collection

        # True
        ```

        You can also pass a key / value pair to the `contains` method, which
        will determine if the given pair exists in the collection:

        ``` python
        collection = Collection([
            {'name': 'John', 'id': 1},
            {'name': 'Jane', 'id': 2}
        ])

        collection.contains('name', 'Simon')

        # False
        ```

        Finally, you may also pass a callback to the `contains` method to
        perform your own truth test:

        ``` python
        collection = Collection([1, 2, 3, 4, 5])

        collection.contains(lambda item: item > 5)

        # False
        ```
        """
        if value is not None:
            return self.contains(lambda x: data_get(x, key) == value)

        if self._use_as_callable(key):
            return self.first(key) is not None

        return key in self.items

    def __contains__(self, item):
        return self.contains(item)

    def each(self, callback):
        """Iterates over the items in the collection and passes each item.

        to a given callback

        # Arguments
        callback: ``callable`` The callback to execute

        ``` python
        collection = Collection([1, 2, 3])
        collection.each(lambda x: x + 3)
        ```

        Return `False` from your callback to break out of the loop:

        ``` python
        observations.each(lambda data: data.save() if data.name == 'mnist' else False)
        ```

        ::: tip
        It only applies the callback but does not modify the collection's items.
        Use the [transform()](#transform) method to
        modify the collection.
        :::
        """
        items = self.items

        for item in items:
            if callback(item) is False:
                break

        return self

    def filter(self, callback=None):
        """Filters the collection by a given callback, keeping only those items.

        that pass a given truth test

        # Arguments
        callback: ``callable``|``None`` The filter callback

        ``` python
        collection = Collection([1, 2, 3, 4])

        filtered = collection.filter(lambda item: item > 2)

        filtered.all()

        # [3, 4]
        ```
        """
        if callback:
            return self.__class__(list(filter(callback, self.items)))

        return self.__class__(list(filter(None, self.items)))

    def first(self, callback=None, default=None):
        """Returns the first element in the collection that passes a given truth test.

        # Arguments
        callback: Optional callable truth condition to find first element
        default: A default value

        ``` python
        collection = Collection([1, 2, 3, 4])

        collection.first(lambda item: item > 2)

        # 3
        ```

        You can also call the `first` method with no arguments to get the first
        element in the collection. If the collection is empty, `None` is
        returned:

        ``` python
        collection.first()

        # 1
        ```
        """
        if callback is not None:
            for val in self.items:
                if callback(val):
                    return val

            return _get_value(default)

        if len(self.items) > 0:
            return self.items[0]
        else:
            return default

    def last(self, callback=None, default=None):
        """Returns the last element in the collection that passes a given truth test.

        # Arguments
        callback: Optional ``callable`` truth condition
        default: The default value

        ``` python
        collection = Collection([1, 2, 3, 4])

        last = collection.last(lambda item: item < 3)

        # 2
        ```

        You can also call the `last` method with no arguments to get the last
        element in the collection. If the collection is empty, `None` is
        returned:

        ``` python
        collection.last()

        # 4
        ```
        """
        if callback is not None:
            for val in reversed(self.items):
                if callback(val):
                    return val

            return _get_value(default)

        if len(self.items) > 0:
            return self.items[-1]
        else:
            return default

    def map(self, callback):
        """Iterates through the collection, passing each value to a callback.

        The callback is free to modify the item and return it, thus forming
        a new collection of modified items

        # Arguments
        callback: The map function

        ``` python
        collection = Collection([1, 2, 3, 4])

        multiplied = collection.map(lambda item: item * 2)

        multiplied.all()

        # [2, 4, 6, 8]
        ```

        ::: warning
        Like most other collection methods, `map` returns a new `Collection`
        instance; it does not modify the collection it is called on. If you want
        to transform the original collection, use the [transform](#transform)
        method.
        :::
        """
        return self.__class__(list(map(callback, self.items)))

    def append(self, value):
        """Add an item onto the end of the collection.

        # Arguments
        value: The value to push

        ``` python
        collection = Collection([1, 2, 3, 4])

        collection.push(5)

        collection.all()

        # [1, 2, 3, 4, 5]
        ```
        """
        self.items.append(value)

        return self

    def reduce(self, callback, initial=None):
        """Reduces the collection to a single value, passing the result of.

        each iteration into the subsequent iteration

        # Arguments
        callback: The callback
        initial: The initial value

        ``` python
        collection = Collection([1, 2, 3])

        collection.reduce(lambda result, item: (result or 0) + item)

        # 6
        ```

        The value for `result` on the first iteration is `None`; however, you
        can specify its initial value by passing a second argument to reduce:

        ``` python
        collection.reduce(lambda result, item: result + item, 4)

        # 10
        ```
        """
        return reduce(callback, self.items, initial)

    def reverse(self):
        """Reverses the order of the collection's items.

        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        reverse = collection.reverse()
        reverse.all()
        # [5, 4, 3, 2, 1]
        ```
        """
        return self.__class__(list(reversed(self.items)))

    def sort(self, callback=None, reverse=False):
        """Sorts the collection.

        # Arguments
        callback: Sort callable
        reverse: True for reversed sort order

        ``` python
        collection = Collection([5, 3, 1, 2, 4])

        sorted = collection.sort()

        sorted.all()

        # [1, 2, 3, 4, 5]
        ```
        """
        items = self.items

        if callback:
            return self.__class__(sorted(items, key=callback, reverse=reverse))
        else:
            return self.__class__(sorted(items, reverse=reverse))

    def unique(self, key=None):
        """Returns all of the unique items in the collection.

        # Arguments
        key: The key to check uniqueness on

        ``` python
        collection = Collection([1, 1, 2, 2, 3, 4, 2])

        unique = collection.unique()

        unique.all()

        # [1, 2, 3, 4]
        ```

        When dealing with dictionaries or objects, you can specify the key used
        to determine uniqueness:

        ``` python
        collection = Collection([
            {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
            {'name': 'iPhone 5', 'brand': 'Apple', 'type': 'phone'},
            {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
            {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
            {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
        ])

        unique = collection.unique('brand')

        unique.all()

        # [
        #     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
        #     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'}
        # ]
        ```

        You can also pass your own callback to determine item uniqueness:

        ``` python
        unique = collection.unique(lambda item: item['brand'] + item['type'])

        unique.all()

        # [
        #     {'name': 'iPhone 6', 'brand': 'Apple', 'type': 'phone'},
        #     {'name': 'Apple Watch', 'brand': 'Apple', 'type': 'watch'},
        #     {'name': 'Galaxy S6', 'brand': 'Samsung', 'type': 'phone'},
        #     {'name': 'Galaxy Gear', 'brand': 'Samsung', 'type': 'watch'}
        # ]
        ```
        """
        if key is None:
            seen = set()
            seen_add = seen.add

            return self.__class__(
                [x for x in self.items if not (x in seen or seen_add(x))]
            )

        key = self._value_retriever(key)

        seen = []
        result = []
        for item in self.items:
            id_ = key(item)
            if id_ not in seen:
                seen.append(id_)
                result.append(item)

        return self.__class__(result)

    def empty(self):
        """Returns `True` if the collection is empty; otherwise, `False` is returned."""
        return self.count() == 0

    def merge(self, items):
        """Merges the given list into the collection.

        # Arguments
        items: The items to merge

        ``` python
        collection = Collection(['Desk', 'Chair'])
        collection.merge(['Bookcase', 'Door'])
        collection.all()
        # ['Desk', 'Chair', 'Bookcase', 'Door']
        ```

        ::: warning
        Unlike most other collection methods, `merge` does not return a new
        modified collection; it modifies the collection it is called on.
        :::
        """
        if isinstance(items, Collection):
            items = items.all()

        if not isinstance(items, list):
            raise ValueError("Unable to merge uncompatible types")

        self._items += items

        return self

    def serialize(self):
        """Converts the collection into a `list`.

        ``` python
        collection = Collection([User.find(1)])
        collection.serialize()
        # [{'id': 1, 'name': 'John'}]
        ```

        ::: warning
        `serialize` also converts all of its nested objects. If you want to get
        the underlying items as is, use the [all](#all) method instead.
        :::
        """

        def _serialize(value):
            if hasattr(value, "serialize"):
                return value.serialize()
            elif hasattr(value, "as_dict"):
                return value.as_dict()
            else:
                return value

        return list(map(_serialize, self.items))

    def pprint(self, pformat="json"):
        """Pretty-print the collection (``json`` or Python ``pprint``)."""
        if pformat == "json":
            print(dumps(self.all(), indent=4, sort_keys=True, default=str))
        else:
            pprint(self.all())

    def as_json(self, **options):
        """Converts the collection into JSON.

        # Arguments
        options: JSON encoding options

        ``` python
        collection = Collection([{'name': 'Desk', 'price': 200}])

        collection.as_json()

        # '[{"name": "Desk", "price": 200}]'
        ```
        """
        return dumps(self.serialize(), **options)

    def as_dataframe(self):
        """Return the collection as a pandas DataFrame (one row per item).

        This is the bridge into pandas and the way to analyze results. ``Collection``
        itself is a minimal handle for selecting/iterating/launching live
        interfaces; all aggregation, grouping, and reshaping is pandas.
        """
        import pandas

        return pandas.DataFrame([item.serialize() for item in self._items])

    def _value_retriever(self, value):
        if self._use_as_callable(value):
            return value

        return lambda item: data_get(item, value)

    def _use_as_callable(self, value):
        return not isinstance(value, basestring) and callable(value)

    def _set_items(self, items):
        self._items = items

    def _get_items(self, items):
        if isinstance(items, list):
            return items
        elif isinstance(items, tuple):
            return list(items)
        elif (
            isinstance(items, Collection)
            or str(type(items))
            == "<class 'backpack.collections.base_collection.BaseCollection'>"
        ):
            return items.all()
        elif hasattr("items", "to_list"):
            return items.to_list()

        return [items]

    def __len__(self):
        return len(self.items)

    def __iter__(self):
        yield from self.items

    def __getitem__(self, item):
        if isinstance(item, slice):
            return self.__class__.make(self.items[item])

        return self.items[item]

    def __setitem__(self, key, value):
        self.items[key] = value

    def __delitem__(self, key):
        del self.items[key]

    def __eq__(self, other):
        if isinstance(other, Collection):
            other = other.items

        return other == self.items

    def __ne__(self, other):
        if isinstance(other, Collection):
            other = other.items

        return other != self.items

    def __str__(self):
        if len(self.items) > 5:
            items = ", ".join([repr(item) for item in self.items[:2]])
            items += " ... "
            items += ", ".join([repr(item) for item in self.items[-2:]])
        else:
            items = ", ".join([repr(item) for item in self.items])
        return f"Collection ({len(self.items)}) <{items}>"

    def __repr__(self):
        return self.__str__()


def collect(elements):
    """Wrap ``elements`` in a :class:`Collection`."""
    return Collection(elements)


class InterfaceCollection(Collection):
    """A collection of interfaces."""

    def as_dataframe(self):
        """Flat, queryable DataFrame: one row per interface, config as columns.

        Columns: ``uuid``, ``module``, ``version`` (the compact version list),
        ``cached``, ``label``, ``created_by``, and ``config.<field>`` for each
        resolved config key. The intended analysis surface: round-trip back to
        live interfaces via ``Interface.find_many_by_id(df.uuid)``.
        """
        import pandas
        from omegaconf import OmegaConf

        rows = []
        for item in self._items:
            row = {
                "uuid": item.uuid,
                "module": item.module,
                "version": item.version(),
                "cached": item.cached(),
                "label": item.label,
                "created_by": item.created_by,
            }
            config = item.config
            if config is not None:
                resolved = OmegaConf.to_container(config, resolve=True)
                if isinstance(resolved, dict):
                    for key, value in resolved.items():
                        if not str(key).startswith("_"):
                            row[f"config.{key}"] = value
            rows.append(row)
        return pandas.DataFrame(rows)

    def filter_by_module(self, module):
        """The subset with the given module."""
        return self.filter(lambda x: x.module == module)

    def filter_by_fingerprint(
        self,
        module: str,
        version: VersionType = None,
        **kwargs,
    ):
        """The subset matching the fingerprint of ``module`` + ``version``."""
        from machinable.interface import Interface

        instance = Interface.make(module, version, **kwargs)

        return self.filter(lambda x: x.matches(instance.matching_fingerprint()))

    def singleton(
        self,
        module: str,
        version: VersionType = None,
        **kwargs,
    ) -> Union[Any, "Interface"]:
        """The single matching element, or a fresh instance if none matches."""
        from machinable.interface import Interface

        instance = Interface.make(module, version, **kwargs)
        fingerprint = instance.matching_fingerprint()

        for candidate in self:
            if candidate.matches(fingerprint) and not candidate.hidden():
                return candidate

        return instance

    def __str__(self):
        return f"Interfaces <{len(self.items)}>"

    def launch(self) -> "InterfaceCollection":
        """Executes all interfaces in the collection."""
        for interface in self:
            interface.launch()

        return self


class ExecutionCollection(Collection):
    """A collection of executions."""

    def launch(self) -> "ExecutionCollection":
        """Launch every execution in the collection."""
        for execution in self:
            execution.launch()

        return self

    def filter_by_fingerprint(
        self,
        module: str,
        version: VersionType = None,
        **kwargs,
    ):
        """The subset matching the fingerprint of ``module`` + ``version``."""
        from machinable.interface import Interface

        instance = Interface.make(module, version, **kwargs)

        return self.filter(lambda x: x.matches(instance.matching_fingerprint()))

    def singleton(
        self,
        module: str,
        version: VersionType = None,
        **kwargs,
    ) -> Union[Any, "Interface"]:
        """The single matching element, or a fresh instance if none matches."""
        from machinable.interface import Interface

        instance = Interface.make(module, version, **kwargs)
        fingerprint = instance.matching_fingerprint()

        for candidate in self:
            if candidate.matches(fingerprint) and not candidate.hidden():
                return candidate

        return instance

    def __str__(self):
        return f"Executions <{len(self.items)}>"

    def status(self, status="started"):
        """Filters the collection by a status attribute.

        # Arguments
        status: String, status field: 'started', 'finished', 'alive'
        """
        try:
            return self.filter(lambda item: getattr(item, "is_" + status)())
        except AttributeError as _ex:
            raise ValueError(f"Invalid status field: {status}") from _ex
