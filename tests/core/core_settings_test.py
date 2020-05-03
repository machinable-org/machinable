import os

from machinable.core.settings import get_settings


def test_settings(helpers):
    path = helpers.tmp_directory("settings")

    q = get_settings(file=os.path.join(path, "not-existing"))
    assert not q["cache"]["imports"]

    # empty file
    fp = os.path.join(path, "empty")
    open(fp, "w").close()
    q = get_settings(file=fp)
    assert not q["cache"]["imports"]
