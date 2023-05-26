import os
import shutil

from machinable import Index, Storage, get


def test_storage(tmp_path):
    class CopyStorage(Storage):
        class Config:
            directory: str = ""

        def commit(self, interface) -> bool:
            directory = os.path.join(self.config.directory, interface.uuid)
            if not os.path.exists(directory):
                os.makedirs(directory)
                interface.to_directory(directory)

        def contains(self, uuid):
            return os.path.exists(os.path.join(self.config.directory, uuid))

        def retrieve(self, uuid, local_directory) -> bool:
            if not self.contains(uuid):
                return False

            shutil.copytree(
                os.path.join(self.config.directory, uuid),
                local_directory,
                # dirs_exist_ok=True, -> not available in Python 3.7
            )

            return True

    primary = str(tmp_path / "primary")
    secondary = str(tmp_path / "secondary")

    i = Index(
        {"directory": primary, "database": str(tmp_path / "index.sqlite")}
    ).__enter__()

    st2 = CopyStorage({"directory": secondary}).__enter__()
    st1 = Storage().__enter__()

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
    st1.__exit__()
    st2.__exit__()
    i.__exit__()
