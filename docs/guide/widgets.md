# Widgets

A [`Widget`](/reference/python/widget) is an interface that pairs Python state with a small
ES module that renders it: a way to surface a result (a figure, a control, a verdict)
for a human to see and validate. Widgets are how an [inference](./inference.md) result
becomes something you can look at.

## The Python side

A `Widget` exposes its model through `widget_state()`, applies client edits through
`widget_update()`, and points at an ES module via `_esm`:

```python
from pydantic import BaseModel

from machinable import Widget


class Counter(Widget):
    class Config(BaseModel):
        start: int = 0

    _esm = "counter.widget.js"            # path to the ES module (or inline source)
    widget_meta = {"defaultSize": [400, 300]}

    def widget_state(self) -> dict:        # the model the JS renders
        return {"value": self.marker("value", self.config.start)}

    def widget_update(self, changes: dict) -> dict:   # a client edit -> new state
        if "value" in changes:
            self.mark("value", changes["value"])
        return self.widget_state()

    def notify(self):                      # push a server-initiated update
        self.push_widget_change({"value": 42})
```

## The JavaScript side

Export a single `render({ model, el })`. Read state with `model.get(key)`, send edits
with `model.set({...})` (which calls `widget_update`), and subscribe with
`model.on("change:<key>", fn)`:

```javascript
export function render({ model, el }) {
  const draw = () => { el.textContent = "value=" + model.get("value"); };
  model.on("change:value", draw);
  el.onclick = () => model.set({ value: model.get("value") + 1 });
  draw();
}
```

## The authoring loop

1. Write the `*.py` (a `Widget` subclass + `_esm`) and the `*.widget.js` (`render`).
2. The host re-imports the module (no restart) and hot-reloads the ES module.
3. Verify the model your code produced with `widget_state()`, structurally, without a
   screenshot.

Because a widget's state is just a method, an agent can check its work by reading
`widget_state()` directly, which is exactly what the MCP `read_widget_result` tool does.
See [Agents & MCP](/mcp/overview).
