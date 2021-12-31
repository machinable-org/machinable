from typing import Any, List, Optional

from multiprocessing import Pool

from machinable.execution import Execution


class LocalExecution(Execution):
    class Config:
        processes: Optional[int] = None

    def _dispatch(self) -> List[Any]:
        if self.config.processes is None:
            # standard execution
            return super()._dispatch()

        results = []
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:

            for result in pool.imap_unordered(
                self._dispatch_experiment,
                self.execution.experiments,
            ):
                results.append(result)

            pool.close()
            pool.join()
        finally:
            pool.terminate()

        return results
