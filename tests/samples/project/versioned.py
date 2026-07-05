from pydantic import BaseModel

from machinable import Interface


class Versioned(Interface):
    """An interface exposing version-method presets (the ~version vocabulary)."""

    class Config(BaseModel):
        lr: float = 0.1
        layers: int = 2

    def version_large(self):
        """A large preset."""
        return {"layers": 12}

    def version_lr(self, value=0.01):
        return {"lr": value}
