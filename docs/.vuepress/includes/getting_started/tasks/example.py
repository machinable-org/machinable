# tasks/example.py
import machinable as ml

task = ml.Task().component('optimization').repeat(3)

ml.execute(task, '~/results')
