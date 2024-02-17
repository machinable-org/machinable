from machinable import Component
from pydantic import BaseModel, Field


class InSession(Component):
    class Config(BaseModel):
        a: int = Field(1, title="test")
        b: float = 0.1

    def __call__(self):
        print(self.config)
