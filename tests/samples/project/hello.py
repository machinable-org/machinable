from pydantic import BaseModel

from machinable import Execution


class Hello(Execution):
    class Config(BaseModel):
        name: str = "World"

    def __call__(self):
        print(f"Hello {self.config.name}!")

    def resources(self):
        print(self.execution.computed_resources(self))

    def greet(self, name="you", repeat=1):
        return " ".join([f"Hi {name}!"] * repeat)
