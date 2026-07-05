"""Canonical config identity (C0-C3).

C0 building blocks (Field/identity_exclude, canonical() default-strip, the
required-field-tolerant default builder, import_object_by_path, resolve_ref/
import_ref); C1 canonical identity_key; C2 version-spelling-independent matching;
C3 identifying=False end-to-end (live + reindex exclude, predicate_from_manifest,
guardrail).
"""

import pytest
from omegaconf import OmegaConf
from pydantic import BaseModel

import machinable
from machinable.config import (
    Field,
    _model_defaults,
    canonical,
    from_interface,
    identity_exclude,
    import_object_by_path,
    import_ref,
    resolve_ref,
)

# --- machinable.Field + identity_exclude ---------------------------------------


def test_field_identifying_flag_and_exclude():
    class Config(BaseModel):
        a: int = 1
        uri: str = Field("", identifying=False)
        keep: str = Field("x")  # identifying defaults to True

    assert identity_exclude(Config) == {"uri"}
    # the model still validates/coerces normally
    assert Config().model_dump() == {"a": 1, "uri": "", "keep": "x"}
    # exported at the package root
    assert machinable.Field is Field


def test_identity_exclude_empty_for_plain_model():
    class Config(BaseModel):
        a: int = 1

    assert identity_exclude(Config) == set()


# --- unknown keys are rejected ---------------------------------------------------


def test_config_extra_keys_rejected(tmp_storage):
    from pydantic import ConfigDict

    from machinable import Interface, get
    from machinable.errors import ConfigurationError

    class Typed(Interface):
        class Config(BaseModel):
            lr: float = 0.1

    # a typo would otherwise validate against the defaults and dedup wrongly
    with pytest.raises(ConfigurationError, match="lrr"):
        _ = get(Typed, {"lrr": 0.2}).config

    # an explicit extra setting on the user's model is respected
    class Relaxed(Interface):
        class Config(BaseModel):
            model_config = ConfigDict(extra="ignore")

            lr: float = 0.1

    assert get(Relaxed, {"lrr": 0.2}).config.lr == 0.1

    class Open(Interface):
        class Config(BaseModel):
            model_config = ConfigDict(extra="allow")

            lr: float = 0.1

    assert get(Open, {"tag": "x"}).config.tag == "x"


def test_config_extra_keys_rejected_in_nested_models(tmp_storage):
    from pydantic import ConfigDict

    from machinable import Interface, get
    from machinable.errors import ConfigurationError

    class Nested(Interface):
        class Config(BaseModel):
            class Optimizer(BaseModel):
                name: str = "sgd"
                lr: float = 0.1

            optimizer: Optimizer = Optimizer()
            variants: list[Optimizer] = []

    # a typo after the dot is caught, with the full path in the message
    with pytest.raises(ConfigurationError, match="optimizer.lrr"):
        _ = get(Nested, {"optimizer.lrr": 0.2}).config
    with pytest.raises(ConfigurationError, match="optimizer.lrr"):
        _ = get(Nested, {"optimizer": {"lrr": 0.2}}).config

    # models inside containers are checked too
    with pytest.raises(ConfigurationError, match=r"variants\[0\].lrr"):
        _ = get(Nested, {"variants": [{"lrr": 0.2}]}).config

    # an explicit extra setting on the nested model is respected
    class Relaxed(Interface):
        class Config(BaseModel):
            class Optimizer(BaseModel):
                model_config = ConfigDict(extra="ignore")

                lr: float = 0.1

            optimizer: Optimizer = Optimizer()

    assert get(Relaxed, {"optimizer.lrr": 0.2}).config.optimizer.lr == 0.1


def test_nested_identifying_false_leaves_identity(tmp_storage):
    from machinable import Interface, get

    class Rec(Interface):
        class Config(BaseModel):
            class Data(BaseModel):
                uri: str = Field("", identifying=False)
                fold: int = 0

            data: Data = Data()
            lr: float = 0.1

    assert identity_exclude(Rec.Config) == {"data.uri"}

    a = get(Rec, {"data.uri": "file:///here"})
    b = get(Rec, {"data.uri": "s3://there"})
    assert a.catalog_identity_key() == b.catalog_identity_key()
    # the identifying sibling still discriminates
    c = get(Rec, {"data.uri": "s3://there", "data.fold": 1})
    assert c.catalog_identity_key() != a.catalog_identity_key()


def test_canonical_dotted_exclude():
    resolved = {"data": {"uri": "/mnt/x", "fold": 3}, "lr": 0.1}
    default = {"data": {"uri": "", "fold": 0}, "lr": 0.1}
    assert canonical(resolved, default, {"data.uri"}) == {"data": {"fold": 3}}
    # excluded-only deviation strips the whole nested dict
    assert (
        canonical({"data": {"uri": "/mnt/x"}}, {"data": {"uri": ""}}, {"data.uri"})
        == {}
    )
    # free-form (absent from default) mappings honor dotted excludes too
    assert canonical({"p": {"uri": "/x", "t": 5}}, {}, {"p.uri"}) == {"p": {"t": 5}}


# --- canonical() default-strip --------------------------------------------------


