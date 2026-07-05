import pytest

from machinable import Inference, get


def test_inference_is_a_kind():
    from machinable import schema

    assert Inference.kind == "Inference"
    assert schema.Inference(kind="Inference").kind == "Inference"


def test_inference_protocol(tmp_storage):
    # two aggregates whose .interfaces grids dedup-launch ScoreTrials
    a = get("score_group", {"points": [1.0, 2.0, 3.0]})
    b = get("score_group", {"points": [10.0, 11.0, 12.0]})
    a.launch()  # caches the trials so units() can collect them
    b.launch()

    inf = get("mean_greater", {"quantity": "score"}).of(a, b)

    # operands fold into the predicate (identity = method × operands)
    assert inf.predicate["operands"] == [
        a.catalog_identity_key(),
        b.catalog_identity_key(),
    ]

    verdict = inf.launch().verdict()
    assert verdict["holds"] is False  # mean([1,2,3]) < mean([10,11,12])
    assert verdict["mean_a"] == 2.0 and verdict["mean_b"] == 11.0
    assert verdict["n_a"] == 3 and verdict["n_b"] == 3
    assert verdict["operands"] == [
        a.catalog_identity_key(),
        b.catalog_identity_key(),
    ]

    # re-asking the same question is a cached no-op returning the same verdict
    again = get("mean_greater", {"quantity": "score"}).of(a, b)
    assert again.launch().verdict()["holds"] is False


def test_inference_not_implemented_contract(tmp_storage):
    a = get("score_group", {"points": [1.0, 2.0]})
    b = get("score_group", {"points": [3.0, 4.0]})
    a.launch()
    b.launch()

    # asking for a quantity the operand's runs don't expose names the fix
    bad = get("mean_greater", {"quantity": "missing"}).of(a, b)
    with pytest.raises(NotImplementedError, match="missing"):
        bad.resolve(a)
