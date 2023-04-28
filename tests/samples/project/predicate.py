from machinable import Component


class PredicateComponent(Component):
    class Config:
        a: int = 1
        ignore_: int = 2

    def on_compute_predicate(self):
        return {"test": "a"}
