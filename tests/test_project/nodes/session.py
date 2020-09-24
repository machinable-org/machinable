from machinable import Component


def get_value():
    from machinable.session import get

    return get("config").value


class SessionTesting(Component):
    def on_create(self):
        if self.config.value != get_value():
            raise ValueError
