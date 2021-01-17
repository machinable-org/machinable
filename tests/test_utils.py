import pytest
from machinable.utils import utils


def test_utils():
    # experiment identifiers
    assert utils.encode_experiment_id(946416180) == "123456"
    with pytest.raises(ValueError):
        utils.encode_experiment_id(0)
    assert utils.decode_experiment_id("123456") == 946416180
    with pytest.raises(ValueError):
        utils.decode_experiment_id("invalid")
    assert utils.generate_experiment_id() > 0
    eid = utils.generate_experiment_id()
    assert utils.decode_experiment_id(utils.encode_experiment_id(eid)) == eid

    # nickname
    with pytest.raises(ValueError):
        utils.generate_nickname({})
    with pytest.raises(KeyError):
        utils.generate_nickname("non-existent-category")
    assert len(utils.generate_nickname().split("_")) == 2
    assert utils.generate_nickname(["tree"]).find("_") == -1
