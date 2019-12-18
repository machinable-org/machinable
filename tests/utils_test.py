import pytest

from machinable.utils.strings import generate_uid, generate_execution_id
from machinable.utils.dicts import read_path_dict


def test_uid_generator():
    for seed in [123, 12, 100, 2000]:
        # correct length
        assert len(generate_uid(random_state=seed)) == 12
        assert len(generate_uid(k=5, random_state=seed)) == 5

        # regenerate
        L1 = generate_uid(k=5, random_state=seed)
        L2 = generate_uid(k=5, random_state=seed)

        assert len(L1) == len(L2) and sorted(L1) == sorted(L2)


def test_generate_execution_id():
    assert len(generate_execution_id()) == 9


def test_read_path_dict():
    t = {
        'one': {
            'nasty': 1
        },
        'nested':  {
            'nested': {
                'nested': 2,
                'deep': [
                    {
                        'down': 5
                    },
                    {
                        'rabbit': 3
                    }
                ]
            }
        },
        'test': ['case'],
        'foo.bar': 6
    }

    # dict nesting
    assert read_path_dict(t, 'one.nasty') == 1
    assert read_path_dict(t, 'nested.nested.nested') == 2
    assert read_path_dict(t, 'test') == ['case']

    with pytest.raises(KeyError):
        read_path_dict(t, 'not_existing')

    # array syntax
    assert read_path_dict(t, "test[0]") == 'case'
    assert read_path_dict(t, "one[nasty]") == 1
    assert read_path_dict(t, "nested[nested].nested") == 2

    assert read_path_dict(t, "nested[nested].deep[1].rabbit") == 3
    assert read_path_dict(t, "nested[nested][deep][1].rabbit") == 3
    assert read_path_dict(t, "nested[nested][deep][0][down]") == 5

    # escape .
    # todo: fix escaped version
    #assert read_path_dict(t, "foo\.bar") == 6
