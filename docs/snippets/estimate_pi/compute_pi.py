from machinable import get

experiment = get("montecarlo", {"samples": 150})

experiment.launch()

print(
    f"After {experiment.config.samples} samples, "
    f"PI is approximately {experiment.load_data('result.json')['pi']}."
)

print(
    f"Experiment <{experiment.launch.nickname}> "
    f"(finished {experiment.finished_at().humanize()}) "
    f"is stored at <{experiment.local_directory()}>"
)
