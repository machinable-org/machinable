from machinable.utils.vcs import get_root_commit


def test_get_root_commit():
    assert get_root_commit(".") == "0f831188de08028e36d59e9acd79700f70f114ed"
