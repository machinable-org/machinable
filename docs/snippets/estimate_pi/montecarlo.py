from dataclasses import dataclass
from random import random

from machinable import Experiment


class EstimatePi(Experiment):
    @dataclass
    class Config:
        samples: int = 100

    def on_execute(self):
        count = 0
        for _ in range(self.config.samples):
            x, y = random(), random()
            count += int((x**2 + y**2) <= 1)
        pi = 4 * count / self.config.samples

        self.save_data(
            "result.json",
            {"count": count, "pi": pi},
        )
