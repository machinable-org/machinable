from machinable import get

experiment = get("montecarlo", {"samples": 150})
# Imports experiment in `montecarlo.py` with samples=150;
# if an experiment with this configuration exists, it
# is automatically reloaded.
experiment.launch()
# Executes the experiment unless it's already been computed
experiment.summary()
# >>> After 150 samples, PI is approximately 3.1466666666666665.
