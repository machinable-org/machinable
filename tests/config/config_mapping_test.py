# This file contains modified 3rd party source code from
# https://github.com/drgrib/ConfigMap/blob/master/ConfigMap/test.py
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

import unittest

from machinable.config.mapping import ConfigMap


def test_config_mapping_evaluate():
    m = ConfigMap(
        {
            "test": 1,
            "_hidden": "invisible",
            "_mixin_": True,
            "~version": {"should be": "hidden"},
        }
    ).toDict(with_hidden=False)

    assert "_hidden" not in m
    assert m["_mixin_"]

    print(m)


def test_config_mapping_versions():
    m = ConfigMap(
        {
            "test": 1,
            "~a": {"a": "1"},
            "~b": {"b": "1", "~d": {"d": 1}},
            "~c": {"c": "1"},
        }
    )

    v = m.get_versioning()
    assert len(v) == 3
    assert "a" in v
    assert m["~b"].get_versioning()[0] == "d"


def test_config_mapping_diff():
    m = ConfigMap({"test": 1, "~a": {"a": "1"},})
    assert (
        "root['test']"
        in m.get_deep_diff({"test": 2, "~a": {"a": "1"},})["values_changed"]
    )


class TestReadme(unittest.TestCase):
    def test_basic_use(self):
        m = ConfigMap()
        self.assertIsInstance(m, ConfigMap)
        m.name = "Joe"
        self.assertEqual(m.name, "Joe")
        self.assertEqual("Hello " + m.name, "Hello Joe")
        self.assertIsInstance(m, dict)
        self.assertTrue(issubclass(m.__class__, dict))
        self.assertEqual(m["name"], "Joe")
        m.name += " Smith"
        m["name"] += " Jr"
        self.assertEqual(m.name, "Joe Smith Jr")

    def test_automatic_hierarchy(self):
        m = ConfigMap()
        m.people.steve.age = 31
        self.assertEqual(m.people.steve.age, 31)

    def test_key_init(self):
        m = ConfigMap(a=1, b=2)
        self.assertEqual(m.a, 1)
        self.assertEqual(m.b, 2)

    def test_dict_conversion(self):
        d = {"a": 1, "b": 2, "c": {"d": 3, "e": 4}}
        m = ConfigMap(d)
        self.assertEqual(m.a, 1)
        self.assertEqual(m.b, 2)
        d2 = m.toDict()
        self.assertIsInstance(d2, dict)
        self.assertNotIsInstance(d2, ConfigMap)
        self.assertEqual(len(d2), 3)
        self.assertEqual(d2["a"], 1)
        self.assertEqual(d2["b"], 2)
        self.assertNotIsInstance(d2["c"], ConfigMap)
        self.assertEqual(len(d2["c"]), 2)
        self.assertEqual(d2["c"]["d"], 3)
        self.assertEqual(d2["c"]["e"], 4)

    def test_ordered_iteration(self):
        m = ConfigMap()
        m.people.john.age = 32
        m.people.john.job = "programmer"
        m.people.mary.age = 24
        m.people.mary.job = "designer"
        m.people.dave.age = 55
        m.people.dave.job = "manager"
        expected = [
            ("john", 32, "programmer"),
            ("mary", 24, "designer"),
            ("dave", 55, "manager"),
        ]
        for i, (k, v) in enumerate(m.people.items()):
            self.assertEqual(expected[i][0], k)
            self.assertEqual(expected[i][1], v.age)
            self.assertEqual(expected[i][2], v.job)


