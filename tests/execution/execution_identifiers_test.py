import pytest

from machinable.execution.identifiers import (
    decode_experiment_id,
    encode_experiment_id,
    generate_experiment_id,
)
from machinable.utils.utils import generate_uid


def test_experiment_id_encoding():
    assert encode_experiment_id(946416180) == "123456"
    with pytest.raises(ValueError):
        encode_experiment_id(0)
    assert decode_experiment_id("123456") == 946416180
    with pytest.raises(ValueError):
        decode_experiment_id("invalid")
    for _ in range(5):
        t = generate_experiment_id(with_encoding=False)
        assert decode_experiment_id(encode_experiment_id(t)) == t


def test_uid_generator():
    for seed in [123, 12, 100, 2000]:
        # correct length
        assert len(generate_uid(random_state=seed)[0]) == 12
        assert len(generate_uid(k=5, random_state=seed)) == 5

        # regenerate
        L1 = generate_uid(k=5, random_state=seed)
        L2 = generate_uid(k=5, random_state=seed)

        assert len(L1) == len(L2) and sorted(L1) == sorted(L2)
