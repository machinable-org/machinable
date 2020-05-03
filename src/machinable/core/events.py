import threading
import typing as T

from observable import Observable


class Events(Observable):
    def __init__(self) -> None:
        super().__init__()
        self._heartbeat = None

    def trigger(self, event: str, *args: T.Any, **kw: T.Any) -> list:
        # upstream pending on issue https://github.com/timofurrer/observable/issues/17
        """Triggers all handlers which are subscribed to an event.
        Returns True when there were callbacks to execute, False otherwise."""

        callbacks = list(self._events.get(event, []))
        return [callback(*args, **kw) for callback in callbacks]

    def heartbeats(self, seconds=10):
        if self._heartbeat is not None:
            self._heartbeat.cancel()

        if seconds is None or int(seconds) == 0:
            # disable heartbeats
            return

        def heartbeat():
            t = threading.Timer(seconds, heartbeat)
            t.daemon = True
            t.start()
            self.trigger("heartbeat")
            return t

        self._heartbeat = heartbeat()
