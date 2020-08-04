from machinable.utils.vcs import get_root_commit


def test_get_root_commit():
    assert len(get_root_commit(".")) == 40
