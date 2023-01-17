from machinable import Interface


class InterruptedLifecycle(Interface):
    def on_create(self):
        self.state = self.load_data("state.json", {"steps": 0})

    def on_execute(self):
        record = self.record()
        for step in range(self.state["steps"], 10):
            # some computatation
            record["step"] = step
            self.state["steps"] = step + 1
            record.save()

            if step == 2:
                raise RuntimeError("Interrupt 1")

            if step == 6:
                raise RuntimeError("Interrupt 2")

    def on_finish(self, success):
        self.save_data("state.json", self.state)
