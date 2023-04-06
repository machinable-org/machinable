from dataclasses import dataclass

from machinable import Experiment


class EstimateGravity(Experiment):
    """An experiment to estimate gravity"""

    @dataclass
    class Config:
        time_dilation: float = 1.0
        verbose: bool = True

    def __call__(self):
        height = 52
        time = 0.3 * self.config.time_dilation
        if self.config.verbose:
            print(f"Assuming height of {height} and time of {time}")
        g = 2 * height / time**2
        print("The gravity on the exoplanet is: ", g)