def test_canonical_strips_defaults_keeps_deviations():
    assert canonical({"a": 1, "b": 2}, {"a": 0, "b": 2}) == {"a": 1}


def test_canonical_excludes_non_identifying_even_when_changed():
    out = canonical({"a": 1, "uri": "s3://x"}, {"a": 0, "uri": ""}, exclude={"uri"})
    assert out == {"a": 1}


def test_canonical_keeps_keys_absent_from_default():
    # required field / free-form deviation: not in default -> kept verbatim
    assert canonical({"a": 1, "extra": 5}, {"a": 0}) == {"a": 1, "extra": 5}


def test_canonical_recurses_into_nested_dicts():
    out = canonical({"opt": {"lr": 1.0, "mom": 0.9}}, {"opt": {"lr": 0.1, "mom": 0.9}})
    assert out == {"opt": {"lr": 1.0}}


def test_canonical_strips_whole_nested_dict_at_default():
    same = {"opt": {"lr": 0.1, "mom": 0.9}}
    assert canonical(same, {"opt": {"lr": 0.1, "mom": 0.9}}) == {}


def test_canonical_keeps_free_form_contents_verbatim():
    # free-form dict default is {}, so inner keys are deviations -> kept (not folded)
    assert canonical({"p": {"t": 5}}, {"p": {}}) == {"p": {"t": 5}}


def test_canonical_no_numeric_fold_against_distinct_default():
    assert canonical({"lr": 1.0}, {"lr": 0.1}) == {"lr": 1.0}


# --- required fields: default builder + from_interface tolerance ----------------


def test_model_defaults_omits_required_field():
    class Req(BaseModel):
        lr: float  # required, no default
        epochs: int = 10

    assert _model_defaults(Req) == {"epochs": 10}


def test_model_defaults_nested_and_required():
    class Opt(BaseModel):
        lr: float = 0.1

    class Nest(BaseModel):
        opt: Opt = Opt()
        req: int  # required

    assert _model_defaults(Nest) == {"opt": {"lr": 0.1}}


def test_from_interface_tolerates_required_fields():
    class Req(BaseModel):
        lr: float
        epochs: int = 10

    class Holder:
        Config = Req

    default_config, model = from_interface(Holder)
    assert default_config == {"epochs": 10}
    assert model is Req


def test_from_interface_unchanged_without_required_fields():
    class Full(BaseModel):
        a: int = 1
        b: float = 0.5

    class Holder:
        Config = Full

    default_config, model = from_interface(Holder)
    # byte-identical to the existing model_dump() path
    assert default_config == Full().model_dump()
    assert model is Full


# --- import_object_by_path ------------------------------------------------------


def test_import_object_by_path_dotted_and_colon():
    import collections

    assert import_object_by_path("collections.OrderedDict") is collections.OrderedDict
    assert import_object_by_path("collections:OrderedDict") is collections.OrderedDict


def test_import_object_by_path_nested_attr():
    import collections

    assert (
        import_object_by_path("collections:OrderedDict.fromkeys")
        == collections.OrderedDict.fromkeys
    )


def test_import_object_by_path_invalid():
    with pytest.raises(ValueError):
        import_object_by_path("nodots")
    with pytest.raises(ModuleNotFoundError):
        import_object_by_path("no_such_module_xyz.Thing")


# --- resolve_ref / import_ref ---------------------------------------------------


def test_resolve_ref_none_and_str():
    assert resolve_ref(None) is None
    assert resolve_ref("builtins.dict") == (dict, {})


def test_resolve_ref_with_kwargs():
    assert resolve_ref(("builtins:dict", {"a": 1})) == (dict, {"a": 1})


def test_resolve_ref_rightmost_wins():
    assert resolve_ref(("builtins:dict", {"a": 1}, {"a": 2})) == (dict, {"a": 2})


def test_resolve_ref_deep_merge():
    obj, kwargs = resolve_ref(("builtins:dict", {"a": {"x": 1}}, {"a": {"y": 2}}))
    assert obj is dict
    assert kwargs == {"a": {"x": 1, "y": 2}}  # deep, via update_dict


def test_resolve_ref_from_omegaconf_listconfig():
    cfg = OmegaConf.create({"ref": ("builtins:dict", {"a": 1})})
    assert resolve_ref(cfg.ref) == (dict, {"a": 1})


def test_import_ref_instantiates():
    assert import_ref(("builtins:dict", {"a": 1, "b": 2})) == {"a": 1, "b": 2}
    assert import_ref(None) is None


def test_import_ref_for_interface_composition_form():
    # the (module, version) form is also what get(*ref) accepts
    ref = ("builtins:dict", {"depth": 50})
    obj, kwargs = resolve_ref(ref)
    assert obj(**kwargs) == {"depth": 50}


# --- C1: canonical identity_key -------------------------------------------------


