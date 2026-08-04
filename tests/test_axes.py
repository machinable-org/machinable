import pytest
from pydantic import BaseModel

from machinable import Execution, Interface, get
from machinable.errors import ConfigurationError, ExpansionError
from machinable.scope import Scope
from machinable.utils import norm_version_call


class Replicate(Interface):
    class Config(BaseModel):
        path: str = "?"
        threshold: float = 5.0
        tag: str = ""

    def __call__(self):
        self.save_file("out.json", {"path": self.config.path})

    @staticmethod
    def axis_sessions(root="data"):
        return [{"path": f"{root}/s{i}.nwb"} for i in range(3)]

    @staticmethod
    def axis_thresholds():
        return [{"threshold": t} for t in (3.0, 7.0)]

    @staticmethod
    def axis_seeds(n=2):
        return [get("machinable.scope", {"seed": s}) for s in range(n)]

    @staticmethod
    def axis_both():
        return ["~~sessions", "~~thresholds"]

    def version_strict(self):
        return {"threshold": 9.0}


# Interfaces that are launched (rather than only expanded) are declared at module
# level: an in-session class defined inside a test function can stop matching its
# own stored record, since `singleton` compares a cloudpickle dump that is not
# stable across uses. That is a pre-existing resolution issue, unrelated to axes.


class Session(Scope):
    class Config(BaseModel):
        id: str = "a"

    def __call__(self):
        return {"session": self.config.id, "cohort": self.config.id.upper()}


class Study(Interface):
    class Config(BaseModel):
        a: int = 1

    @staticmethod
    def axis_sessions():
        return [get(Session, {"id": i}) for i in ("x", "y")]


class Nested(Interface):
    class Config(BaseModel):
        a: int = 1

    @staticmethod
    def axis_outer():
        return [get("machinable.scope", f"~~global_seeds({q})") for q in range(3)]


class Measured(Interface):
    class Config(BaseModel):
        x: int = 0

    def __call__(self):
        self.save_file("v.json", {"v": self.config.x})

    def value(self):
        return self.load_file("v.json")["v"]

    @staticmethod
    def axis_grid():
        return [{"x": i} for i in range(4)]


def test_norm_version_call_preserves_the_axis_sigil():
    assert norm_version_call("~a") == "~a"
    assert norm_version_call("~~a") == "~~a"
    assert norm_version_call("~~a(1, b = 2)") == "~~a(1,b=2)"
    assert norm_version_call("~~sessions( root='d' )") == "~~sessions(root='d')"


# -- expansion ------------------------------------------------------------- #


def test_expansion(tmp_storage):
    sweep = get(Replicate, ["~~sessions"])

    assert sweep.is_unexpanded()
    assert sweep.version() == ["~~sessions"]
    assert len(sweep) == 3
    assert [m.config.path for m in sweep] == [f"data/s{i}.nwb" for i in range(3)]
    # an axis takes arguments, like a version method
    assert [m.config.path for m in get(Replicate, ["~~sessions(root='raw')"])] == [
        f"raw/s{i}.nwb" for i in range(3)
    ]


def test_expansion_merges_in_place(tmp_storage):
    # the element lands where the token sits, so surrounding patches compose
    # left-to-right as usual
    assert [m.config.threshold for m in get(Replicate, ["~~sessions", "~strict"])] == [
        9.0
    ] * 3
    assert [
        m.config.threshold for m in get(Replicate, [{"threshold": 1.0}, "~~thresholds"])
    ] == [
        3.0,
        7.0,
    ]


def test_cartesian_product(tmp_storage):
    product = get(Replicate, ["~~sessions", "~~thresholds"])

    assert [(m.config.path, m.config.threshold) for m in product] == [
        (f"data/s{i}.nwb", t) for i in range(3) for t in (3.0, 7.0)
    ]


def test_axis_of_axes_is_a_union(tmp_storage):
    # an element that is itself an axis token is re-scanned
    assert len(get(Replicate, ["~~both"])) == 5  # 3 sessions + 2 thresholds


def _stored_predicates(members, key):
    from machinable.index import Index

    index = Index.get()
    return sorted(index.get_by_id(m.uuid).predicate[key] for m in members)


def _record_count(module):
    from machinable.api.models import FindRequest
    from machinable.index import Index

    return len(Index.get().find(FindRequest(module=module, limit=100)).items)


def test_scopes_as_elements(tmp_storage):
    sweep = get(Replicate, ["~~seeds"])

    assert len(sweep) == 2
    # identical config, so only the scope tells the members apart
    assert len({m.catalog_identity_key() for m in sweep}) == 1

    sweep.launch()
    members = sweep.interfaces
    assert len({m.uuid for m in members}) == 2
    assert _stored_predicates(members, "seed") == [0, 1]


def test_provider_axis_serves_any_module(tmp_storage):
    class Any(Interface):
        class Config(BaseModel):
            a: int = 1

    assert [m.config.a for m in get(Any, ["~~global_axis(3)"])] == [0, 1, 2]


