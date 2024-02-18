import os
import shutil

from machinable import Storage


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
            dirs_exist_ok=True,
        )

        return True


def test_storage(tmp_path):
    from machinable import Index, get

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
    interface1_reload.fetch()
    assert os.path.exists(interface1_reload.local_directory())
    assert not os.path.exists(interface2.local_directory())
    interface2_reload = get("dummy", {"a": 5})
    interface2_reload.fetch()
    assert os.path.exists(interface2.local_directory())

    project.__exit__()
    st1.__exit__()
    st2.__exit__()
    i.__exit__()


def test_storage_upload_and_download(tmp_path):
    from machinable import Index, get

    primary = str(tmp_path / "primary")
    secondary = str(tmp_path / "secondary")

    i = Index(primary).__enter__()
    local = Index(str(tmp_path / "download"))

    storage = CopyStorage({"directory": secondary})

    project = get("machinable.project", "tests/samples/project").__enter__()

    interface1 = get("dummy").launch()
    interface2 = get("dummy", {"a": 5}, uses=interface1).launch()

    assert not os.path.exists(tmp_path / "secondary" / interface2.uuid)
    storage.upload(interface2)
    assert os.path.exists(tmp_path / "secondary" / interface1.uuid)
    assert os.path.exists(tmp_path / "secondary" / interface2.uuid)

    assert not local.find(interface2)
    with local:
        downloads = storage.download(interface2.uuid, related=False)
        assert len(downloads) == 1
        assert os.path.exists(local.local_directory(interface2.uuid))
        assert not os.path.exists(local.local_directory(interface1.uuid))
        assert local.find(interface2)
        assert not local.find(interface1)

        downloads = storage.download(interface2.uuid, related=True)
        assert len(downloads) == 2
        assert os.path.exists(local.local_directory(interface1.uuid))
        assert local.find(interface1)

    project.__exit__()
    i.__exit__()
