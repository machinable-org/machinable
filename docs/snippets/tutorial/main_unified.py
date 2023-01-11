from machinable import get

experiment = get("montecarlo")

experiment.launch()

print(
    f"We need {experiment.samples} samples to approximate"
    f" PI as {experiment.pi}"
    f" (< {experiment.config.acceptable_error} error)"
)
