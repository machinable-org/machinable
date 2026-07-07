"""An Interface that ships an anywidget-compatible frontend.

Renderable in Jupyter and consumable by any web host.

The frontend contract (``render({ model, el })`` + CSS) and the ``model`` object
are anywidget's; machinable's contribution is backing that model with a durable,
indexed, searchable Interface (config, storage, executions) and serving the same
widget to non-notebook hosts. See the Widgets guide in the machinable documentation.

``kind`` stays ``"Interface"`` (it is reserved and must resolve to a schema
class); widget-ness is a declared attribute, not a new kind.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

from omegaconf import OmegaConf

from machinable.errors import MachinableError
from machinable.interface import Interface


class Widget(Interface):
    # ES module exporting ``render({ model, el })`` (+ optional ``css``); inline
    # source or a path resolved relative to the defining module file.
    """An Interface that ships an anywidget-compatible frontend (``_esm``/``_css``)."""

    _esm: str | Path = ""
    # optional stylesheet (anywidget's ``_css``); inline source or sibling path.
    _css: str | Path | None = None
    # OPAQUE to machinable; consumers stash their manifest here and machinable
    # never parses it (e.g. captu: role/consumes/produces/capabilities).
    widget_meta: dict = {}

    def widget_state(self) -> dict:
        """Full initial synced state (the anywidget ``model``).

        Defaults to the resolved configuration as a **read-only** view. Config
        is immutable post-materialization, so interactive widgets that need
        mutable state should override :meth:`widget_update` and keep it
        themselves, via :meth:`save_file` (durable) or :meth:`mark`
        (in-memory, per session), and never mutate config.
        """
        if self.config is None:
            return {}
        resolved = OmegaConf.to_container(self.config, resolve=True)
        if not isinstance(resolved, dict):
            return {}
        return {k: v for k, v in resolved.items() if not str(k).startswith("_")}

    def widget_update(self, changes: dict) -> dict:
        """Apply client changes and return the normalized state.

        Rejects by default: config is immutable identity. Override to accept
        mutable state and keep it with :meth:`save_file` (durable) or
        :meth:`mark` (in-memory).
        """
        raise MachinableError(
            "This widget is read-only. Override widget_update() and keep "
            "mutable state via save_file() or mark()."
        )

    def widget_message(self, content: Any, buffers: list | None = None) -> Any:
        """Handle a custom ``model.send`` message; return an optional reply."""
        return None

    # ── server → client pushes (over the existing emit hook) ──────────────────

    def push_widget_change(self, changes: dict) -> None:
        """Push server-originated trait changes to connected widget clients."""
        self.emit({"__widget__": {"kind": "change", "changes": changes}})

    def push_widget_message(self, content: Any) -> None:
        """Push a server-originated custom message to connected widget clients."""
        self.emit({"__widget__": {"kind": "msg", "content": content}})

    # ── Jupyter rendering (anywidget) ─────────────────────────────────────────

    def _repr_mimebundle_(self, include=None, exclude=None, **kwargs):
        view = self._anywidget_view()
        return view._repr_mimebundle_(include=include, exclude=exclude, **kwargs)

    def _anywidget_view(self):
        try:
            import anywidget
            import traitlets
        except ImportError as ex:  # pragma: no cover - optional dependency
            raise ImportError(
                "anywidget is required for notebook rendering. "
                "Install with: pip install 'machinable[widgets]'"
            ) from ex

        state = self.widget_state()
        attrs: dict[str, Any] = {"_esm": widget_esm(type(self)) or ""}
        css = widget_css(type(self))
        if css is not None:
            attrs["_css"] = css
        for key, value in state.items():
            attrs[key] = traitlets.Any(value).tag(sync=True)

        view_cls = type("MachinableWidgetView", (anywidget.AnyWidget,), attrs)
        view = view_cls()

        def _on_change(change) -> None:
            try:
                self.widget_update({change["name"]: change["new"]})
            except Exception:
                # read-only widgets reject; keep the notebook view responsive
                pass

        for key in state:
            view.observe(_on_change, names=key)
        view.on_msg(lambda _w, content, buffers: self.widget_message(content, buffers))
        return view


# ── detection + asset resolution (no FastAPI dependency; usable in notebooks) ──


def is_widget(obj: Any) -> bool:
    """True when ``obj`` (class or instance) declares an anywidget frontend."""
    cls = obj if isinstance(obj, type) else type(obj)
    if isinstance(cls, type) and issubclass(cls, Widget):
        return bool(getattr(cls, "_esm", ""))
    return bool(getattr(cls, "_esm", "")) and (
        isinstance(cls, type) and issubclass(cls, Interface)
    )


def _resolve_asset(cls: type, value: str | Path | None) -> str | None:
    """Return asset source: inline string as-is, or read a sibling file.

    A string is treated as a sibling path when (and only when) it resolves to an
    existing file relative to the defining module; otherwise it is inline
    source. ``Path`` values are always read as files.
    """
    if value is None or value == "":
        return None
    module = sys.modules.get(cls.__module__)
    base = os.path.dirname(getattr(module, "__file__", "") or "")
    if isinstance(value, Path):
        path = value if value.is_absolute() else Path(base) / value
        try:
            return path.read_text(encoding="utf-8")
        except OSError:
            return None  # asset not built/available — callers degrade gracefully
    candidate = os.path.join(base, value)
    if "\n" not in value and len(value) < 4096 and os.path.isfile(candidate):
        with open(candidate, encoding="utf-8") as handle:
            return handle.read()
    return value


def widget_esm(cls: type) -> str | None:
    """The widget's ES module source, or ``None``."""
    return _resolve_asset(cls, getattr(cls, "_esm", None))


def widget_css(cls: type) -> str | None:
    """The widget's stylesheet source, or ``None``."""
    return _resolve_asset(cls, getattr(cls, "_css", None))
