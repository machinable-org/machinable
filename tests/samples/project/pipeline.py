from typing import Literal

from pydantic import BaseModel

from machinable import Interface


class Optimizer(BaseModel):
    kind: Literal["sgd", "adam"] = "sgd"
    lr: float = 0.1


class Stage(BaseModel):
    name: str = "fit"
    epochs: int = 1


class Pipeline(Interface):
    """A pipeline with nested config models (rich schema reflection)."""

    class Config(BaseModel):
        optimizer: Optimizer = Optimizer()
        stages: list[Stage] = []
        note: str | None = None

    def version_fast(self, epochs: int = 1):
        """One quick stage."""
        return {"stages": [{"name": "fit", "epochs": epochs}]}

    def version_precise(self, lr: float = 0.01):
        """Lower learning rate."""
        return {"optimizer": {"lr": lr}}

    def __call__(self):
        self.save_file("done.json", {"stages": len(self.config.stages)})
