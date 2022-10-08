from machinable import Experiment

experiment = Experiment.singleton("montecarlo").execute()

print(
    f"We need {experiment.samples} samples to approximate"
    f" PI as {experiment.pi}"
    f" (< {experiment.config.acceptable_error} error)"
)
