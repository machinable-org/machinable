import os
import shutil

from pydantic import BaseModel

from machinable import Storage


class CopyStorage(Storage):
    class Config(BaseModel):
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

    i = Index({"database": str(tmp_path / "index.sqlite")}).__enter__()

    st2 = CopyStorage({"directory": secondary}).__enter__()
    st1 = Storage(primary).__enter__()

    project = get("machinable.project", "tests/samples/project").__enter__()

    interface1 = get("dummy").materialize()
    interface2 = get("dummy", {"a": 5}).materialize()

    assert os.path.exists(interface1.local_directory())
    assert os.path.exists(os.path.join(secondary, interface1.uuid))

    # delete primary source and reload from remote
    for iface in (interface1, interface2):
        artifact_root = iface.local_directory()
        if os.path.isdir(artifact_root):
            shutil.rmtree(artifact_root)
    assert not os.path.exists(interface1.local_directory())
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


def test_on_commit_veto(tmp_storage, tmp_path):
    from machinable import Interface, get

    secondary = str(tmp_path / "secondary")
    with CopyStorage({"directory": secondary}):

        class Open(Interface):
            pass

        class Vetoed(Interface):
            def on_commit(self):
                return False  # e.g. a non-controller MPI rank

        mirrored = get(Open).materialize()
        assert os.path.exists(os.path.join(secondary, mirrored.uuid))
        skipped = get(Vetoed).materialize()
        assert not os.path.exists(os.path.join(secondary, skipped.uuid))


def _catalog_slot(index, interface):
    return index.get_by_id(interface.uuid)


def test_storage_upload_and_download(tmp_path):
    from machinable import Index, get

    primary = str(tmp_path / "primary")
    secondary = str(tmp_path / "secondary")

    i = Index({"database": str(tmp_path / "primary.sqlite")}).__enter__()
    home = Storage(primary).__enter__()
    local = Index({"database": str(tmp_path / "download.sqlite")})

    storage = CopyStorage({"directory": secondary})

    project = get("machinable.project", "tests/samples/project").__enter__()

    interface1 = get("dummy").launch()
    interface2 = get("dummy", {"a": 5}, uses=interface1).launch()

    assert not os.path.exists(tmp_path / "secondary" / interface2.uuid)
    storage.upload(interface2)
    assert os.path.exists(tmp_path / "secondary" / interface1.uuid)
    assert os.path.exists(tmp_path / "secondary" / interface2.uuid)

    assert _catalog_slot(local, interface2) is None
    with local, Storage(str(tmp_path / "download")):
        downloads = storage.download(interface2.uuid, related=False)
        assert len(downloads) == 1
        assert os.path.exists(local.local_directory(interface2.uuid))
        assert not os.path.exists(local.local_directory(interface1.uuid))
        assert _catalog_slot(local, interface2) is not None
        assert _catalog_slot(local, interface1) is None

        downloads = storage.download(interface2.uuid, related=True)
        assert len(downloads) == 2
        assert os.path.exists(local.local_directory(interface1.uuid))
        assert _catalog_slot(local, interface1) is not None

    project.__exit__()
    home.__exit__()
    i.__exit__()
