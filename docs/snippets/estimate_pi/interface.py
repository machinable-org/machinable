from machinable import get

component = get("montecarlo", {"samples": 150})
# Imports component in `montecarlo.py` with samples=150;
# if an component with this configuration exists, it
# is automatically reloaded.
component.launch()
# Executes the component unless it's already been computed
component.summary()
# >>> After 150 samples, PI is approximately 3.1466666666666665.
