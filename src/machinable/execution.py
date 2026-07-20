"""Executions: the run-records and mechanisms that compute interfaces."""

import base64
import contextvars
import copy
import ctypes
import os
import sys
import threading
import time
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any, Literal, Self, cast

import arrow

from machinable import schema
from machinable.collection import ExecutionCollection, InterfaceCollection
from machinable.errors import (
    DispatchException,
    ExecutionFailed,
    ExecutionInterrupted,
)
from machinable.interface import (
    Interface,
    _connections,
    get_dump,
    get_inherits,
)
from machinable.storage import Storage
from machinable.types import (
    DatetimeType,
    TimestampType,
    VersionType,
)
from machinable.utils import (
    generate_seed,
    load_file,
    save_file,
    tee_output,
    update_dict,
)

if TYPE_CHECKING:
    from machinable.manifest import Manifest

_allowed_status = ["dispatched", "started", "heartbeat", "finished", "resumed"]


def _assert_allowed(status: str):
    if status not in _allowed_status:
        raise ValueError(f"Invalid status '{status}'; must be one of {_allowed_status}")


StatusType = Literal["dispatched", "started", "heartbeat", "finished", "resumed"]


@dataclass(frozen=True)
class ExecutionStatus:
    """A one-shot read of a run's status markers.

    Resolving them individually costs a directory lookup + file read *per* accessor;
    this reads the four ``*_at`` markers once (see :meth:`Execution.status_snapshot`)
    and derives every flag from them. The derived flags mirror the equivalent
    :class:`Execution` methods exactly.
    """

    started_at: DatetimeType | None = None
    resumed_at: DatetimeType | None = None
    heartbeat_at: DatetimeType | None = None
    finished_at: DatetimeType | None = None

    @property
    def is_started(self) -> bool:
        """True when ``started_at`` has been written."""
        return self.started_at is not None

    @property
    def is_finished(self) -> bool:
        """True when ``finished_at`` has been written."""
        return self.finished_at is not None

    @property
    def is_resumed(self) -> bool:
        """True when the run was resumed at least once."""
        return self.resumed_at is not None

    @property
    def is_active(self) -> bool:
        """True while the heartbeat is recent and the run unfinished."""
        if self.is_finished or self.heartbeat_at is None:
            return False
        return (arrow.now() - self.heartbeat_at).seconds < 30

    @property
    def is_live(self) -> bool:
        """True when active or finished."""
        return self.is_finished or self.is_active

    @property
    def is_incomplete(self) -> bool:
        """True when started but no longer live."""
        return self.is_started and not self.is_live


