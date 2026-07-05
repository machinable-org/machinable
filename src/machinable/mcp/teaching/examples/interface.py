"""examples://interface: the minimal idiomatic Interface.

An interface is a unit of research code: a pydantic Config + behaviour. Materializing
it (or `launch()`ing it) stores it content-addressed; `save_file` persists results.
"""

from pydantic import BaseModel

from machinable import Interface


class Train(Interface):
    class Config(BaseModel):
        lr: float = 0.1
        steps: int = 100

    def __call__(self):
        # toy "training": a result that depends on the config, saved for later
        loss = 1.0 / (1 + self.config.lr * self.config.steps)
        self.save_file("loss.json", {"final": loss})

    def loss(self):
        # a <quantity>() accessor: one run's atomic measurement (a scalar)
        return self.load_file("loss.json")["final"]
