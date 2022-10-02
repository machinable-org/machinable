from machinable import Experiment

experiment = Experiment.singleton("montecarlo", {"trials": 150})

experiment.execute()

print(
    f"After {experiment.config.trials} samples, "
    f"PI is approximately {experiment.load_data('result.json')['pi']}."
)

print(
    f"Experiment <{experiment.nickname}> "
    f"(finished {experiment.finished_at().humanize()}) "
    f"is stored at <{experiment.local_directory()}>"
)
