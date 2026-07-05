from machinable import Interface


class Emitter(Interface):
    def progress(self):
        for step in range(3):
            self.emit({"step": step})
        return "done"
