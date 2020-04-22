import datetime
import time

from machinable import Component


class Timings(Component):
    def on_create(self):
        q = self.record.timing("avg")
        assert q > 0

        self.record["test"] = 1
        self.record.save(echo=True)

        self.record["test"] = 2
        self.record.save(echo=True)

        assert self.record.timing("avg") > 0
