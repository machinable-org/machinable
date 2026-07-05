"""MCP prompts: canned research workflows, surfaced as slash-commands."""

from __future__ import annotations

from typing import Any

from machinable.mcp.context import MCPContext


def register_prompts(mcp: Any, ctx: MCPContext) -> None:
    @mcp.prompt
    def investigate(hypothesis: str) -> str:
        """Frame a research question and drive it to a validated verdict end-to-end."""
        return (
            f"Investigate: {hypothesis}\n\n"
            "Work the machinable research loop. Read `guide://authoring`, "
            "`inferences://catalog`, and `examples://investigate` first.\n\n"
            "1. FRAME: restate the hypothesis as a comparison of two (or more) "
            "operands by a measurable quantity.\n"
            "2. LOCATE/SCAFFOLD: `list_modules`; if no aggregate interface lays out "
            "the sweep, `write_source` one (encode the experiment axis as "
            "`version_*` methods → `~versions`; a `launch()` that grids over seeds/"
            "scopes). Fix any import error the write returns. Get human approval.\n"
            "3. LAUNCH: `launch` each operand; poll `run_status` until cached.\n"
            "4. ASK: pick an inference from the catalog and call it (e.g. "
            "`outperforms`/`converges_faster`). If it returns a `needs` contract, "
            "`write_source` the named `<quantity>()` accessor on the operand "
            "(sieve `self.load_file(...)`), then re-run; it is now a cached no-op "
            "for unchanged operands.\n"
            "5. SURFACE: `scaffold-widget` a result widget bound to the verdict; "
            "`read_widget_result` to confirm the numbers; present the claim labeled "
            "by `~version` for the human to validate.\n\n"
            "Everything is content-addressed and incremental; follow-ups only run "
            "the new work."
        )

    @mcp.prompt
    def scaffold_aggregate(name: str, axis: str = "sgd,adam") -> str:
        """Emit an aggregate Interface skeleton (grid `launch()` + a quantity stub)."""
        tokens = [t.strip() for t in axis.split(",") if t.strip()]
        version_methods = "\n".join(
            f"    def version_{t}(self):\n"
            f"        return {{'optimizer': {t!r}}}  # the {t} arm of the axis"
            for t in tokens
        )
        cls = "".join(p.capitalize() for p in name.replace("-", "_").split("_"))
        return (
            f"Create `{name}.py` (an aggregate: it lays out the sweep in code and is "
            f"never materialized):\n\n```python\nfrom pydantic import BaseModel\n\n"
            f"from machinable import Interface, get\n\n\n"
            f"class {cls}(Interface):\n"
            f"    class Config(BaseModel):\n"
            f"        seeds: int = 10\n\n"
            f"    def launch(self):\n"
            f"        for seed in range(self.config.seeds):\n"
            f"            with get('machinable.scope', {{'seed': seed}}):\n"
            f"                get('train', [self.version()]).launch()\n\n"
            f"{version_methods}\n\n"
            f"    def loss(self):\n"
            f"        # one run's atomic quantity; sieve self.load_file(...)\n"
            f"        return self.load_file('loss.json')['final']\n```\n\n"
            f"Operands are then `get('{name}', ['~{tokens[0] if tokens else 'sgd'}'])` "
            f"etc. Adjust to this project's `train` interface and stored files."
        )

    @mcp.prompt
    def add_inference(name: str, requires: str = "scalar") -> str:
        """Emit a new `Inference` subclass skeleton (declare the shape + the test)."""
        cls = "".join(p.capitalize() for p in name.replace("-", "_").split("_"))
        return (
            f"Create `inference/{name}.py` (a shareable Inference: it brings its own "
            f"statistics):\n\n```python\nfrom pydantic import BaseModel\n\n"
            f"from machinable import Inference\n\n\n"
            f"class {cls}(Inference):\n"
            f"    requires = {requires!r}  # what one unit's quantity() yields\n\n"
            f"    class Config(BaseModel):\n"
            f"        quantity: str = 'objective'\n"
            f"        alpha: float = 0.05\n\n"
            f"    def test(self, samples):\n"
            f"        # samples: one list per operand (quantity() across its runs)\n"
            f"        a, b = samples\n"
            f"        # ... compute your statistic (bring scipy/statsmodels) ...\n"
            f"        return {{'claim': '...', 'holds': True, 'p_value': 0.0,\n"
            f"                'alpha': self.config.alpha}}\n```\n\n"
            f"Run it via `infer('{name}', operands, options)` or share it like any "
            f"interface."
        )

    @mcp.prompt
    def scaffold_widget(name: str, description: str = "") -> str:
        """Emit a starter Widget (`*.py` + a `render` skeleton) per `widget-sdk://docs`."""
        cls = "".join(p.capitalize() for p in name.replace("-", "_").split("_"))
        return (
            f"Read `widget-sdk://docs`, then create two files.\n\n"
            f"`{name}.py`:\n```python\nfrom machinable import Widget\n\n\n"
            f"class {cls}(Widget):\n"
            f'    """{description or name}"""\n\n'
            f"    _esm = '{name}.widget.js'\n\n"
            f"    def widget_state(self):\n"
            f"        return {{'value': self.marker('value', 0)}}\n```\n\n"
            f"`{name}.widget.js`:\n```javascript\n"
            f"export function render({{ model, el }}) {{\n"
            f"  el.textContent = 'value=' + model.get('value');\n"
            f"}}\n```\n\nThen `write_source` both and verify with `read_widget_result`."
        )

    @mcp.prompt
    def new_interface(name: str) -> str:
        """A generic Interface scaffold."""
        cls = "".join(p.capitalize() for p in name.replace("-", "_").split("_"))
        return (
            f"Create `{name}.py`:\n```python\nfrom pydantic import BaseModel\n\n"
            f"from machinable import Interface\n\n\n"
            f"class {cls}(Interface):\n"
            f"    class Config(BaseModel):\n"
            f"        param: int = 1\n\n"
            f"    def __call__(self):\n"
            f"        self.save_file('out.json', {{'param': self.config.param}})\n```"
        )
