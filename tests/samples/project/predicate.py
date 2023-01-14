from machinable import Experiment


class PredicateExperiment(Experiment):
    class Config:
        a: int = 1
        ignore_: int = 2

    def on_predicate(self):
        p = super().on_predicate()

        p["test"] = "a"

        return p