class Execution(Interface):
    """The mechanism that runs interfaces (locally, Slurm, MPI, ...).

    Its ``Config`` describes resources and mechanism; the interfaces to run arrive via
    :meth:`add`.
    """

    kind = "Execution"
    default = None
    # Whether dispatch-time *submits* the payload to an external supervisor
    # (Slurm, queues) rather than running it. `machinable dispatch` does not
    # detach a handoff execution: the scheduler owns the payload, and the
    # generated job re-enters via `machinable dispatch --foreground`.
    # (Distinct from `deferred()`, which defers dispatch until context exit.)
    handoff: bool = False

    def __init__(
        self,
        version: VersionType = None,
        resources: dict | None = None,
        seed: int | None = None,
        uses: None | Interface | list[Interface] = None,
        derived_from: Interface | None = None,
    ):
        super().__init__(version=version, uses=uses, derived_from=derived_from)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Execution(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            resources=resources,
            seed=seed,
            inherits=get_inherits(self),
        )
        self.__model__._dump = get_dump(self)
        self._interface_: Interface | None = None
        self._interfaces: list[Interface] = []
        self._resources = {}
        self._defer_dispatch = False

    def deferred(self, defer: bool = True):
        """Defer dispatch on context exit (to collect a grid without running it)."""
        self._defer_dispatch = defer
        return self

    @classmethod
    def collect(cls, executions) -> "ExecutionCollection":  # ty: ignore[invalid-method-override]
        """Wrap ``executions`` in an :class:`ExecutionCollection`."""
        return ExecutionCollection(executions)

    def compute_fingerprint(self) -> dict | None:
        """Always ``None``: an execution never reuses an existing run-record."""
        return None  # do not retrieve existing execution

    def on_compute_predicate(self) -> dict:
        """Resources plus the dispatch timestamp, when dispatching."""
        predicate: dict = {"resources": self._model.resources}
        started_at = getattr(self, "_dispatch_started_at", None)
        if started_at is not None:
            predicate["started_at"] = started_at
        return predicate

    def compute_predicate_key(self) -> str:
        """The dispatch timestamp when set, else the predicate hash."""
        predicate = self.compute_predicate()
        started_at = predicate.get("started_at")
        if started_at is not None:
            return str(started_at)
        return super().compute_predicate_key()

    @property
    def _model(self) -> schema.Execution:
        return cast(schema.Execution, self.__model__)

    @property
    def seed(self) -> int:
        """The run's random seed."""
        return self._model.seed

    @property
    def nickname(self) -> str:
        """Memorable per-run name (e.g. ``chocolate_mosquito``)."""
        return self._model.nickname

    @property
    def interfaces(self) -> InterfaceCollection:
        """The interfaces queued on this execution."""
        return InterfaceCollection(self._interfaces)

    @property
    def pending_executables(self) -> InterfaceCollection:
        """The queued interfaces that are not yet computed.

        The subset a submit-style execution backend (Slurm, MPI, ...) still
        needs to hand off.
        """
        return self.interfaces.filter(lambda x: not x.cached())

    @property
    def interface(self) -> Interface | None:
        """The Interface this Execution was created for.

        Its index parent, set at dispatch via ``parent_id=interface.uuid``.
        """
        if self.uuid is not None:
            from machinable.index import Index

            entry = Index.get().get_by_id(self.uuid)
            if entry is not None and entry.parent_id:
                return Interface.find_by_id(entry.parent_id)
        return getattr(self, "_interface_", None)

    def of(self, interface: Interface | None) -> Self:
        """Bind the interface this execution reports for."""
        self._interface_ = interface
        return self

    def on_provenance_attributes(self) -> dict:
        # history kind: carry extra() (seed/timing/resources), not config layers.
        """History facet: ``extra()`` (seed/timing/resources), no config layers."""
        attrs = dict(self.__model__.extra() or {})
        attrs.pop("_dump", None)
        return attrs

    def _capture_manifest(self) -> None:
        """Capture code/deps/environment provenance and record that this run.

        ``uses`` the resulting content-addressed Manifest node(s), one per
        tool the project resolves via ``on_resolve_manifests`` (git by
        default). Each is deduped by code state. The ``uses`` edge is
        persisted via ``relate()`` to both the index and the run's on-disk
        mirror, so it survives a reindex.
        """
        from machinable.interface import Interface
        from machinable.project import Project

        if not Project.is_connected():
            return
        # hooks live on the provider (interface/project.py), like
        # on_resolve_remotes and get_host_info
        for module in Project.get().provider().on_resolve_manifests() or []:
            try:
                manifest = cast("Manifest", Interface.make(module)).capture()
            except Exception:  # noqa: BLE001 - a tool failing to capture never breaks a run
                continue
            if not manifest.entries:
                continue
            manifest.materialize()
            # durable edge: index row + disk mirror (reindex reads the mirror).
            self.relate("uses", manifest)

    def on_add(self, interface: Interface):
        """Event when an interface is added."""

    def add(
        self,
        interface: Interface | list[Interface],
    ) -> Self:
        """Queue interface(s) to be computed by this execution."""
        if self.is_materialized():
            from machinable.errors import MachinableError

            raise MachinableError(
                f"{repr(self)} already exists and cannot be modified."
            )

        if isinstance(interface, list | tuple):
            for item in interface:
                self.add(cast(Interface, item))
            return self

        if interface in self._interfaces:
            return self

        self.on_add(interface)
        self._interfaces.append(interface)

        return self

    def materialize(
        self,
        parent_id: str | None = None,
        force: bool = False,
        record_id: str | None = None,
    ) -> Self:
        """Materialize the queued interfaces (and the container when standalone)."""
        for interface in self._interfaces:
            assert interface.config is not None

        for interface in self._interfaces:
            interface.materialize(parent_id=parent_id, force=force)

        # Queued runs materialise under their interface in dispatch_interface().
        if parent_id is not None or not self._interfaces:
            return super().materialize(
                parent_id=parent_id, force=force, record_id=record_id
            )
        return self

    def _apply_index_entry(self, entry) -> None:
        self._index_entry = entry  # source of the record's id.json header
        self.__model__.uuid = entry.record_id
        self.__model__.created_at_ns = entry.created_at_ns

    def canonicalize_resources(self, resources: dict) -> dict:
        """Normalize a resources dict (override in backends)."""
        return resources

    def computed_resources(self, interface: Interface | None = None) -> dict | None:
        """The effective resources for the bound interface.

        Computed once and persisted alongside the run.
        """
        if interface is not None:
            self.of(interface)

        cache_key = self._interface_.id if self._interface_ is not None else self.id

        if cache_key not in self._resources:
            # Persist per interface, not to one shared file. A submit-style
            # runner (Slurm, MPI) resolves resources for many interfaces on a
            # single Execution; a constant filename would hand every interface
            # the first one's resources. On a run-record (one interface) this is
            # simply that interface's file.
            cache_file = f"computed_resources.{cache_key or 'default'}.json"
            resources = self.load_file(cache_file, default=None)
            if resources is None:
                resources = self._compute_resources(self._interface_)
                self.save_file(cache_file, resources)

            self._resources[cache_key] = resources

        return self._resources[cache_key]

    def _compute_resources(self, interface: Interface | None = None) -> dict:
        default_resources = self.on_compute_default_resources(interface)
        model_resources = self._model.resources

        if not model_resources and default_resources is not None:
            return self.canonicalize_resources(default_resources)

        if model_resources and not default_resources:
            resources = copy.deepcopy(model_resources)
            resources.pop("_inherit_defaults", None)
            return self.canonicalize_resources(resources)

        if model_resources and default_resources:
            resources = copy.deepcopy(model_resources)
            if resources.pop("_inherit_defaults", True) is False:
                return self.canonicalize_resources(resources)

            defaults = self.canonicalize_resources(default_resources)
            update = self.canonicalize_resources(resources)

            defaults_ = copy.deepcopy(defaults)
            update_ = copy.deepcopy(update)

            removals = [
                k for k in update.keys() if isinstance(k, str) and k.startswith("#")
            ]
            for removal in removals:
                defaults_.pop(removal[1:], None)
                update_.pop(removal, None)

            return update_dict(defaults_, update_)

        return {}

    def dispatch(self) -> Self:
        """Run every queued interface that is not already cached."""
        if not self._interfaces:
            return self

        if not any(not interface.cached() for interface in self._interfaces):
            return self

        if self.on_before_dispatch() is False:
            return self

        for interface in self._interfaces:
            if not interface.is_materialized():
                interface.materialize()

        try:
            self.__call__()
            self.on_after_dispatch(success=True)
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_after_dispatch(success=False)
            raise ExecutionFailed("Execution failed") from _ex

        return self

    def __call__(self) -> None:
        """Run every queued interface (the default execution mechanism)."""
        for interface in self._interfaces:
            if not interface.cached():
                self.dispatch_interface(interface)

    def dispatch_interface(self, interface: Interface) -> None:
        """Establish a run-record for ``interface`` via the Index, then run it."""
        if not interface.is_materialized():
            interface.materialize()

        resume = self._resumable_run(interface)
        if resume is not None:
            # Deliberate resume: the interface's latest run-record (same runner
            # identity) is dispatched-or-started but unfinished, continue it in
            # place; a merely-dispatched record (serverless phase 1) starts, a
            # started one resumes.
            self.__model__.predicate = copy.deepcopy(resume.predicate)
            self._apply_index_entry(resume)
        else:
            self._apply_index_entry(self._mint_run_record(interface))
        self.to_directory(self.local_directory(create=True), relations=False)

        if resume is None:
            self._capture_manifest()

        self._run_payload(interface)

    def continue_run(self, interface: Interface) -> None:
        """Run ``interface`` into this existing run-record, in place and index-free."""
        if not self.is_materialized():
            raise RuntimeError(
                "continue_run requires an existing run-record (load it with "
                "Execution.from_directory); use dispatch_interface to create one"
            )
        self._run_payload(interface)

    def _run_payload(self, interface: Interface) -> None:
        """The execution lifecycle shared by dispatch_interface and continue_run."""
        from machinable.project import Project

        catalog_uuid = interface.uuid

        self.of(interface)
        self.computed_resources()

        # both the execution and the dispatched interface can veto (an MPI
        # component may know that only its controller rank should write)
        writes_meta_data = (
            self.on_write_meta_data() is not False
            and interface.on_write_meta_data() is not False
            and self.is_mounted()
        )
        _watch_stop = (
            threading.Event()
        )  # stops the best-effort cancel watcher (see below)
        # Heartbeat stop machinery, defined before the try so the finally can always
        # halt the self-rescheduling timer chain even if dispatch fails early.
        _beat_stop = threading.Event()
        _beat_timer: list[threading.Timer | None] = [None]

        def _stop_beat():
            _beat_stop.set()
            if _beat_timer[0] is not None:
                _beat_timer[0].cancel()

        try:
            interface.on_before_dispatch()
            self._invoke_seeding(interface)

            if writes_meta_data:
                status = "resumed" if self.is_started() else "started"
                self.update_status(status=status)
                self.save_file(
                    "host.json",
                    data=Project.get().provider().get_host_info(),
                )

            # capture the current context so heartbeat timer threads inherit the
            # ambient Project / Index connections (which are context-local).
            _beat_ctx = contextvars.copy_context()

            def beat():
                # Self-rescheduling chain; the stop event breaks it so a finished or
                # failed run cannot keep firing heartbeats forever (each tick would
                # otherwise schedule the next and leak a timer thread per run).
                if _beat_stop.is_set():
                    return
                t = threading.Timer(15, lambda: _beat_ctx.run(beat))
                t.daemon = True
                _beat_timer[0] = t
                t.start()
                interface.on_heartbeat()
                self.update_status(status="heartbeat")

            # heartbeats are liveness metadata: only the metadata-writing
            # process runs the chain (e.g. rank 0 under MPI), so the other
            # ranks never touch the filesystem
            if writes_meta_data:
                beat()

            # Best-effort cancellation: a watcher polls for a `cancelled`
            # marker in this run's directory (written by
            # POST /v1/executions/{uuid}/cancel) and injects
            # ExecutionInterrupted into the dispatch thread; no
            # execution-engine coupling, the cancel is just a file.
            # Cooperative: raised at the next Python bytecode boundary.
            _dispatch_tid = threading.get_ident()
            _cancel_marker = self.local_directory("cancelled")

            def watch_cancel() -> None:
                if _watch_stop.is_set():
                    return
                if os.path.exists(_cancel_marker):
                    ctypes.pythonapi.PyThreadState_SetAsyncExc(
                        ctypes.c_long(_dispatch_tid),
                        ctypes.py_object(ExecutionInterrupted),
                    )
                    return
                t = threading.Timer(1.0, watch_cancel)
                t.daemon = True
                t.start()

            # the 1s marker poll respects on_write_meta_data like every other
            # filesystem touch, so N MPI ranks do not stat the (shared)
            # filesystem N times a second; interrupting the metadata rank
            # tears down the job through the launcher
            if writes_meta_data:
                watch_cancel()

            # Do not use Execution.__call__ here as it would re-dispatch _interfaces.
            if (
                isinstance(interface, Execution)
                and interface.__class__.__call__ is Execution.__call__
            ):
                pass
            else:
                # capture the run's stdout/stderr into its output.log (thread-
                # scoped tee, so concurrent in-process runs never interleave);
                # script-based backends redirect at the shell level instead
                if writes_meta_data:
                    with tee_output(self.output_filepath()):
                        interface.__call__()
                else:
                    interface.__call__()

            # Send close sentinel so any server-side drain task can finish.
            if interface._emit_queue is not None and interface._emit_loop is not None:
                interface._emit_loop.call_soon_threadsafe(
                    interface._emit_queue.put_nowait, None
                )

            interface.on_success()
            interface.on_finish(success=True)

            _stop_beat()

            if writes_meta_data:
                self.update_status(status="finished")
                interface.cached(True, reason="finished", catalog_id=catalog_uuid)

            interface.on_after_dispatch(success=True)

        except BaseException as _ex:
            # Ensure drain task unblocks on failure.
            if interface._emit_queue is not None and interface._emit_loop is not None:
                interface._emit_loop.call_soon_threadsafe(
                    interface._emit_queue.put_nowait, None
                )
            interface.on_failure(exception=_ex)
            interface.on_finish(success=False)
            interface.on_after_dispatch(success=False)
            raise DispatchException(
                f"{interface.__class__.__name__} dispatch failed"
            ) from _ex
        finally:
            _watch_stop.set()
            _stop_beat()
            if writes_meta_data:
                for storage in Storage.connected():
                    storage.update(self)

    def _mint_run_record(self, interface: Interface):
        """Materialize a fresh run-record child of ``interface``.

        Each new dispatch creates one; a prior runner uuid is only ever
        continued via :meth:`_resumable_run`. Returns the IndexEntry.
        """
        from machinable.index import Index, materialize_keys_from_model

        self._dispatch_started_at = datetime.now(UTC).strftime("%Y-%m-%d_%H%M%S")
        try:
            self.__model__.uuid = None
            keys = materialize_keys_from_model(
                self.__model__,
                parent_id=interface.uuid,
                identity_key=self.catalog_identity_key(),
                predicate=self.predicate,
                predicate_key=self.predicate_key,
                record_id=None,
            )
            response = Index.get().materialize(keys, force=True)
        finally:
            self._dispatch_started_at = None
        self.__model__.predicate = copy.deepcopy(response.entry.predicate)
        return response.entry

    def _resumable_run(self, interface: Interface):
        """The interface's latest continuable run-record, or ``None``.

        Continuable means dispatched or started but not finished, and created
        by the same runner identity (a differently configured Execution starts
        its own run-record
        instead of continuing a foreign one). A merely-dispatched record is the
        serverless phase-1 "pending" state; the payload continues it and marks
        it "started"; a started one resumes. Returns the IndexEntry to
        continue, or ``None`` to mint a new run-record. Note: markers cannot
        distinguish a very recently failed run from a live one, so no liveness
        guard is applied; dispatching the same interface concurrently from two
        processes is unsupported either way.
        """
        from machinable.api.models import FindRequest
        from machinable.index import Index
        from machinable.utils import load_file, sanitize_filename, uri_to_path

        index = Index.get()
        latest = index.find(
            FindRequest(
                parent_id=interface.uuid,
                kind="Execution",
                include_hidden=True,
                limit=1,
            )
        )
        if not latest.items:
            return None
        entry = index.get_by_id(latest.items[0].record_id)
        if entry is None:
            return None
        if entry.identity_key != sanitize_filename(
            self.catalog_identity_key(), max_len=128
        ):
            return None
        try:
            directory = uri_to_path(entry.local_uri or entry.storage_uri)
        except ValueError:
            return None
        if not os.path.isdir(directory):
            return None
        if (
            load_file([directory, "started_at"], None) is None
            and load_file([directory, "dispatched_at"], None) is None
        ):
            return None
        if load_file([directory, "finished_at"], None) is not None:
            return None
        return entry

    def prepare_dispatch(self, interface: Interface):
        """Phase 1 of serverless dispatch.

        Materialize (or find continuable) the run-record for ``interface``,
        persist it, and mark it ``dispatched``, synchronously, before any
        payload supervision. The payload later continues exactly this record as
        an in-process/serverless payload via :meth:`dispatch_interface` (which
        finds it through :meth:`_resumable_run`), a handed-off index-free
        payload via :meth:`continue_run` (which is handed the record's
        directory directly). Returns the run's IndexEntry.
        """
        if not interface.is_materialized():
            interface.materialize()
        entry = self._resumable_run(interface)
        minted = entry is None
        if minted:
            entry = self._mint_run_record(interface)
        else:
            self.__model__.predicate = copy.deepcopy(entry.predicate)
        self._apply_index_entry(entry)
        self.to_directory(self.local_directory(create=True), relations=False)
        if minted:
            self._capture_manifest()
        self.of(interface)
        self.update_status(status="dispatched")
        return entry

    def _invoke_seeding(self, interface: Interface) -> None:
        # duck-typed: plain interfaces carry neither hook nor seed
        target = cast("Any", interface)
        if hasattr(interface, "on_seeding"):
            target.on_seeding()
        elif hasattr(interface, "seed"):
            import random

            random.seed(target.seed)

    def dispatch_code(
        self,
        interface: Interface,
        inline: bool = True,
        project_directory: str | None = None,
        python: str | None = None,
        interface_directory: str | None = None,
        run_record_directory: str | None = None,
    ) -> str | None:
        """Python code (or an inline shell command) re-running ``interface``."""
        from machinable.project import Project
        from machinable.utils import uri_to_path

        if project_directory is None:
            project_directory = Project.get().path()
        if python is None:
            python = sys.executable
        lines = ["from machinable import Project, Execution, Interface"]
        # embed paths via repr so backslashes (Windows) and quotes/spaces are escaped
        # into a valid Python string literal
        lines.append(f"Project({project_directory!r}).__enter__()")
        for kind, connected in list(_connections().items()):
            # The payload is index-free as it reconstructs the interface and its
            # run-record straight from their directories, so it needs neither
            # the Storage nor the Index
            if kind in ["Project", "Execution", "Storage", "Index"]:
                continue
            for connected_interface in connected:
                # repr() escapes the JSON's quotes AND backslashes (Windows paths
                # in the serialized config)
                jn = connected_interface.as_json()
                lines.append(f"Interface.from_json({jn!r}).__enter__()")
        if not interface.is_materialized():
            interface_directory = os.path.abspath(
                os.path.join(project_directory, ".machinable", "nonexistent")
            )
            lines.append(
                "interface__ = "
                f"{interface.kind}.from_directory({interface_directory!r})"
            )
            lines.append("Execution().dispatch_interface(interface__)")
        else:
            if run_record_directory is None:
                entry = Execution().prepare_dispatch(interface)
                run_record_directory = os.path.abspath(
                    uri_to_path(entry.local_uri or entry.storage_uri)
                )
            if interface_directory is None:
                interface_directory = os.path.abspath(interface.local_directory())
            lines.append(
                "interface__ = "
                f"{interface.kind}.from_directory({interface_directory!r})"
            )
            lines.append(f"run__ = Execution.from_directory({run_record_directory!r})")
            lines.append("run__.continue_run(interface__)")

        if inline:
            # base64-wrap the program so the shell command carries no quotes or
            # backslashes of its own, robust across shells and OSes (a raw
            # `python -c "…"` breaks on the embedded JSON's quotes / Windows paths).
            # Inline output targets a POSIX shell (the double-quote wrapper); a Windows
            # interpreter path is forward-slashed + single-quoted so a bash on Windows
            # (git-bash) doesn't strip the backslashes as escapes.
            payload = base64.b64encode("\n".join(lines).encode()).decode()
            python_arg = python.replace("\\", "/")
            return (
                f"'{python_arg}' -c "
                f"\"import base64;exec(base64.b64decode('{payload}').decode())\""
            )

        return "\n".join(lines)

    @property
    def host_info(self) -> dict | None:
        """Host metadata recorded at dispatch, if any."""
        return self.load_file("host.json", None)

    def output_filepath(self) -> str:
        """Path of the run's ``output.log``."""
        return self.local_directory("output.log")

    def output(
        self,
        incremental: bool = False,
    ) -> str | None:
        """Returns the output log."""
        if not self.is_mounted():
            return None

        p = "output.log"

        if incremental:
            read_length = self._cache.get(f"{p}.read_length", 0)
            output = self.load_file(p, None)
            if output is None:
                return None
            if read_length >= len(output):
                return ""
            self._cache[f"{p}.read_length"] = len(output)
            return output[read_length:]

        if p in self._cache:
            return self._cache[p]

        output = self.load_file(p, None)

        if self.is_finished() and output is not None:
            self._cache[p] = output

        return output

    def stream_output(
        self,
        refresh_every: int | float = 1,
        stream=print,
    ):
        """Follow the run's output log until it finishes."""
        try:
            while not self.is_started() or self.is_active():
                output = self.output(incremental=True)
                if output:
                    stream(output)
                time.sleep(refresh_every)
        except KeyboardInterrupt:
            pass

    def update_status(
        self,
        status: StatusType = "heartbeat",
        timestamp: TimestampType | None = None,
    ) -> TimestampType:
        """Write a status marker.

        One of ``dispatched``/``started``/``heartbeat``/``finished``/``resumed``.
        """
        _assert_allowed(status)

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        multiple = status == "resumed"

        save_file(
            self.local_directory(f"{status}_at"),
            str(timestamp) + ("\n" if multiple else ""),
            mode="a" if multiple else "w",
        )
        # status markers are official record writes → bump updated_at
        self.touch()

        return timestamp

    def retrieve_status(
        self,
        status: StatusType = "heartbeat",
    ) -> DatetimeType | None:
        """Read one status marker as a datetime, or ``None`` if unwritten."""
        _assert_allowed(status)

        status_value = self.load_file(f"{status}_at", default=None)
        if status_value is None:
            return None

        multiple = status == "resumed"

        if multiple:
            status_value = status_value.strip("\n").split("\n")[-1]

        try:
            return arrow.get(status_value)
        except arrow.ParserError:
            return None

    def status_snapshot(self) -> ExecutionStatus:
        """Read all four status markers in one pass.

        Returns an :class:`ExecutionStatus` deriving every flag. Prefer this
        over the individual accessors when several are needed (e.g. when
        serializing a run).
        """
        # one directory resolution + one read per marker; the individual
        # accessors would re-resolve the directory on every call
        if not self.is_mounted():
            return ExecutionStatus()
        directory = self.local_directory()

        def _read(status: str) -> DatetimeType | None:
            value = load_file([directory, f"{status}_at"], default=None)
            if value is None:
                return None
            if status == "resumed":
                value = value.strip("\n").split("\n")[-1]
            try:
                return arrow.get(value)
            except arrow.ParserError:
                return None

        return ExecutionStatus(
            started_at=_read("started"),
            resumed_at=_read("resumed"),
            heartbeat_at=_read("heartbeat"),
            finished_at=_read("finished"),
        )

    def started_at(self) -> DatetimeType | None:
        """Returns the starting time."""
        if not self.is_mounted():
            return None
        return self.retrieve_status("started")

    def resumed_at(self) -> DatetimeType | None:
        """Returns the resumed time."""
        if not self.is_mounted():
            return None
        return self.retrieve_status("resumed")

    def heartbeat_at(self):
        """Returns the last heartbeat time."""
        if not self.is_mounted():
            return None
        return self.retrieve_status("heartbeat")

    def finished_at(self):
        """Returns the finishing time."""
        if not self.is_mounted():
            return None
        return self.retrieve_status("finished")

    def is_finished(self):
        """True if finishing time has been written."""
        return bool(self.finished_at())

    def is_started(self):
        """True if starting time has been written."""
        return bool(self.started_at())

    def is_resumed(self):
        """True if resumed time has been written."""
        return bool(self.resumed_at())

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago."""
        if self.is_finished():
            return False

        if not (heartbeat := self.heartbeat_at()):
            return False

        return (arrow.now() - heartbeat).seconds < 30

    def is_live(self):
        """True if active or finished."""
        return self.is_finished() or self.is_active()

    def is_incomplete(self):
        """Shorthand for is_started() and not is_live()."""
        return self.is_started() and not self.is_live()

    def on_before_dispatch(self) -> bool | None:
        """Hook: return False to abort dispatch of this execution."""

    def on_seeding(self):
        """Hook: default seeds random with self.seed."""
        import random

        random.seed(self.seed)

    # on_success / on_failure / on_finish / on_after_dispatch / on_heartbeat
    # are inherited from Interface (the dispatch lifecycle contract lives on
    # the base class).

    def on_write_meta_data(self) -> bool | None:
        """Return False to prevent writing of meta-data."""

    def on_compute_default_resources(self, interface: Interface | None) -> dict | None:
        """Event triggered to compute default resources."""

    def __iter__(self):
        yield from self._interfaces

    def __exit__(self, *args):
        if len(args) == 3 and any(map(lambda x: x is not None, args)):
            super().__exit__()
        elif self._defer_dispatch:
            super().__exit__()
        else:
            try:
                self.dispatch()
            finally:
                super().__exit__()
