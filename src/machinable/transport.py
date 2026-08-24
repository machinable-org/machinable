"""Transports: where an execution's work happens."""

from __future__ import annotations

import contextlib
import os
import subprocess
import time
from typing import TYPE_CHECKING, cast

from machinable.interface import Interface

if TYPE_CHECKING:
    from collections.abc import Sequence

STATUS_FILES = ("*_at", "output.log", "job.out")


class Transport(Interface):
    """Transports an interface execution."""

    kind = "Transport"
    default = None

    def path(self, local: str) -> str:
        """A local path as the far side will see it."""
        return os.path.abspath(local)

    def run(self, cmd: Sequence[str], **kwargs):
        """Run a command on the far side, returning a ``CompletedProcess``."""
        kwargs.setdefault("capture_output", True)
        kwargs.setdefault("text", True)
        return subprocess.run(cmd, **kwargs)  # noqa: S603

    def push(
        self,
        local: str,
        remote: str | None = None,
        include: Sequence[str] | None = None,
    ) -> str:
        """Copy a local directory to where the far side expects it."""
        return remote or self.path(local)

    def pull(
        self, remote: str, local: str, include: Sequence[str] | None = None
    ) -> bool:
        """Copy a directory back from the far side; ``True`` when it arrived."""
        return os.path.abspath(remote) == os.path.abspath(local)

    def sync(self, record: Interface, *, status_only: bool = False) -> bool:
        """Bring the far side's copy of ``record``'s directory home."""
        local = record.local_directory()
        remote = self.path(local)
        if os.path.abspath(remote) == os.path.abspath(local):
            return True
        arrived = self.pull(
            remote, local, include=STATUS_FILES if status_only else None
        )
        if arrived:
            _write_through_updated_at(record)
        return arrived

    def wait(
        self,
        record: Interface,
        *,
        interval: float | None = None,
        timeout: float | None = None,
        status_only: bool = True,
    ):
        """Sync until ``record``'s latest run reaches a terminal state."""
        from machinable.execution import HEARTBEAT_INTERVAL, ExecutionStatus

        if interval is None:
            interval = HEARTBEAT_INTERVAL
        deadline = None if timeout is None else time.monotonic() + timeout
        while True:
            self.sync(record, status_only=status_only)
            run = record.execution if record.is_mounted() else None
            status = run.status_snapshot() if run is not None else ExecutionStatus()
            if status.is_finished or status.is_incomplete:
                return status
            if deadline is not None and time.monotonic() >= deadline:
                return status
            time.sleep(interval)


def _write_through_updated_at(record: Interface) -> None:
    """Point the index at the ``updated_at`` the far side wrote."""
    from machinable.format import read_updated_at_ns
    from machinable.index import Index

    index = Index.get()
    records = [record]
    with contextlib.suppress(Exception):
        records += [run for run in record.executions if run.uuid is not None]
    for item in records:
        with contextlib.suppress(Exception):
            updated_at_ns = read_updated_at_ns(item.local_directory())
            if updated_at_ns is not None:
                index.set_updated_at(cast(str, item.uuid), updated_at_ns)
