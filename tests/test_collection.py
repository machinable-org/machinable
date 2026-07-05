# This file contains modified 3rd party source code from
# https://github.com/sdispater/backpack/blob/master/tests/collections/test_collection.py
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file
# at the root of this repository.

from unittest import TestCase

from pydantic import BaseModel

from machinable.collection import Collection, ExecutionCollection, collect
from machinable.execution import Execution
from machinable.project import Project


def test_collect():
    assert isinstance(collect([1, 2]), Collection)


class Dummy(Execution):
    class Config(BaseModel):
        m: int = -1


def test_element_collection(tmp_storage):
    with Project("./tests/samples/project"):
        collection = Execution.collect([Dummy({"m": i % 2}) for i in range(5)])
        for i, e in enumerate(collection):
            e.save_file("i", i)
        assert isinstance(collection, ExecutionCollection)

        collection.launch()
        assert all(collection.map(lambda x: x.execution.is_finished()))

        m = "tests.test_collection"
        assert len(collection.filter_by_fingerprint(m)) == 0
        assert len(collection.filter_by_fingerprint(m, {"m": 0})) == 3
        assert len(collection.filter_by_fingerprint(m, {"m": 1})) == 2

        assert collection.singleton(m, {"m": 1}).config.m == 1

        collection = Execution.collect([e.execution for e in collection])

        assert len(collection.status("finished")) == 5
        assert len(collection.status("active")) == 0
        assert len(collection.status("started")) == 5
        assert len(collection.status("incomplete")) == 0
        assert len(collection.status("started").status("active")) == 0


def test_interface_collection_as_dataframe(tmp_storage):
    import pytest

    pd = pytest.importorskip("pandas")

    from machinable import Interface

    with Project("./tests/samples/project"):
        a = Interface.make("view", {"duration": 1}).materialize()
        b = Interface.make("view", {"duration": 2}).materialize()
        df = Interface.collect([a, b]).as_dataframe()

        assert isinstance(df, pd.DataFrame)
        # flat, queryable columns — config flattened to config.<field>
        assert {"uuid", "module", "version", "cached", "config.duration"}.issubset(
            df.columns
        )
        assert sorted(df["config.duration"].tolist()) == [1, 2]
        # round-trip back to live interfaces via uuid
        ids = df.query("`config.duration` == 2").uuid.tolist()
        restored = Interface.find_many_by_id(ids)
        assert len(restored) == 1 and restored.first().uuid == b.uuid


class CollectionTestCase(TestCase):
    """The minimal live-handle API. Analytics live in pandas via as_dataframe()."""

    def test_first_returns_first_item_in_collection(self):
        c = Collection(["foo", "bar"])
        self.assertEqual("foo", c.first())
        self.assertEqual("bar", c.first(lambda x: x == "bar"))

    def test_last_returns_last_item_in_collection(self):
        c = Collection(["foo", "bar"])
        self.assertEqual("bar", c.last())

    def test_empty_collection_is_empty(self):
        self.assertTrue(Collection().empty())
        self.assertTrue(Collection([]).empty())
        self.assertFalse(Collection([1]).empty())

    def test_collection_is_constructed(self):
        self.assertEqual(["foo"], Collection("foo").all())
        self.assertEqual([2], Collection(2).all())
        self.assertEqual([False], Collection(False).all())
        self.assertEqual([], Collection(None).all())
        self.assertEqual([], Collection().all())

    def test_offset_access(self):
        c = Collection(["foo", "bar"])
        self.assertEqual("bar", c[1])
        c[1] = "baz"
        self.assertEqual("baz", c[1])
        del c[0]
        self.assertEqual("baz", c[0])

    def test_contains(self):
        c = Collection([1, 3, 5])
        self.assertTrue(c.contains(1))
        self.assertFalse(c.contains(2))
        self.assertTrue(c.contains(lambda x: x < 5))
        self.assertIn(3, c)

    def test_countable(self):
        c = Collection(["foo", "bar"])
        self.assertEqual(2, c.count())
        self.assertEqual(2, len(c))

    def test_each(self):
        original = ["foo", "bar", "baz"]
        c = Collection(original)
        result = []
        c.each(lambda x: result.append(x))
        self.assertEqual(result, original)
        self.assertEqual(original, c.all())

    def test_filter(self):
        c = Collection([{"id": 1}, {"id": 2}])
        self.assertEqual([{"id": 2}], c.filter(lambda item: item["id"] == 2).all())
        self.assertEqual(["hello"], Collection(["", "hello", ""]).filter().all())

    def test_map(self):
        c = Collection([1, 2, 3, 4, 5])
        self.assertEqual([3, 4, 5, 6, 7], c.map(lambda x: x + 2).all())

    def test_reduce(self):
        c = Collection([1, 2, 3, 4])
        self.assertEqual(10, c.reduce(lambda acc, x: (acc or 0) + x))

    def test_merge(self):
        c = Collection([1, 2, 3])
        c.merge([4, 5, 6])
        self.assertEqual([1, 2, 3, 4, 5, 6], c.all())

    def test_append(self):
        c = Collection([3, 4, 5])
        c.append(6)
        self.assertEqual([3, 4, 5, 6], c.all())

    def test_reverse(self):
        c = Collection([1, 2, 3, 4])
        self.assertEqual([4, 3, 2, 1], c.reverse().all())

    def test_sort(self):
        c = Collection([5, 3, 1, 2, 4])
        self.assertEqual([1, 2, 3, 4, 5], c.sort(lambda x: x).all())

    def test_unique(self):
        self.assertEqual([1, 2, 3], Collection([1, 1, 2, 3, 3]).unique().all())
        c = Collection([{"v": 1}, {"v": 1}, {"v": 2}])
        self.assertEqual([{"v": 1}, {"v": 2}], c.unique(lambda x: x["v"]).all())
