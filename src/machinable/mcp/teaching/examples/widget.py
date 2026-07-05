"""examples://widget: surface a result for the human to validate.

A Widget pairs `widget_state()` (the model) with an ES module that renders it. Bind it
to a verdict interface so a human sees the claim as a figure. See `widget-sdk://docs`.
"""

from pydantic import BaseModel

from machinable import Widget


class Verdict(Widget):
    """Renders an inference verdict (claim + p-value)."""

    class Config(BaseModel):
        verdict_uuid: str = ""  # the inference interface whose verdict.json to show

    _esm = "verdict.widget.js"
    widget_meta = {"defaultSize": [480, 200]}

    def widget_state(self):
        from machinable import get

        verdict = {}
        if self.config.verdict_uuid:
            verdict = get.by_id(self.config.verdict_uuid).verdict() or {}
        return {
            "claim": verdict.get("claim", "—"),
            "holds": verdict.get("holds"),
            "p_value": verdict.get("p_value"),
        }
