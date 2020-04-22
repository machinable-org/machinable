from machinable import Component


class ExceptionsComponent(Component):
    def on_create(self):
        raise ValueError("Hihihi ...")

    def on_execute(self):
        raise TypeError("Sorry, but no")

    def on_execute_iteration(self, iteration: int):
        raise StopIteration("Don't let anything stop you")
