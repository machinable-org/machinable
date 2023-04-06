import math
from dataclasses import dataclass
from random import random

from machinable import Experiment


class EstimatePi(Experiment):
    @dataclass
    class Config:
        acceptable_error: float = 0.01

    @property
    def result(self):
        return self.load_data("result.json", default={"samples": 0, "pi": 0})

    @property
    def pi(self):
        return self.result["pi"]

    @property
    def samples(self):
        return self.result["samples"]

    def __call__(self):
        samples = 10
        while abs(math.pi - self.pi) > self.config.acceptable_error:
            # monte-carlo simulation
            count = 0
            for _ in range(samples):
                x, y = random(), random()
                count += int((x**2 + y**2) <= 1)
            pi = 4 * count / samples

            self.save_data(
                "result.json",
                {"samples": samples, "pi": pi},
            )

            # double the amount of samples
            # in case we have to try again
            samples *= 2
