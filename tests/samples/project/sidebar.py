from pydantic import BaseModel

from machinable import Widget


class Sidebar(Widget):
    """An interactive widget loading its ESM from a sibling file."""

    _esm = "sidebar.widget.js"

    class Config(BaseModel):
        title: str = "Untitled"

    def widget_state(self):
        return {"title": self.marker("title", default=self.config.title)}

    def widget_update(self, changes):
        if "title" in changes:
            self.mark("title", changes["title"])
        return self.widget_state()

    def notify(self):
        self.push_widget_change({"title": "pushed"})
        return "ok"
