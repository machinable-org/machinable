"""The ambient connection stack must be context-local so a server can hold
different Project contexts per request/thread concurrently without cross-talk."""

import contextvars
import os
import threading

from machinable import Project
from machinable.interface import reset_connections


def _norm(path: str) -> str:
    return os.path.normpath(os.path.abspath(os.path.expanduser(path)))


def test_connections_isolated_across_threads(tmp_path):
    reset_connections()
    dir_a = str(tmp_path / "a")
    dir_b = str(tmp_path / "b")
    results: dict[str, str] = {}
    errors: list = []
    # both threads enter their Project, then synchronize so both are "inside"
    # simultaneously before reading Project.get() — a process-global stack would
    # return whichever was pushed last to *both* threads.
    enter = threading.Barrier(2, timeout=5)

    def worker(name: str, directory: str) -> None:
        try:
            with Project(directory):
                enter.wait()
                results[name] = Project.get().config.directory
                enter.wait()
        except Exception as ex:  # noqa: BLE001
            errors.append((name, repr(ex)))

    t1 = threading.Thread(target=worker, args=("a", dir_a))
    t2 = threading.Thread(target=worker, args=("b", dir_b))
    t1.start()
    t2.start()
    t1.join(10)
    t2.join(10)

    assert not errors, errors
    assert results["a"] == _norm(dir_a)
    assert results["b"] == _norm(dir_b)
    assert results["a"] != results["b"]
    # the main thread never entered a Project
    assert not Project.is_connected()


def test_connections_propagate_via_copy_context(tmp_path):
    reset_connections()
    directory = str(tmp_path / "p")
    seen: dict[str, object] = {}

    with Project(directory):
        # a thread that runs inside a copied context inherits the connection
        def child_with() -> None:
            seen["with"] = (
                Project.get().config.directory if Project.is_connected() else None
            )

        ctx = contextvars.copy_context()
        t = threading.Thread(target=lambda: ctx.run(child_with))
        t.start()
        t.join(5)

        # a plain thread starts with a fresh (empty) stack — full isolation
        def child_without() -> None:
            seen["without"] = Project.is_connected()

        t2 = threading.Thread(target=child_without)
        t2.start()
        t2.join(5)

    assert seen["with"] == _norm(directory)
    assert seen["without"] is False
