from typing import Any, List, Optional

from multiprocessing import Pool

from machinable.execution import Execution


class Local(Execution):
    class Config:
        processes: Optional[int] = None

    def on_dispatch(self) -> List[Any]:
        if self.config.processes is None:
            # standard execution
            return super().on_dispatch()

        results = []
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:

            for result in pool.imap_unordered(
                self.on_dispatch_experiment,
                self.experiments,
            ):
                results.append(result)

            pool.close()
            pool.join()
        finally:
            pool.terminate()

        return results

    def __repr__(self):
        return "Execution <local>"
