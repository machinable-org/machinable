"""SSH transport: run an execution on another machine."""

import os
import posixpath
import shlex

from pydantic import BaseModel, ConfigDict

from machinable import Project, Storage, Transport


class Ssh(Transport):
    """Reaches another machine over SSH."""

    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        host: str
        """``[user@]hostname`` as ssh would take it (including an ssh_config alias)."""

        storage: str | None = None
        """Storage root on the far side; mirrors the local one record for record."""

        directory: str | None = None
        """Project directory on the far side."""

        options: list[str] = [
            "-o",
            "BatchMode=yes",
            "-o",
            "ControlMaster=auto",
            "-o",
            "ControlPersist=60",
        ]
        """Passed to ssh."""

        rsync_options: list[str] = ["-a"]
        """Passed to rsync in both directions."""

    # -- addressing ---------------------------------------------------------

    def roots(self) -> list[tuple[str, str]]:
        """``(local, remote)`` directory pairs, longest local prefix first."""
        pairs = []
        if self.config.storage:
            pairs.append((os.path.abspath(Storage.get().root()), self.config.storage))
        if self.config.directory:
            pairs.append((os.path.abspath(Project.get().path()), self.config.directory))
        return sorted(pairs, key=lambda pair: -len(pair[0]))

    def path(self, local: str) -> str:
        """This machine's path as the far side sees it."""
        local = os.path.abspath(local)
        for base, remote in self.roots():
            if local == base:
                return remote
            if local.startswith(base + os.sep):
                relative = os.path.relpath(local, base).replace(os.sep, "/")
                return posixpath.join(remote, relative)
        raise ValueError(
            f"'{local}' is not under any directory {self} maps to the far side "
            f"({', '.join(base for base, _ in self.roots()) or 'none configured'}); "
            "set the transport's `storage` and `directory`."
        )

    def ssh_command(self) -> list[str]:
        """The ssh invocation prefix, without a remote command."""
        return ["ssh", *self.config.options, self.config.host]

    def run(self, cmd, **kwargs):
        """Run ``cmd`` on the far side."""
        remote = " ".join(shlex.quote(str(argument)) for argument in cmd)
        return super().run([*self.ssh_command(), remote], **kwargs)

    def push(self, local: str, remote: str | None = None, include=None) -> str:
        """Mirror a local directory to the far side."""
        remote = remote or self.path(local)
        self.run(["mkdir", "-p", remote], check=True)
        self._rsync(
            _as_directory(local),
            f"{self.config.host}:{_as_directory(remote)}",
            # a running job's markers are newer than the copies here; a
            # re-push (a resubmission, say) must not roll them back
            options=["--update", *_filter(include)],
        )
        return remote

    def pull(self, remote: str, local: str, include=None) -> bool:
        """Mirror a directory back from the far side."""
        os.makedirs(local, exist_ok=True)
        result = self._rsync(
            f"{self.config.host}:{_as_directory(remote)}",
            _as_directory(local),
            options=_filter(include),
            check=False,
        )
        return result.returncode == 0

    def _rsync(self, source: str, destination: str, *, options=None, check=True):
        transport = " ".join(shlex.quote(part) for part in self.ssh_command()[:-1])
        return super().run(
            [
                "rsync",
                *self.config.rsync_options,
                *(options or []),
                "-e",
                transport,
                source,
                destination,
            ],
            check=check,
        )


def _filter(include) -> list[str]:
    """rsync arguments selecting only ``include``, or everything when empty."""
    if not include:
        return []
    options = []
    for pattern in include:
        options += ["--include", pattern]
    # recurse everywhere, take only the named files
    return ["--include", "*/", *options, "--exclude", "*"]


def _as_directory(path: str) -> str:
    """Trailing slash: rsync copies a directory's contents, not the directory."""
    return path if path.endswith("/") else path + "/"
