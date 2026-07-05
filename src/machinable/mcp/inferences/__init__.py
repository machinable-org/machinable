"""Reference inferences for the machinable MCP.

Shareable `Inference` implementations (not core, since they bring their own scipy), each
resolvable by its module path via ``get("machinable.mcp.inferences.<name>", …)``.
``CATALOG`` drives both the ``inferences://catalog`` resource and the scientific MCP
tools (``outperforms``, ``beats_baseline``, ``ranks``, ``converges_faster``).
"""

from __future__ import annotations

from machinable.mcp.inferences.beats_baseline import BeatsBaseline
from machinable.mcp.inferences.converges_faster import ConvergesFaster
from machinable.mcp.inferences.outperforms import Outperforms
from machinable.mcp.inferences.ranks import Ranks

__all__ = ["Outperforms", "BeatsBaseline", "Ranks", "ConvergesFaster", "CATALOG"]

# name -> spec. `operands`: how many subjects .of(...) expects (None = variadic).
CATALOG: dict[str, dict] = {
    "outperforms": {
        "module": "machinable.mcp.inferences.outperforms",
        "requires": "scalar",
        "operands": 2,
        "summary": "Two-sample test: is operand A's quantity greater than B's?",
        "knobs": ["quantity", "test", "tail", "alpha"],
    },
    "beats_baseline": {
        "module": "machinable.mcp.inferences.beats_baseline",
        "requires": "scalar",
        "operands": 1,
        "summary": "One-sample t-test: does A's quantity beat a fixed baseline?",
        "knobs": ["quantity", "baseline", "tail", "alpha"],
    },
    "ranks": {
        "module": "machinable.mcp.inferences.ranks",
        "requires": "scalar",
        "operands": None,
        "summary": "Friedman omnibus over >=3 operands: do they differ, and how "
        "do they rank?",
        "knobs": ["quantity", "direction", "alpha"],
    },
    "converges_faster": {
        "module": "machinable.mcp.inferences.converges_faster",
        "requires": "series",
        "operands": 2,
        "summary": "Series inference: does A's curve reach its target sooner than "
        "B's (AUC / steps-to-threshold)?",
        "knobs": ["quantity", "summary", "threshold", "test", "alpha"],
    },
}
