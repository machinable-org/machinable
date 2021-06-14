from machinable import View


class TestView(View):
    def __init__(self, element) -> None:
        super().__init__(element)
        self._state = None

    def hello(self):
        return "there"

    def set_state(self, state):
        self._state = state

    def get_state(self):
        return self._state
