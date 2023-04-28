from machinable import Element


class Basic(Element):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._state = None

    def hello(self):
        return "there"

    def set_state(self, state):
        self._state = state

    def get_state(self):
        return self._state
