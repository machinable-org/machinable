from dataclasses import dataclass

from machinable import Component


class Hello(Component):
    @dataclass
    class Config:
        name: str = "World"

    def __call__(self):
        print(f"Hello {self.config.name}!")

    def resources(self):
        print(self.execution.computed_resources(self))
