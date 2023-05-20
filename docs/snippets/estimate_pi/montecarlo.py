from dataclasses import dataclass
from random import random

from machinable import Component


class EstimatePi(Component):
    @dataclass
    class Config:
        samples: int = 100

    def __call__(self):
        count = 0
        for _ in range(self.config.samples):
            x, y = random(), random()
            count += int((x**2 + y**2) <= 1)
        pi = 4 * count / self.config.samples

        self.save_file(
            "result.json",
            {"count": count, "pi": pi},
        )

    def summary(self):
        if self.is_finished():
            print(
                f"After {self.config.samples} samples, "
                f"PI is approximately {self.load_file('result.json')['pi']}."
            )
