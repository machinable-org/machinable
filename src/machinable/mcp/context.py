"""Project/auth binding and source operations for the machinable MCP.

The MCP calls machinable's Python API directly (within a ``Project`` context) rather
than over HTTP, so this holds the per-session config (project, token, read-only) and
the source-editing glue (path-safe writes + a re-import that surfaces import errors).
"""

from __future__ import annotations

import contextlib
import importlib
import os
import sys
from dataclasses import dataclass, field

DEFAULT_EXTENSIONS = {".py", ".js", ".json", ".yaml", ".yml", ".md", ".txt"}


@dataclass
class MCPContext:
    """Per-session binding: a project directory, optional token, read-only flag."""

    project_dir: str
    token: str | None = None
    read_only: bool = False
    extensions: set[str] = field(default_factory=lambda: set(DEFAULT_EXTENSIONS))

    def __post_init__(self) -> None:
        self.project_dir = os.path.realpath(self.project_dir)

    @contextlib.contextmanager
    def bind(self):
        """Connect the project so ``get``/``search``/``Index`` resolve against it.

        Pins the project at ``sys.path[0]`` (current-project-wins, same as ``Project``)
        so bare-name imports (discovery and the ``write_source`` re-import) resolve
        to *this* project even with stale tmp dirs left on the path.
        """
        from machinable import Project

        if self.project_dir in sys.path:
            sys.path.remove(self.project_dir)
        sys.path.insert(0, self.project_dir)
        with Project(self.project_dir):
            yield

    # --- source editing -------------------------------------------------------

    def _resolve(self, rel: str) -> str:
        # shared, symlink-safe containment (also rejects absolute/`..`/NUL paths)
        from machinable.utils import safe_path

        return safe_path(self.project_dir, rel)

    def _check_ext(self, rel: str) -> None:
        ext = os.path.splitext(rel)[1].lower()
        if ext not in self.extensions:
            raise ValueError(
                f"Extension {ext!r} not allowed (allowed: {sorted(self.extensions)})"
            )

    def _require_write(self) -> None:
        if self.read_only:
            raise PermissionError("MCP session is read-only; write tools are disabled")

    def read_source(self, rel: str) -> str:
        path = self._resolve(rel)
        if not os.path.isfile(path):
            raise FileNotFoundError(rel)
        with open(path, encoding="utf-8") as handle:
            return handle.read()

    def write_source(self, rel: str, content: str) -> str | None:
        """Write a source file; return any import/syntax error (else ``None``)."""
        self._require_write()
        self._check_ext(rel)
        path = self._resolve(rel)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(content)
        return self.reimport(rel)

    def move_source(self, src: str, dst: str) -> str | None:
        self._require_write()
        self._check_ext(dst)
        source, target = self._resolve(src), self._resolve(dst)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        os.replace(source, target)
        return self.reimport(dst)

    def delete_source(self, rel: str) -> None:
        self._require_write()
        path = self._resolve(rel)
        if os.path.isfile(path):
            os.remove(path)
        sys.modules.pop(self._module_name(rel), None)

    def reimport(self, rel: str) -> str | None:
        """Re-import the module for ``rel`` so a write self-reports its error."""
        if not rel.endswith(".py"):
            return None
        module = self._module_name(rel)
        importlib.invalidate_caches()
        sys.modules.pop(module, None)
        try:
            importlib.import_module(module)
            return None
        except Exception as ex:  # noqa: BLE001 - surfaced to the agent verbatim
            return f"{type(ex).__name__}: {ex}"

    @staticmethod
    def _module_name(rel: str) -> str:
        from machinable.utils import file_to_module

        return file_to_module(rel)

    def list_source(self) -> list[str]:
        from machinable.utils import skip_source_dir

        out: list[str] = []
        for root, dirs, files in os.walk(self.project_dir):
            dirs[:] = [d for d in dirs if not skip_source_dir(d)]
            for name in files:
                if os.path.splitext(name)[1].lower() not in self.extensions:
                    continue
                rel = os.path.relpath(os.path.join(root, name), self.project_dir)
                out.append(rel.replace("\\", "/"))
        return sorted(out)
