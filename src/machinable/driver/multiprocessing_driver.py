from .driver import Driver
from multiprocessing import Process, Pipe
from ..core.exceptions import ExecutionException


def execution_target(component, children, observer, callback):
    nd = component['class'](component['args'], component['flags'])
    result = nd.dispatch(children, observer)
    callback.send(result)


class MultiprocessingDriver(Driver):

    def __init__(self, processes=5, inline_arg=None):
        try:
            processes = int(inline_arg)
        except (TypeError, ValueError):
            pass
        self.processes = processes
        self.queue = []

    def __repr__(self):
        return 'Multiprocessing driver'

    def init(self):
        pass

    def join(self, until=0):
        while len(self.queue) > abs(until):
            promise, p, recv_end = self.queue.pop(0)
            p.join()
            try:
                result = recv_end.recv()
            except EOFError:
                result = ExecutionException(reason='execution_error', message='The process died unexpectedly.')
            promise.resolve(result)

    def shutdown(self):
        self.queue = []

    def execute(self, promise):
        if promise.resources is not None:
            self.msg('Resource specification are currently not supported. Use Ray Driver instead.')

        # wait for process to finish
        if self.processes != -1:
            self.join(self.processes)

        recv_end, send_end = Pipe(False)
        p = Process(target=execution_target, args=(promise.component, promise.children, promise.observer, send_end))
        self.queue.append((promise, p, recv_end))
        p.start()







