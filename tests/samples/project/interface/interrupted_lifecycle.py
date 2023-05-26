from machinable import Component


class InterruptedLifecycle(Component):
    def __call__(self):
        self.local_directory("data", create=True)
        self.state = self.load_file("data/state.json", {"steps": 0})

        for step in range(self.state["steps"], 10):
            self.state["steps"] = step + 1

            if step == 2:
                raise RuntimeError("Interrupt 1")

            if step == 6:
                raise RuntimeError("Interrupt 2")

    def on_finish(self, success):
        self.save_file("data/state.json", self.state)
