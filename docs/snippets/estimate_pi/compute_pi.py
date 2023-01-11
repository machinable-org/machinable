from machinable import get

experiment = get("montecarlo", {"trials": 150})

experiment.launch()

print(
    f"After {experiment.config.trials} samples, "
    f"PI is approximately {experiment.load_data('result.json')['pi']}."
)

print(
    f"Experiment <{experiment.launch.nickname}> "
    f"(finished {experiment.finished_at().humanize()}) "
    f"is stored at <{experiment.local_directory()}>"
)