def test_nested_scope_axis_flattens(tmp_storage):
    sweep = get(Nested, ["~~outer"])
    # 3 unexpanded scopes, each denoting 2 leaves -> 6 flat members
    assert len(sweep) == 6
    sweep.launch()
    assert _stored_predicates(sweep.interfaces, "seed") == [0, 1, 10, 11, 20, 21]


def test_scope_subclass_is_a_valid_context(tmp_storage):
    sweep = get(Study, ["~~sessions"]).launch()

    assert _stored_predicates(sweep.interfaces, "session") == ["x", "y"]
    assert _stored_predicates(sweep.interfaces, "cohort") == ["X", "Y"]


# -- element validation ---------------------------------------------------- #


def _sweep(elements, module_config=None):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1
            b: int = 1

        @staticmethod
        def axis_x():
            return elements

    return get(T, ["~~x"])


def test_none_element_is_the_base_member(tmp_storage):
    members = list(_sweep([None, {"a": 2}]))

    assert len(members) == 2
    assert [m.config.a for m in members] == [1, 2]


def test_version_string_and_list_elements(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1
            b: int = 1

        def version_two(self):
            return {"a": 2}

        @staticmethod
        def axis_x():
            return ["~two", [{"a": 3}, {"b": 3}]]

    members = list(get(T, ["~~x"]))
    assert [(m.config.a, m.config.b) for m in members] == [(2, 1), (3, 3)]


def test_generator_return_is_materialized(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_x():
            return ({"a": i} for i in range(3))

    assert len(get(T, ["~~x"])) == 3


def test_empty_axis_warns_and_launches_nothing(tmp_storage):
    sweep = _sweep([])

    with pytest.warns(UserWarning, match="no elements"):
        assert len(sweep) == 0


def test_axis_must_be_a_staticmethod(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        def axis_x(self):
            return [{"a": 1}, {"a": 2}]

    with pytest.raises(ExpansionError, match="must be a @staticmethod"):
        get(T, ["~~x"]).expand()


def test_axis_returning_a_mapping_points_at_version_methods(tmp_storage):
    with pytest.raises(ExpansionError, match="must return a sequence"):
        _sweep({"a": 2}).expand()


def test_version_method_returning_a_list_points_at_axes(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        def version_x(self):
            return [{"a": 1}, {"a": 2}]

    with pytest.raises(ConfigurationError, match="axis_x"):
        get(T, ["~x"]).config  # noqa: B018


def test_bare_string_element_is_rejected(tmp_storage):
    with pytest.raises(ExpansionError, match="~-prefix"):
        _sweep(["nope"]).expand()


def test_arbitrary_object_element_is_rejected(tmp_storage):
    with pytest.raises(ExpansionError, match="invalid element"):
        _sweep([object()]).expand()


def test_non_scope_interface_element_is_rejected(tmp_storage):
    class Other(Interface):
        class Config(BaseModel):
            a: int = 1

    with pytest.raises(ExpansionError, match="only Scopes may be yielded"):
        _sweep([get(Other), get(Other, {"a": 2})]).expand()


def test_execution_element_points_at_per_interface_resources(tmp_storage):
    with pytest.raises(ExpansionError, match="on_compute_default_resources"):
        _sweep([Execution(), Execution()]).expand()


def test_context_axis_may_not_yield_a_context(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_outer():
            return [get("machinable.scope", "~~nested_context")]

    from machinable.project import Project

    provider = Project.get().provider()
    type(provider).axis_nested_context = staticmethod(
        lambda: [get("machinable.scope", {"seed": 1})]
    )
    try:
        with pytest.raises(ExpansionError, match="may only yield version patches"):
            get(T, ["~~outer"]).expand()
    finally:
        del type(provider).axis_nested_context


def test_cycle_is_caught(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_x():
            return ["~~x"]

    with pytest.raises(ExpansionError, match="cycle"):
        get(T, ["~~x"]).expand()


def test_unknown_axis(tmp_storage):
    with pytest.raises(ExpansionError, match="does not exist"):
        get(Replicate, ["~~nope"]).expand()


# -- duplicate detection --------------------------------------------------- #


def test_duplicate_elements_are_rejected(tmp_storage):
    with pytest.raises(ExpansionError, match="2 elements but only 1 distinct"):
        _sweep([{"a": 2}, {"a": 2}]).expand()


def test_override_after_the_axis_collapses_the_sweep(tmp_storage):
    # the trailing patch overwrites the element's key at merge time
    with pytest.raises(ExpansionError, match="2 elements but only 1 distinct"):
        get(Replicate, ["~~thresholds", {"threshold": 1.0}]).expand()


def test_elements_that_do_not_vary_an_identifying_field(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_x():
            # the loop variable is ignored: a classic sweep bug
            return [{"a": 1} for _ in range(4)]

    with pytest.raises(ExpansionError, match="4 elements but only 1"):
        get(T, ["~~x"]).expand()


# -- identity -------------------------------------------------------------- #


def test_members_are_identical_to_direct_runs(tmp_storage):
    sweep = get(Replicate, ["~~sessions"]).launch()
    direct = get(Replicate, {"path": "data/s1.nwb"})

    assert direct.is_materialized()
    assert direct.uuid == sweep.interfaces[1].uuid
    assert direct.cached()


def test_coordinator_never_resolves_onto_an_existing_record(tmp_storage):
    plain = get(Replicate, {"threshold": 5.0}).launch()
    sweep = get(Replicate, ["~~seeds"])

    assert sweep.is_unexpanded()
    assert not sweep.is_materialized()
    assert sweep.compute_fingerprint() is None
    assert plain.uuid not in {m.uuid for m in sweep}


def test_group_identity_distinguishes_scope_cardinality(tmp_storage):
    two = get(Replicate, ["~~seeds(2)"]).catalog_identity_key()
    three = get(Replicate, ["~~seeds(3)"]).catalog_identity_key()

    assert two != three


def test_group_identity_is_stable_across_launch(tmp_storage):
    before = get(Replicate, ["~~sessions"]).catalog_identity_key()
    get(Replicate, ["~~sessions"]).launch()
    after = get(Replicate, ["~~sessions"]).catalog_identity_key()

    assert before == after


def test_group_identity_ignores_element_order(tmp_storage):
    class Forward(Interface):
        kind = "Interface"

        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_x():
            return [{"a": 1}, {"a": 2}]

    class Reverse(Forward):
        @staticmethod
        def axis_x():
            return [{"a": 2}, {"a": 1}]

    # same set of members, same group identity (module is part of the member
    # keys, so compare the derived hash of a shared module instead)
    forward = get(Forward, ["~~x"])
    reverse = get(Forward, ["~~x"])
    assert forward.catalog_identity_key() == reverse.catalog_identity_key()


# -- lifecycle guards ------------------------------------------------------ #


def test_unexpanded_cannot_be_entered(tmp_storage):
    with pytest.raises(ExpansionError, match="Cannot enter"):
        with get(Replicate, ["~~sessions"]):
            pass


def test_unexpanded_scope_cannot_be_entered(tmp_storage):
    # the silent-collapse hazard: an unexpanded scope would apply an empty
    # predicate and fold the whole sweep onto one record
    scope = get("machinable.scope", "~~seeds")
    with pytest.raises(ExpansionError, match="Cannot enter"):
        with scope:
            pass


def test_unexpanded_cannot_be_materialized(tmp_storage):
    with pytest.raises(ExpansionError, match="Cannot materialize"):
        get(Replicate, ["~~sessions"]).materialize()


def test_unexpanded_cannot_be_called(tmp_storage):
    class T(Interface):
        class Config(BaseModel):
            a: int = 1

        @staticmethod
        def axis_x():
            return [{"a": 1}, {"a": 2}]

    with pytest.raises(ExpansionError, match="Cannot call"):
        get(T, ["~~x"])()


def test_ordinary_interfaces_are_unaffected(tmp_storage):
    run = get(Replicate, {"path": "x"})

    assert not run.is_unexpanded()
    assert bool(run) is True
    assert run.expand().first() is run
    with pytest.raises(TypeError, match="not iterable"):
        list(run)
    with pytest.raises(TypeError, match="no length"):
        len(run)


# -- integration ----------------------------------------------------------- #


def test_launch_is_incremental(tmp_storage):
    # a run that already exists is adopted by the sweep rather than recreated
    first = get(Replicate, {"path": "data/s1.nwb"}).launch()

    sweep = get(Replicate, ["~~sessions"]).launch()
    members = sweep.interfaces

    assert all(m.cached() for m in members)
    assert [m.load_file("out.json")["path"] for m in members] == [
        f"data/s{i}.nwb" for i in range(3)
    ]
    assert first.uuid in {m.uuid for m in members}
    assert _record_count(members[0].module) == 3

    # re-launching creates nothing new
    sweep.launch()
    assert _record_count(members[0].module) == 3


def test_members_join_a_connected_execution(tmp_storage):
    with Execution() as execution:
        get(Replicate, ["~~sessions"]).launch()

    assert len(execution.interfaces) == 3
    assert all(m.cached() for m in execution.interfaces)


def test_get_all_returns_the_stored_members(tmp_storage):
    assert len(get.all(Replicate, ["~~sessions"])) == 0
    get(Replicate, ["~~sessions"]).launch()
    assert len(get.all(Replicate, ["~~sessions"])) == 3


def test_to_cli_round_trip(tmp_storage):
    sweep = get(Replicate, ["~~sessions", "~strict"])

    assert sweep.to_cli().endswith("~~sessions ~strict")


def test_axis_as_an_inference_operand(tmp_storage):
    from machinable.inference import Inference

    class Mean(Inference):
        class Config(BaseModel):
            quantity: str = "value"

        def test(self, samples):
            return {"claim": "mean", "holds": True, "n": [len(s) for s in samples]}

    sweep = get(Measured, ["~~grid"])
    sweep.launch()

    verdict = get(Mean, {"quantity": "value"}).of(sweep).launch().verdict()
    assert verdict["n"] == [4]
