import os
import shutil

from machinable import get


def test_storage(tmp_path):
    primary = str(tmp_path / "primary")
    secondary = str(tmp_path / "secondary")

    storage = get(
        "machinable.storage",
        {
            "directory": primary,
            "remotes": [
                "machinable.storage",
                {
                    "directory": secondary,
                    "index": [
                        "machinable.index",
                        {"database": str(tmp_path / "secondary.sqlite")},
                    ],
                },
            ],
            "index": [
                "machinable.index",
                {"database": str(tmp_path / "primary.sqlite")},
            ],
        },
    ).__enter__()

    project = get("machinable.project", "tests/samples/project").__enter__()

    interface1 = get("dummy").commit()
    interface2 = get("dummy", {"a": 5}).commit()

    assert os.path.exists(os.path.join(primary, interface1.uuid))
    assert os.path.exists(os.path.join(secondary, interface1.uuid))

    # delete primary source and reload from remote
    shutil.rmtree(primary)
    assert not os.path.exists(interface1.local_directory())
    assert not os.path.exists(interface2.local_directory())
    interface1_reload = get("dummy")
    assert os.path.exists(interface1_reload.local_directory())
    assert not os.path.exists(interface2.local_directory())
    interface2_reload = get("dummy", {"a": 5})
    assert os.path.exists(interface2.local_directory())

    project.__exit__()
    storage.__exit__()
