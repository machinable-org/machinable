import shutil
import sys

import pytest

from machinable.index import Index
from machinable.project import Project
from machinable.storage import Storage


@pytest.fixture(autouse=True)
def _reset_ephemeral_project_modules():
    """Drop project modules imported from temporary directories between tests.

    machinable registers project modules in ``sys.modules`` under their bare
    name (e.g. ``hello``). Different tests copy the sample project to fresh tmp
    dirs, so same-named modules collide / go stale across tests. Removing the
    tmp-loaded ones after each test keeps tests independent (the in-process
    analogue of process isolation).
    """
    before = set(sys.modules)
    yield
    for name in set(sys.modules) - before:
        module = sys.modules.get(name)
        path = (getattr(module, "__file__", None) or "").replace("\\", "/").lower()
        if any(marker in path for marker in ("/temp/", "/tmp/", "pytest-of")):
            sys.modules.pop(name, None)


@pytest.fixture(autouse=True)
def _no_manifest_capture(monkeypatch):
    """Disable provenance manifest capture by default.

    Capture targets the git repo that *contains* the project; for tests that run
    against the in-repo ``tests/samples/project`` that would fingerprint the
    machinable repo's (varying) dirty state on every dispatch and slow the suite.
    Provenance tests opt back in with an isolated git repo (see
    ``tests/test_provenance.py``).
    """
    monkeypatch.setattr(Project, "on_resolve_manifests", lambda self: [], raising=False)
    yield


@pytest.fixture()
def tmp_storage(tmp_path):
    project_dir = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project",
        project_dir,
        ignore=shutil.ignore_patterns("storage"),
    )
    # pin database and storage root explicitly: the defaults re-resolve against
    # the currently connected project, so a test entering an in-repo Project
    # (e.g. tests/samples/project) would otherwise write into the repository
    with (
        Project(str(project_dir)),
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}) as index,
    ):
        yield index
