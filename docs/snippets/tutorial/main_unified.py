from machinable import get

component = get("montecarlo")

component.launch()

print(
    f"We need {component.samples} samples to approximate"
    f" PI as {component.pi}"
    f" (< {component.config.acceptable_error} error)"
)
