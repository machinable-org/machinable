"""Code/deps/environment provenance as a content-addressed interface kind.

A :class:`Manifest` is the bill of materials for an execution: it names the exact code
state a run used, as opaque per-tool references (never bytes); resolving, verifying, or
describing them is the tool's business, not machinable's.

Following the :class:`~machinable.storage.Storage` motif, the **base ``Manifest`` is
the git implementation** (as the base ``Storage`` is the local-filesystem backend).
Other code-provenance tools (a dependency lock, a container digest) are ordinary
``Manifest`` subclasses. There is no registry: a project declares which tools to
capture by returning their importable modules from
:meth:`Project.on_resolve_manifests`, resolved like any other interface. Identity is
``hash(tokens)``, so the same code state dedups to one node; an unresolvable
manifest (an imported run naming an unreachable commit) is still a first-class
node that ``describe()``s itself.
"""

from __future__ import annotations

import hashlib
import io
import os
import subprocess
import tarfile

from machinable import schema
from machinable.interface import Interface, get_dump, get_inherits
from machinable.types import VersionType
from machinable.utils import git_cmd


def _dirty_digest(path: str) -> str | None:
    """Read-only digest of the uncommitted working state.

    Hashes the tracked diff plus the *paths* of untracked files, never their
    contents, so capture stays cheap and write-free even when large untracked
    data (say, a freshly downloaded dataset that is not yet gitignored) sits
    in the tree. Identical dirty states dedup to one manifest node; untracked
    files are distinguished by path only, not by content.
    """
    diff = git_cmd(path, "diff", "HEAD")
    untracked = git_cmd(path, "ls-files", "--others", "--exclude-standard")
    if diff is None and untracked is None:
        return None
    payload = (diff or "") + "\x00" + (untracked or "")
    return hashlib.sha256(payload.encode("utf-8", "surrogateescape")).hexdigest()[:24]


class Manifest(Interface):
    """Content-addressed code-provenance a run ``uses``.

    The base captures git. Capture is strictly **read-only**: it never writes
    objects, refs, or anything else into the repository. A dirty tree is
    recorded as a flag plus a read-only fingerprint of the uncommitted state,
    so identical dirty states dedup while the repository stays untouched;
    uncommitted changes are identified, not made restorable. Subclass and
    override :meth:`capture` (and ``resolve``/``verify``/``describe``) for
    other tools.
    """

    kind = "Manifest"
    # provenance-graph edge label: a run ``uses`` a Manifest, drawn as a
    # `manifest` edge.
    __provenance_rel__ = "manifest"

    def __init__(self, version: VersionType = None) -> None:
        super().__init__(version=version)
        self.__model__ = schema.Manifest(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            inherits=get_inherits(self),
        )
        self.__model__._dump = get_dump(self)

    @property
    def _model(self) -> schema.Manifest:
        from typing import cast

        return cast(schema.Manifest, self.__model__)

    @property
    def entries(self) -> list:
        """The captured ``{provider, component, token}`` entries."""
        return self._model.entries

    def on_compute_predicate(self) -> dict:
        # content-address by (provider, component, token) only; identity is the code
        # state, so descriptive `meta` (branch/remote/toplevel) never splits the node.
        """Content-address by (provider, component, token) only."""
        ident = [
            {
                "provider": e.get("provider"),
                "component": e.get("component"),
                "token": e.get("token"),
            }
            for e in self.entries
        ]
        return {"entries": ident}

    def on_provenance_attributes(self) -> dict:
        # history kind: carry entries (its extra()), not config layers.
        """History facet: the entries, no config layers."""
        attrs = dict(self.__model__.extra() or {})
        attrs.pop("_dump", None)
        return attrs

    def _root(self) -> str:
        from machinable.project import Project

        return Project.get().path() if Project.is_connected() else "."

    # -- provider surface (override for non-git tools) ------------------------

    def capture(self) -> Manifest:
        """Record the current code state into ``entries``, in place, and return self.

        Captures the git repository that *contains* the project (so a project nested in
        a larger monorepo is still versioned), not only a project that is itself the git
        root. Empty entries means the tool is inactive here (not a git repository).
        Read-only: the repository is never modified, so capture is safe with large
        untracked data present and under concurrent capture (e.g. MPI ranks).
        """
        path = self._root()
        commit = git_cmd(path, "rev-parse", "HEAD")
        toplevel = git_cmd(path, "rev-parse", "--show-toplevel")
        if commit is None or toplevel is None:
            self._model.entries = []
            return self
        dirty = git_cmd(path, "status", "--porcelain") not in ("", None)
        token: dict = {"commit": commit, "dirty": dirty}
        if dirty:
            digest = _dirty_digest(path)
            if digest is not None:
                token["uncommitted"] = digest
        self._model.entries = [
            {
                "provider": "git",
                "component": "source",
                "token": token,
                "meta": {
                    "branch": git_cmd(path, "rev-parse", "--abbrev-ref", "HEAD"),
                    "remote": git_cmd(path, "config", "--get", "remote.origin.url"),
                    "toplevel": os.path.realpath(toplevel),
                },
            }
        ]
        return self

    def resolve(self, dst: str) -> bool:
        """Reconstruct the recorded commit into ``dst`` (best-effort).

        Returns ``False`` when the commit is unreachable in the local
        repository. Uncommitted changes are not reconstructed: capture is
        read-only, so a dirty run resolves to its base commit.
        """
        for entry in self.entries:
            if entry.get("provider") != "git":
                continue
            token = entry.get("token") or {}
            repo = self._root()
            obj = token.get("commit")
            if not obj or git_cmd(repo, "cat-file", "-e", obj) is None:
                return False
            try:
                archive = subprocess.check_output(
                    ["git", "-C", repo, "archive", obj], stderr=subprocess.DEVNULL
                )
            except (subprocess.CalledProcessError, FileNotFoundError):
                return False
            os.makedirs(dst, exist_ok=True)
            with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
                tar.extractall(dst)  # noqa: S202 - content is our own recorded tree
            return True
        return False

    def verify(self) -> bool:
        """Whether the current environment still matches this manifest (best-effort)."""
        if not self.entries:
            return False
        repo = self._root()
        for entry in self.entries:
            token = entry.get("token") or {}
            if not isinstance(token, dict):
                return False
            if entry.get("provider") == "git":
                if git_cmd(repo, "rev-parse", "HEAD") != token.get("commit"):
                    return False
                if token.get("dirty"):
                    # match only if the uncommitted state still fingerprints
                    # the same (read-only, like capture)
                    if _dirty_digest(repo) != token.get("uncommitted"):
                        return False
        return True

    def describe(self) -> list[str]:
        """Human-readable one-liner per entry."""
        out: list[str] = []
        for entry in self.entries:
            token = entry.get("token")
            if (
                entry.get("provider") == "git"
                and isinstance(token, dict)
                and token.get("commit")
            ):
                short = token["commit"][:8]
                out.append(f"git {short}{' (dirty)' if token.get('dirty') else ''}")
            else:
                out.append(str(token))
        return out