class TestBasic(unittest.TestCase):
    def setUp(self):
        self.d = {"a": 1, "b": 2, "subD": {"c": 3, "d": 4}}

    def test_dict_init(self):
        m = ConfigMap(self.d)
        self.assertIsInstance(m, ConfigMap)
        self.assertEqual(m.a, 1)
        self.assertEqual(m.b, 2)
        self.assertIsInstance(m.subD, ConfigMap)
        self.assertEqual(m.subD.c, 3)
        self.assertEqual(m.subD.d, 4)

    def test_copy(self):
        m = ConfigMap(self.d)
        dm_copy = m.copy()
        self.assertIsInstance(dm_copy, ConfigMap)
        self.assertEqual(dm_copy.a, 1)
        self.assertEqual(dm_copy.b, 2)
        self.assertIsInstance(dm_copy.subD, ConfigMap)
        self.assertEqual(dm_copy.subD.c, 3)
        self.assertEqual(dm_copy.subD.d, 4)

    def test_fromkeys(self):
        m = ConfigMap.fromkeys([1, 2, 3], "a")
        self.assertEqual(len(m), 3)
        self.assertEqual(m[1], "a")
        self.assertEqual(m[2], "a")
        self.assertEqual(m[3], "a")

    def test_dict_functionality(self):
        m = ConfigMap(self.d)
        self.assertEqual(m.get("a"), 1)
        self.assertEqual(m.get("f", 33), 33)
        self.assertIsNone(m.get("f"))
        m.update([("rat", 5), ("bum", 4)], dog=7, cat=9)
        self.assertEqual(m.rat, 5)
        self.assertEqual(m.bum, 4)
        self.assertEqual(m.dog, 7)
        self.assertEqual(m.cat, 9)
        m.update({"lol": 1, "ba": 2})
        self.assertEqual(m.lol, 1)
        self.assertEqual(m.ba, 2)
        self.assertTrue("a" in m)
        self.assertFalse("c" in m)
        self.assertTrue("c" in m.subD)
        self.assertTrue(len(m.subD), 2)
        del m.subD.c
        self.assertFalse("c" in m.subD)
        self.assertTrue(len(m.subD), 1)

    def test_list_comprehension(self):
        parentDict = {
            "name": "Father1",
            "offspring": [{"name": "Child1"}, {"name": "Child2"}, {"name": "Child3"},],
        }
        parent = ConfigMap(parentDict)
        ordered_names = ["Child1", "Child2", "Child3"]
        comp = [x.name for x in parent.offspring]
        self.assertEqual(ordered_names, comp)


class TestPickle(unittest.TestCase):
    def setUp(self):
        self.d = {"a": 1, "b": 2, "subD": {"c": 3, "d": 4}}

    def test(self):
        import pickle

        pm = ConfigMap(self.d)
        s = pickle.dumps(pm)
        m = pickle.loads(s)
        self.assertIsInstance(m, ConfigMap)
        self.assertEqual(m.a, 1)
        self.assertEqual(m.b, 2)
        self.assertIsInstance(m.subD, ConfigMap)
        self.assertEqual(m.subD.c, 3)
        self.assertEqual(m.subD.d, 4)


class TestEmpty(unittest.TestCase):
    def test(self):
        m = ConfigMap()
        self.assertTrue(m.empty())
        m.a = 1
        self.assertFalse(m.empty())
        self.assertTrue(m.b.empty())
        self.assertIsInstance(m.b, ConfigMap)


class TestDynamic(unittest.TestCase):
    def test(self):
        m = ConfigMap()
        m.still.works
        m.sub.still.works
        nonDynamic = ConfigMap(_dynamic=False)

        def assignNonDynamic():
            nonDynamic.no

        self.assertRaises(KeyError, assignNonDynamic)

        nonDynamicWithInit = ConfigMap(m, _dynamic=False)
        nonDynamicWithInit.still.works
        nonDynamicWithInit.sub.still.works

        def assignNonDynamicWithInit():
            nonDynamicWithInit.no.creation

        self.assertRaises(KeyError, assignNonDynamicWithInit)


class TestRecursive(unittest.TestCase):
    def test(self):
        m = ConfigMap()
        m.a = 5
        m_id = id(m)
        m.recursive = m
        self.assertEqual(id(m.recursive.recursive.recursive), m_id)
        outStr = str(m)
        self.assertIn("""a=5""", outStr)
        self.assertIn("""recursive=ConfigMap(...)""", outStr)
        d = m.toDict()
        d_id = id(d)
        d["a"] = 5
        d["recursive"] = d
        d["recursive"]["recursive"]["recursive"]
        self.assertEqual(id(d["recursive"]["recursive"]["recursive"]), d_id)
        outStr = str(d)
        self.assertIn("""'a': 5""", outStr)
        self.assertIn("""recursive': {...}""", outStr)
        m2 = ConfigMap(d)
        m2_id = id(m2)
        self.assertEqual(id(m2.recursive.recursive.recursive), m2_id)
        outStr2 = str(m2)
        self.assertIn("""a=5""", outStr2)
        self.assertIn("""recursive=ConfigMap(...)""", outStr2)


class Testkwarg(unittest.TestCase):
    def test(self):
        a = {"1": "a", "2": "b"}
        b = ConfigMap(a, _dynamic=False)

        def capture(**kwargs):
            return kwargs

        self.assertEqual(a, capture(**b.toDict()))


class TestDeepCopy(unittest.TestCase):
    def test(self):
        import copy

        original = ConfigMap()
        original.a = 1
        original.b = 3
        shallowCopy = original
        deepCopy = copy.deepcopy(original)
        self.assertEqual(original, shallowCopy)
        self.assertEqual(id(original), id(shallowCopy))
        self.assertEqual(original, deepCopy)
        self.assertNotEqual(id(original), id(deepCopy))
        original.a = 2
        self.assertEqual(original, shallowCopy)
        self.assertNotEqual(original, deepCopy)

    def test_order_preserved(self):
        import copy

        original = ConfigMap()
        original.a = 1
        original.b = 2
        original.c = 3
        deepCopy = copy.deepcopy(original)
        orderedPairs = []
        for k, v in original.iteritems():
            orderedPairs.append((k, v))
        for i, (k, v) in enumerate(deepCopy.iteritems()):
            self.assertEqual(k, orderedPairs[i][0])
            self.assertEqual(v, orderedPairs[i][1])


