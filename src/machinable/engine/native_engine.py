from multiprocessing import Pool

from .engine import Engine


class NativeEngine(Engine):
    def __init__(
        self, processes=1,
    ):
        self.processes = processes

    def __repr__(self):
        return "Native"

    def serialize(self):
        return {"type": "native", "processes": self.processes}

    def submit(self, execution):
        if self.processes <= 1:
            # standard execution
            return super(NativeEngine, self).submit(execution)

        pool = Pool(processes=self.processes)
        results = pool.starmap(
            self.process,
            [arguments for arguments in execution.schedule.iterate(execution.storage)],
        )

        for result in results:
            execution.set_result(result)

        return execution

    def execute(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        if resources is not None:
            self.log(
                "Resource specification are currently not supported. Use Ray Engine instead.",
                level="warn",
            )

        nd = component["class"](component["args"], component["flags"])
        return nd.dispatch(components, storage)
