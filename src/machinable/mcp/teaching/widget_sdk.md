# Widget contract

A `Widget` is an `Interface` that pairs Python state with a small ES module that
renders it. The MCP can verify a widget without a screenshot via `read_widget_result`
(it returns `widget_state()`).

## Python side

```python
from pydantic import BaseModel
from machinable import Widget

class Counter(Widget):
    class Config(BaseModel):
        start: int = 0

    _esm = "counter.widget.js"      # path to the ES module (or inline source)
    widget_meta = {"defaultSize": [400, 300]}   # optional render hints

    def widget_state(self) -> dict:             # -> the model the JS renders
        return {"value": self.marker("value", self.config.start)}

    def widget_update(self, changes: dict) -> dict:   # client edits -> new state
        if "value" in changes:
            self.mark("value", changes["value"])
        return self.widget_state()

    def widget_message(self, message) -> None:        # optional: client -> server events
        ...

    def notify(self):                                  # server -> client push
        self.push_widget_change({"value": 42})
```

- `widget_state()` returns the JSON-able model the front-end renders. Keep it flat.
- `widget_update(changes)` applies a client edit and returns the new state (persist via
  `mark`/`marker`; in-memory, per session).
- `push_widget_change(changes)` pushes a server-initiated update to connected clients.

## JavaScript side (the ES module)

```javascript
export function render({ model, el }) {
  const draw = () => { el.textContent = "value=" + model.get("value"); };
  model.on("change:value", draw);          // re-render on state change
  el.onclick = () => model.set({ value: model.get("value") + 1 });  // -> widget_update
  draw();
}
```

- `model.get(key)` reads `widget_state`; `model.set({...})` sends changes to
  `widget_update`. `model.on("change:<key>", fn)` subscribes to updates.
- Export a single `render({ model, el })`. The host mounts `el` and hot-reloads the ESM
  on `write_source`.

## Authoring loop

`write_source` the `*.py` (a `Widget` subclass + `_esm`) and the `*.widget.js`
(`render`) → machinable re-imports the module → `read_widget_result` confirms the
`widget_state` your code produced. Iterate against any error returned by the write.
