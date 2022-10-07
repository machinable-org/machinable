from dataclasses import dataclass

from machinable import Experiment


class Hello(Experiment):
    @dataclass
    class Config:
        name: str = "World"

    def on_execute(self):
        print(f"Hello {self.config.name}!")
