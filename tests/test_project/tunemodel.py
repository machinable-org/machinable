from machinable import Component


class TuneModel(Component):
    def on_execute(self):
        pass

    def on_execute_iteration(self, iteration: int):
        self.record["acc"] = iteration * 0.1

        if iteration > 10:
            return StopIteration