class TestConfigMapTupleToDict(unittest.TestCase):
    def test(self):
        m = ConfigMap({"a": 1, "b": (11, 22, ConfigMap({"c": 3}))})
        d = m.toDict()
        self.assertEqual(d, {"a": 1, "b": (11, 22, {"c": 3})})


class TestOrderedDictInit(unittest.TestCase):
    def test(self):
        from collections import OrderedDict

        o = OrderedDict([("a", 1), ("b", 2), ("c", [OrderedDict([("d", 3)])])])
        m = ConfigMap(o)
        self.assertIsInstance(m, ConfigMap)
        self.assertIsInstance(m.c[0], ConfigMap)


class TestEmptyAdd(unittest.TestCase):
    def test_base(self):
        m = ConfigMap()
        for i in range(7):
            m.counter += 1
        self.assertNotIsInstance(m.counter, ConfigMap)
        self.assertIsInstance(m.counter, int)
        self.assertEqual(m.counter, 7)

    def test_various(self):
        m = ConfigMap()
        m.a.label = "test"
        m.a.counter += 2
        self.assertIsInstance(m.a, ConfigMap)
        self.assertEqual(m.a.label, "test")
        self.assertNotIsInstance(m.a.counter, ConfigMap)
        self.assertIsInstance(m.a.counter, int)
        self.assertEqual(m.a.counter, 2)
        m.a.counter += 1
        self.assertEqual(m.a.counter, 3)

    def test_proposal(self):
        my_counters = ConfigMap()
        pages = [
            "once upon a time",
            "there was like this super awesome prince",
            "and there was this super rad princess",
            "and they had a mutually respectful, egalitarian relationship",
            "the end",
        ]
        for stuff in pages:
            my_counters.page += 1
        self.assertIsInstance(my_counters, ConfigMap)
        self.assertNotIsInstance(my_counters.page, ConfigMap)
        self.assertIsInstance(my_counters.page, int)
        self.assertEqual(my_counters.page, 5)

    def test_string_addition(self):
        m = ConfigMap()
        m.quote += "lions"
        m.quote += " and tigers"
        m.quote += " and bears"
        m.quote += ", oh my"
        self.assertEqual(m.quote, "lions and tigers and bears, oh my")

    def test_strange_addition(self):
        m = ConfigMap()
        m += "I'm a string now"
        self.assertIsInstance(m, str)
        self.assertNotIsInstance(m, ConfigMap)
        self.assertEqual(m, "I'm a string now")
        m2 = ConfigMap() + "I'll replace that ConfigMap"
        self.assertEqual(m2, "I'll replace that ConfigMap")

    def test_protected_hierarchy(self):
        m = ConfigMap()
        m.protected_parent.key = "value"

        def protectedFromAddition():
            m.protected_parent += 1

        self.assertRaises(TypeError, protectedFromAddition)

    def test_type_error_raised(self):
        m = ConfigMap()

        def badAddition():
            m.a += 1
            m.a += " and tigers"

        self.assertRaises(TypeError, badAddition)


# Test classes for SubclassTestCase below

# class that overrides __getitem__
class MyConfigMap(ConfigMap):
    def __getitem__(self, k):
        return super(MyConfigMap, self).__getitem__(k)


# subclass with existing property
class PropertyConfigMap(MyConfigMap):
    def __init__(self, *args, **kwargs):
        super(MyConfigMap, self).__init__(*args, **kwargs)
        self._myprop = None

    @property
    def my_prop(self):
        if not self._myprop:
            self._myprop = PropertyConfigMap({"nested_prop": 123})
        return self._myprop


class SubclassTestCase(unittest.TestCase):
    def test_nested_subclass(self):
        my = MyConfigMap()
        my.x.y.z = 123
        self.assertEqual(my.x.y.z, 123)
        self.assertIsInstance(my.x, MyConfigMap)
        self.assertIsInstance(my.x.y, MyConfigMap)

    def test_subclass_with_property(self):
        p = PropertyConfigMap()
        self.assertIsInstance(p.my_prop, PropertyConfigMap)
        self.assertEqual(p.my_prop.nested_prop, 123)
        p.my_prop.second.third = 456
        self.assertIsInstance(p.my_prop.second, PropertyConfigMap)
        self.assertEqual(p.my_prop.second.third, 456)
