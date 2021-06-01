from typing import TYPE_CHECKING, Optional

from multiprocessing import Pool

from machinable import Engine

if TYPE_CHECKING:
    from machinable.execution import Execution


class LocalEngine(Engine):
    class Config:
        processes: Optional[int] = 1

    def _dispatch(self, execution: "Execution"):
        if self.config.processes is None:
            # standard execution
            return super()._dispatch(execution)

        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:
            for _ in pool.imap_unordered(
                self._dispatch_experiment,
                execution.experiments,
            ):
                pass

            pool.close()
            pool.join()
        finally:
            pool.terminate()
