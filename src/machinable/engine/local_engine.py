from multiprocessing import Process, Pipe

from .engine import Engine
from ..core.exceptions import ExecutionException


def execution_target(component, components, store, callback):
    nd = component["class"](component["args"], component["flags"])
    result = nd.dispatch(components, store)
    callback.send(result)


class LocalEngine(Engine):
    def __init__(
        self, processes=1,
    ):
        self.processes = processes
        self.queue = []

    def __repr__(self):
        return "-"

    def init(self):
        pass

    def shutdown(self):
        self.queue = []

    def join(self, until=0):
        if self.processes <= 1:
            return

        # join processes
        while len(self.queue) > abs(until):
            promise, p, recv_end = self.queue.pop(0)
            p.join()
            try:
                result = recv_end.recv()
            except EOFError:
                result = ExecutionException(
                    reason="execution_error", message="The process died unexpectedly."
                )
            promise.resolve(result)

    def execute(self, promise):
        if promise.resources is not None:
            self.msg(
                "Resource specification are currently not supported. Use Ray Engine instead."
            )

        if self.processes <= 1:
            # standard execution
            nd = promise.component["class"](
                promise.component["args"], promise.component["flags"]
            )
            result = nd.dispatch(promise.components, promise.storage)

            promise.resolve(result)
        else:
            # use multiprocessing
            self.join(self.processes)

            recv_end, send_end = Pipe(False)
            p = Process(
                target=execution_target,
                args=(promise.component, promise.components, promise.storage, send_end),
            )
            self.queue.append((promise, p, recv_end))
            p.start()
