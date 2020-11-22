# This file contains modified 3rd party source code from
# https://github.com/sdispater/backpack/blob/master/backpack/collections/base_collection.py.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

import copy
from functools import reduce
from json import dumps
from pprint import pprint

long = int
unicode = str
basestring = str


def _get_value(val):
    if callable(val):
        return val()

    return val


def data_get(target, key, default=None):
    """
    Get an item from a list, a dict or an object using "dot" notation.

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
        if isinstance(target, (list, tuple)):
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
    def __init__(self, items=None):
        """Creates a new Collection

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
        """Items of the collection"""
        return self._items

    @classmethod
    def make(cls, items=None):
        """Create a new Collection instance if the value isn't one already

        # Arguments
        items: ``list``|``Collection``|``map`` of items to collect
        """
        if isinstance(items, Collection):
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

    def avg(self, key=None):
        """Get the average value of a given key.

        # Arguments
        key: The key to get the average for

        ``` python
        Collection([1, 2, 3, 4, 5]).avg()
        # 3
        ```

        If the collection contains nested objects or dictionaries, you must pass
        a key to use for determining which values to calculate the average:

        ``` python
        collection = Collection([
            {'name': 'JavaScript: The Good Parts', 'pages': 176},
            {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
        ])
        # 636
        collection.avg('pages')
        ```
        """
        count = self.count()

        if count:
            return self.sum(key) / count

    def chunk(self, size):
        """Chunk the underlying collection.

        The `chunk` method breaks the collection into multiple, smaller
        collections of a given size:

        ``` python
        collection = Collection([1, 2, 3, 4, 5, 6, 7])

        chunks = collection.chunk(4)

        chunks.serialize()

        # [[1, 2, 3, 4], [5, 6, 7]]
        ```

        # Arguments
        size: The chunk size
        """
        chunks = self._chunk(size)

        return Collection(list(map(Collection, chunks)))

    def _chunk(self, size):
        items = self.items
        return [items[i : i + size] for i in range(0, len(items), size)]

    def count(self):
        """Returns the total number of items in the collection:

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
        """Determines if an element is in the collection

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

    def collapse(self):
        """Collapses a collection of lists into a flat collection

        ``` python
        collection = Collection([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        collapsed = collection.collapse()
        collapsed.all()
        # [1, 2, 3, 4, 5, 6, 7, 8, 9]
        ```
        """
        results = []

        items = self.items

        for values in items:
            if isinstance(values, Collection):
                values = values.all()

            results += values

        return Collection(results)

    def diff(self, items):
        """Compares the collection against another collection, a `list` or a `dict`

        # Arguments
        items: The items to diff with

        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        diff = collection.diff([2, 4, 6, 8])
        diff.all()
        # [1, 3, 5]
        ```
        """
        return Collection([i for i in self.items if i not in items])

    def each(self, callback):
        """Iterates over the items in the collection and passes each item to a given callback

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

    def every(self, step, offset=0):
        """Create a new collection consisting of every n-th element.

        # Arguments
        step: ``int`` The step size
        offset: ``int`` The start offset

        ``` python
        collection = Collection(['a', 'b', 'c', 'd', 'e', 'f'])

        collection.every(4).all()

        # ['a', 'e']
        ```

        You can optionally pass the offset as the second argument:

        ``` python
        collection.every(4, 1).all()

        # ['b', 'f']
        ```
        """
        new = []

        for position, item in enumerate(self.items):
            if position % step == offset:
                new.append(item)

        return Collection(new)

    def without(self, *keys):
        """Get all items except for those with the specified keys.

        # Arguments
        keys: ``tuple`` The keys to remove
        """
        items = copy.copy(self.items)

        keys = reversed(sorted(keys))

        for key in keys:
            del items[key]

        return Collection(items)

    def only(self, *keys):
        """
        Get the items with the specified keys.

        # Arguments
        keys: ``tuple`` The keys to keep
        """
        items = []

        for key, value in enumerate(self.items):
            if key in keys:
                items.append(value)

        return Collection(items)

    def filter(self, callback=None):
        """Filters the collection by a given callback, keeping only those items that pass a given truth test

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
            return Collection(list(filter(callback, self.items)))

        return Collection(list(filter(None, self.items)))

    def where(self, key, value):
        """Filter items by the given key value pair.

        # Arguments
        key: The key to filter by
        value: The value to filter by

        ``` python
        collection = Collection([
            {'name': 'Desk', 'price': 200},
            {'name': 'Chair', 'price': 100},
            {'name': 'Bookcase', 'price': 150},
            {'name': 'Door', 'price': 100},
        ])

        filtered = collection.where('price', 100)

        filtered.all()

        # [
        #     {'name': 'Chair', 'price': 100},
        #     {'name': 'Door', 'price': 100}
        # ]
        ```
        """
        return self.filter(lambda item: data_get(item, key) == value)

    def first(self, callback=None, default=None):
        """Returns the first element in the collection that passes a given truth test

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

    def flatten(self):
        """Flattens a multi-dimensional collection into a single dimension

        ``` python
        collection = Collection([1, 2, [3, 4, 5, {'foo': 'bar'}]])

        flattened = collection.flatten()

        flattened.all()

        # [1, 2, 3, 4, 5, 'bar']
        ```
        """

        def _flatten(d):
            if isinstance(d, dict):
                for v in d.values():
                    for nested_v in _flatten(v):
                        yield nested_v
            elif isinstance(d, list):
                for list_v in d:
                    for nested_v in _flatten(list_v):
                        yield nested_v
            else:
                yield d

        return Collection(list(_flatten(self.items)))

    def forget(self, *keys):
        """Remove an item from the collection by key.

        # Arguments
        keys: The keys to remove

        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        collection.forget(1)
        collection.all()
        # [1, 3, 4, 5]
        ```

        ::: warning
        Unlike most other collection methods, `forget` does not return a new
        modified collection; it modifies the collection it is called on.
        :::
        """
        keys = reversed(sorted(keys))

        for key in keys:
            del self[key]

        return self

    def get(self, key, default=None):
        """Returns the item at a given key. If the key does not exist, `None` is returned

        # Arguments
        key: The index of the element
        default: The default value to return

        ``` python
        collection = Collection([1, 2, 3])
        collection.get(3)
        # None
        ```

        You can optionally pass a default value as the second argument:

        ``` python
        collection = Collection([1, 2, 3])
        collection.get(3, 'default-value')
        # default-value
        ```
        """
        try:
            return self.items[key]
        except IndexError:
            return _get_value(default)

    def implode(self, value, glue=""):
        """Joins the items in a collection. Its arguments depend on the type of items in the collection.

        # Arguments
        value: The value
        glue: The glue

        If the collection contains dictionaries or objects, you must pass the
        key of the attributes you wish to join, and the "glue" string you wish
        to place between the values:

        ``` python
        collection = Collection([
            {'account_id': 1, 'product': 'Desk'},
            {'account_id': 2, 'product': 'Chair'}
        ])

        collection.implode('product', ', ')

        # Desk, Chair
        ```

        If the collection contains simple strings, simply pass the "glue" as the
        only argument to the method:

        ``` python
        collection = Collection(['foo', 'bar', 'baz'])

        collection.implode('-')

        # foo-bar-baz
        ```
        """
        first = self.first()

        if not isinstance(first, basestring):
            return glue.join(self.pluck(value).all())

        return value.join(self.items)

    def last(self, callback=None, default=None):
        """Returns the last element in the collection that passes a given truth test

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

    def pluck(self, value, key=None):
        """Retrieves all of the collection values for a given key

        # Arguments
        value: Value
        key: Optional key

        ``` python
        collection = Collection([
            {'product_id': 1, 'product': 'Desk'},
            {'product_id': 2, 'product': 'Chair'}
        ])

        plucked = collection.pluck('product')

        plucked.all()

        # ['Desk', 'Chair']
        ```

        You can also specify how you wish the resulting collection to be keyed:

        ``` python
        plucked = collection.pluck('name', 'product_id')

        plucked

        # {1: 'Desk', 2: 'Chair'}
        ```
        """
        if self.items is None:
            return Collection([])

        if key:
            return dict(
                map(lambda x: (data_get(x, key), data_get(x, value)), self.items)
            )
        else:
            results = list(map(lambda x: data_get(x, value), self.items))

        return Collection(results)

    def map(self, callback):
        """Iterates through the collection and passes each value to the given callback.
        The callback is free to modify the item and return it, thus forming a new collection of modified items

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
        return Collection(list(map(callback, self.items)))

    def max(self, key=None):
        """Get the max value of a given key.

        # Arguments
        key: The key
        """

        def _max(result, item):
            val = data_get(item, key)

            if result is None or val > result:
                return val

            return result

        return self.reduce(_max)

    def min(self, key=None):
        """Get the min value of a given key.

        key: The key
        """

        def _min(result, item):
            val = data_get(item, key)

            if result is None or val < result:
                return val

            return result

        return self.reduce(_min)

    def pop(self, key=None):
        """Removes and returns the last item from the collection.
        If no index is specified, returns the last item.

        # Arguments
        key: The index of the item to return


        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        collection.pop()
        # 5

        collection.all()
        # [1, 2, 3, 4]
        ```
        """
        if key is None:
            key = -1

        return self.items.pop(key)

    def prepend(self, value):
        """Adds an item to the beginning of the collection

        # Arguments
        value: The value to push

        ``` python
        collection = Collection([1, 2, 3, 4])

        collection.prepend(0)

        collection.all()

        # [0, 1, 2, 3, 4]
        ```
        """
        self.items.insert(0, value)

        return self

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

    def pull(self, key, default=None):
        """Removes and returns an item from the collection by its key

        # Arugments
        key: The key
        default: The default value

        ``` python
        collection = Collection([1, 2, 3, 4])

        collection.pull(1)

        collection.all()

        # [1, 3, 4]
        ```
        """
        val = self.get(key, default)

        self.forget(key)

        return val

    def put(self, key, value):
        """Sets the given key and value in the collection

        # Arguments
        key: The key
        value: The value

        ``` python
        collection = Collection([1, 2, 3, 4])
        collection.put(1, 5)
        collection.all()

        # [1, 5, 3, 4]
        ```

        ::: tip
        It is equivalent to ``collection[1] = 5``
        :::
        """
        self[key] = value

        return self

    def reduce(self, callback, initial=None):
        """Reduces the collection to a single value, passing the result of each iteration into the subsequent iteration

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

    def reject(self, callback):
        """Filters the collection using the given callback. The callback should return `True` for any items it wishes
        to remove from the resulting collection

        # Arguments
        callback: The truth test

        ``` python
        collection = Collection([1, 2, 3, 4])

        filtered = collection.reject(lambda item: item > 2)

        filtered.all()

        # [1, 2]
        ```

        For the inverse of `reject`, see the [filter](#filter) method.
        """
        if self._use_as_callable(callback):
            return self.filter(lambda item: not callback(item))

        return self.filter(lambda item: item != callback)

    def reverse(self):
        """Reverses the order of the collection's items

        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        reverse = collection.reverse()
        reverse.all()
        # [5, 4, 3, 2, 1]
        ```
        """
        return Collection(list(reversed(self.items)))

    def sort(self, callback=None, reverse=False):
        """Sorts the collection

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
            return Collection(sorted(items, key=callback, reverse=reverse))
        else:
            return Collection(sorted(items, reverse=reverse))

    def sum(self, callback=None):
        """Returns the sum of all items in the collection

        callback: The callback

        ``` python
        Collection([1, 2, 3, 4, 5]).sum()

        # 15
        ```

        If the collection contains dictionaries or objects, you must pass a key
        to use for determining which values to sum:

        ``` python
        collection = Collection([
            {'name': 'JavaScript: The Good Parts', 'pages': 176},
            {'name': 'JavaScript: The Defnitive Guide', 'pages': 1096}
        ])

        collection.sum('pages')

        # 1272
        ```

        In addition, you can pass your own callback to determine which values of
        the collection to sum:

        ``` python
        collection = Collection([
            {'name': 'Chair', 'colors': ['Black']},
            {'name': 'Desk', 'colors': ['Black', 'Mahogany']},
            {'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown']}
        ])

        collection.sum(lambda product: len(product['colors']))

        # 6
        ```
        """
        if callback is None:
            return sum(self.items)

        callback = self._value_retriever(callback)

        return self.reduce(lambda result, item: (result or 0) + callback(item))

    def take(self, limit):
        """
        Take the first or last n items.

        # Arguments
        limit: The number of items to take

        ``` python
        collection = Collection([0, 1, 2, 3, 4, 5])
        chunk = collection.take(3)
        chunk.all()
        # [0, 1, 2]
        ```

        You can also pass a negative integer to take the specified amount of
        items from the end of the collection:

        ``` python
        chunk = collection.chunk(-2)
        chunk.all()
        # [4, 5]
        ```
        """
        if limit < 0:
            return self[limit:]

        return self[:limit]

    def unique(self, key=None):
        """Returns all of the unique items in the collection

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

            return Collection([x for x in self.items if not (x in seen or seen_add(x))])

        key = self._value_retriever(key)

        exists = []

        def _check(item):
            id_ = key(item)
            if id_ in exists:
                return True

            exists.append(id_)

        return self.reject(_check)

    def zip(self, *items):
        """Merges together the values of the given list with the values of the collection at the corresponding index

        # Argument
        *items: Zip items

        ``` python
        collection = Collection(['Chair', 'Desk'])
        zipped = collection.zip([100, 200])
        zipped.all()
        # [('Chair', 100), ('Desk', 200)]
        ```
        """
        return Collection(list(zip(self.items, *items)))

    def empty(self):
        """Returns `True` if the collection is empty; otherwise, `False` is returned
        """
        return self.count() == 0

    def merge(self, items):
        """Merges the given list into the collection

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

    def transform(self, callback):
        """Transform each item in the collection using a callback.

        Iterates over the collection and calls the given callback with each item in the collection.
         The items in the collection will be replaced by the values returned by the callback.

        # Arguments
        callback: The callback

        ``` python
        collection = Collection([1, 2, 3, 4, 5])
        collection.transform(lambda item: item * 2)
        collection.all()

        # [2, 4, 6, 8, 10]
        ```

        ::: warning
        Unlike most other collection methods, `transform` modifies the
        collection itself. If you wish to create a new collection instead, use
        the [map](#map) method.
        :::
        """
        self._items = self.map(callback).all()

        return self

    def serialize(self):
        """Converts the collection into a `list`

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
            elif hasattr(value, "toDict"):
                return value.toDict()
            else:
                return value

        return list(map(_serialize, self.items))

    def pprint(self, pformat="json"):
        if pformat == "json":
            print(dumps(self.all(), indent=4, sort_keys=True, default=str))
        else:
            pprint(self.all())

    def as_json(self, **options):
        """Converts the collection into JSON

        # Arguments
        options: JSON encoding options

        ``` python
        collection = Collection([{'name': 'Desk', 'price': 200}])

        collection.to_json()

        # '[{"name": "Desk", "price": 200}]'
        ```
        """
        return dumps(self.serialize(), **options)

    def as_numpy(self):
        """Converts the collection into a numpy array
        """
        import numpy as np

        return np.array(self.items)

    def as_dataframe(self):
        """Returns collection as Pandas dataframe
        """
        data = {k: [] for k in self._items[0].serialize().keys()}
        for item in self._items:
            for k, v in item.serialize().items():
                data[k].append(v)
        import pandas

        return pandas.DataFrame.from_dict(data)

    def as_table(self, mode="html", headers=(), **kwargs):
        """Converts the collection into a table

        # Arguments
        mode: String 'html' or any other mode of the tabulate package
        headers: Optional header row
        **kwargs: Options to pass to tabulate
        """
        if len(self) == 0:
            return ""

        try:
            iter(self.first())
        except TypeError:
            raise ValueError("Collection items are not iterable to form columns")

        try:
            from tabulate import tabulate

            return tabulate(self.items, headers=headers, tablefmt=mode, **kwargs)
        except ImportError:
            if mode != "html":
                raise ValueError(
                    "The tabulate package is required to render non-html tables"
                )

            return "<table><tr>{}</tr></table>".format(
                "</tr><tr>".join(
                    "<td>{}</td>".format("</td><td>".join(str(_) for _ in row))
                    for row in self
                )
            )

    def pluck_or_none(self, value, key=None, none=None):
        """Pluck method that returns None if key is not present

        # Arguments
        value: Value
        key: Key
        none: Return value if key is not present
        """
        try:
            return self.pluck(value, key)
        except KeyError:
            return Collection([none] * len(self))

    def pluck_or_nan(self, value, key=None):
        """Pluck method that returns NaNs if key is not present

        # Arguments
        value: Value
        key: Key
        """
        return self.pluck_or_none(value, key, none=float("nan"))

    def section(self, of, reduce=None):
        """Performs horizontal reduce through collection

        # Arguments
        of: String|``Callable`` Selector of reduce values
        reduce: Optional ``callable`` reduce method
        """
        if isinstance(of, str):
            field = of

            def of(x):
                return x.records.pluck(field)

        if not callable(reduce):

            def reduce(x):
                return x

        selection = self.map(of)

        if len(self) == 1:
            return selection

        try:
            rows = min([len(e) for e in selection])
        except TypeError:
            return selection

        section = [
            reduce([element[row] for element in selection]) for row in range(rows)
        ]

        return Collection(section)

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
        for item in self.items:
            yield item

    def __getitem__(self, item):
        if isinstance(item, slice):
            return Collection.make(self.items[item])

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
    return Collection(elements)
