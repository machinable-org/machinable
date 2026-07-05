from pydantic import BaseModel

from machinable import Widget


class Chart(Widget):
    """A minimal read-only value display widget (inline ESM/CSS)."""

    _esm = (
        "export function render({ model, el }) {\n"
        "  el.textContent = 'value=' + model.get('value');\n"
        "}\n"
    )
    _css = ".machinable-chart { color: teal; }"
    widget_meta = {"defaultSize": [400, 300]}

    class Config(BaseModel):
        value: int = 42
