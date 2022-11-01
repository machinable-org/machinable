from dummy import Dummy


class Line(Dummy):
    def on_instantiate(self):
        self.msg_set_during_instantiation = "hello world"
