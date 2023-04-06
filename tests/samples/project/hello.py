from dataclasses import dataclass

from machinable import Experiment


class Hello(Experiment):
    @dataclass
    class Config:
        name: str = "World"

    def __call__(self):
        print(f"Hello {self.config.name}!")
