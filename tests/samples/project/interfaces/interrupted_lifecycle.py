from machinable import Interface


class InterruptedLifecycle(Interface):
    def on_create(self):
        self.state = self.experiment.load_data("state.json", {"steps": 0})

    def on_execute(self):
        record = self.experiment.record()
        for step in range(self.state["steps"], 10):
            # some computatation
            record["step"] = step
            self.state["steps"] = step + 1
            record.save()

            if step == 2:
                raise RuntimeError("Interrupt 1")

            if step == 6:
                raise RuntimeError("Interrupt 2")

        return "done"

    def on_finish(self, success, result):
        self.experiment.save_data("state.json", self.state)
