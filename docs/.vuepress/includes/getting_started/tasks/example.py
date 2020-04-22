# tasks/example.py
import machinable as ml

task = ml.Experiment().components("optimization").repeat(3)

ml.execute(task, "~/results")
