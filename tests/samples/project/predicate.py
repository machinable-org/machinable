from pydantic import BaseModel

from machinable import Execution


class PredicateComponent(Execution):
    class Config(BaseModel):
        a: int = 1
        ignore_: int = 2

    def __init__(self, *args, test_fingerprint=None, **kwargs):
        super().__init__(*args, **kwargs)
        self._fingerprint = test_fingerprint

    def compute_fingerprint(self):
        fingerprint = super().compute_fingerprint()

        if self._fingerprint:
            fingerprint.pop("config")
            fingerprint.update(self._fingerprint)

        return fingerprint

    def on_compute_predicate(self):
        return {"test": "a"}