def test_canonical_identity_key_robustness():
    from machinable.config import canonical_identity_key as K

    base = K("m", {"a": 2}, {"a": 1})
    # add a field sitting at its default -> identity unchanged (schema evolution)
    assert K("m", {"a": 2, "c": 0.5}, {"a": 1, "c": 0.5}) == base
    # change a non-deviating field's default -> unchanged
    assert K("m", {"a": 2, "b": "y"}, {"a": 1, "b": "y"}) == K(
        "m", {"a": 2, "b": "x"}, {"a": 1, "b": "x"}
    )
    # key order irrelevant (normjson sorts)
    assert K("m", {"b": 2, "a": 1}, {}) == K("m", {"a": 1, "b": 2}, {})
    # a real value change -> different
    assert K("m", {"a": 3}, {"a": 1}) != base
    # module participates
    assert K("n", {"a": 2}, {"a": 1}) != base
    # 24-char key
    assert len(base) == 24


def test_canonical_identity_key_excludes_non_identifying():
    from machinable.config import canonical_identity_key as K

    a = K("m", {"a": 2, "uri": "x"}, {"a": 1, "uri": ""}, exclude={"uri"})
    b = K("m", {"a": 2, "uri": "y"}, {"a": 1, "uri": ""}, exclude={"uri"})
    assert a == b  # the differing URI is excluded from identity


def test_identity_key_version_spelling_is_a_no_op(tmp_storage):
    from machinable import Project, get

    with Project("./tests/samples/project"):
        # ~large expands to {layers: 12}; identity hashes the resolved config,
        # not the literal version, so both spellings share an identity_key.
        via_token = get("versioned", ["~large"]).catalog_identity_key()
        via_dict = get("versioned", [{"layers": 12}]).catalog_identity_key()
        assert via_token == via_dict
        # a genuinely different config differs
        other = get("versioned", [{"layers": 3}]).catalog_identity_key()
        assert other != via_token


# --- C2: matching on identity_key (version-spelling independent) -----------------


def test_find_matches_across_version_spelling(tmp_storage):
    from machinable import Project, get

    with Project("./tests/samples/project"):
        stored = get("versioned", [{"layers": 12}]).materialize()
        # find via the ~large token spelling -> same record (matches on identity_key)
        found = get("versioned", ["~large"]).all()
        assert stored.uuid in {i.uuid for i in found}
        # a genuinely different config does not match
        other = get("versioned", [{"layers": 3}]).all()
        assert stored.uuid not in {i.uuid for i in other}


# --- C3: identifying=False end-to-end -------------------------------------------


def test_predicate_from_manifest(tmp_path):
    import json

    from machinable.config import predicate_from_manifest

    (tmp_path / "manifest.json").write_text(json.dumps({"recording_id": "r1", "n": 3}))
    assert predicate_from_manifest(str(tmp_path), "recording_id") == {
        "recording_id": "r1"
    }
    assert predicate_from_manifest(str(tmp_path), "recording_id", "n") == {
        "recording_id": "r1",
        "n": 3,
    }
    with pytest.raises(FileNotFoundError):
        predicate_from_manifest(str(tmp_path / "nope"), "recording_id")


def _make_recording(path, recording_id="rec-42"):
    import json

    path.mkdir(parents=True, exist_ok=True)
    (path / "manifest.json").write_text(json.dumps({"recording_id": recording_id}))
    return str(path)


def test_identifying_false_excluded_from_identity(tmp_storage, tmp_path):
    from machinable import Project, get

    a = _make_recording(tmp_path / "a")
    b = _make_recording(tmp_path / "b")  # same recording_id, different location

    with Project("./tests/samples/project"):
        ka = get("excluded", {"recording_uri": a}).catalog_identity_key()
        kb = get("excluded", {"recording_uri": b}).catalog_identity_key()
        assert ka == kb  # recording_uri excluded from identity
        # a real config change still differs
        kc = get(
            "excluded", {"recording_uri": a, "sorter": "other"}
        ).catalog_identity_key()
        assert kc != ka

        # materialize via location A, then find via location B -> the same record
        stored = get("excluded", {"recording_uri": a}).materialize()
        found = get("excluded", {"recording_uri": b}).all()
        assert stored.uuid in {i.uuid for i in found}


def test_reindex_reimports_config_for_exclude(tmp_storage, tmp_path):
    from machinable import Project, get
    from machinable.index import Index

    a = _make_recording(tmp_path / "a")
    b = _make_recording(tmp_path / "b")

    with Project("./tests/samples/project"):
        stored = get("excluded", {"recording_uri": a}).materialize()
        # full reindex recomputes identity_key from model.json; the exclude set
        # (recording_uri) is recovered by re-importing Config, so the key is
        # preserved and the record is still matched via a different location.
        Index.get().reindex()
        found = get("excluded", {"recording_uri": b}).all()
        assert stored.uuid in {i.uuid for i in found}


def test_guardrail_warns_on_excluded_without_predicate(tmp_storage):
    import warnings as w

    from pydantic import BaseModel

    from machinable import Field, Interface

    class Leaky(Interface):
        class Config(BaseModel):
            uri: str = Field("", identifying=False)

        # no on_compute_predicate -> empty predicate -> all instances collapse

    with w.catch_warnings(record=True) as rec:
        w.simplefilter("always")
        Leaky({"uri": "x"}).materialize()
    assert any("identifying=False" in str(x.message) for x in rec)
