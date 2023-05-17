from machinable import Component


class InterruptedLifecycle(Component):
    def on_create(self):
        self.state = self.load_data("state.json", {"steps": 0})

    def __call__(self):
        for step in range(self.state["steps"], 10):
            self.state["steps"] = step + 1

            if step == 2:
                raise RuntimeError("Interrupt 1")

            if step == 6:
                raise RuntimeError("Interrupt 2")

    def on_finish(self, success):
        self.save_data("state.json", self.state)
