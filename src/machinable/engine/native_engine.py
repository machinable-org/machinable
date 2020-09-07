from multiprocessing import Pool

from .engine import Engine


class NativeEngine(Engine):
    def __init__(
        self, processes=1,
    ):
        self.processes = processes

        Engine.set_latest(self)

    @staticmethod
    def supports_resources():
        return False

    def __repr__(self):
        return "Engine <native>"

    def serialize(self):
        return {"type": "native", "processes": self.processes}

    def _submit(self, execution):
        if self.processes <= 1:
            # standard execution
            return super(NativeEngine, self)._submit(execution)

        pool = Pool(processes=self.processes, maxtasksperchild=1)
        for index, result in pool.imap_unordered(
            self.pool_process, execution.schedule.iterate(execution.storage.config),
        ):
            execution.set_result(result, index)

        pool.close()
        pool.join()

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
