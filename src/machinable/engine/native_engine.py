import os
from multiprocessing import Pool

from ..core.exceptions import ExecutionException
from ..utils.formatting import exception_to_str
from .engine import Engine


class NativeEngine(Engine):
    def __init__(
        self, processes=1,
    ):
        if "TRAVIS" in os.environ:
            processes = None

        self.processes = processes

        Engine.set_latest(self)

    @staticmethod
    def supports_resources():
        return False

    def __repr__(self):
        return "Engine <native>"

    def serialize(self):
        return {"type": "native", "processes": self.processes}

    def _dispatch(self, execution):
        if self.processes is None:
            # standard execution
            return super(NativeEngine, self)._dispatch(execution)

        pool = Pool(processes=self.processes, maxtasksperchild=1)
        try:
            for index, result in pool.imap_unordered(
                self.pool_process, execution.schedule.iterate(execution.storage.config),
            ):
                execution.set_result(result, index)

            pool.close()
            pool.join()
        except KeyboardInterrupt:
            execution.set_result(ExecutionException(
                reason="user_interrupt",
                message="Execution has been interrupted by the user or system.",
            ), 0)
            pool.terminate()
        except BaseException as e:
            execution.set_result(ExecutionException(
                reason="exception",
                message=f"The following exception occurred: {e}\n{exception_to_str(e)}",
            ), 0)
            pool.terminate()

        return execution

    def pool_process(self, payload):
        return self.process(*payload)

    def execute(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        nd = component["class"](component["args"], component["flags"])
        return nd.dispatch(components, storage)
