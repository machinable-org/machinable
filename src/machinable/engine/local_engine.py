from typing import TYPE_CHECKING, Any, List, Optional

from multiprocessing import Pool

from machinable import Engine
from machinable.errors import ExecutionFailed

if TYPE_CHECKING:
    from machinable.execution import Execution


class LocalEngine(Engine):
    class Config:
        processes: Optional[int] = None

    def _dispatch(self, execution: "Execution") -> List[Any]:
        if self.config.processes is None:
            # standard execution
            return super()._dispatch(execution)

        results = []
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:

            for result in pool.imap_unordered(
                self._dispatch_experiment,
                execution.experiments,
            ):
                if isinstance(result, ExecutionFailed):
                    print(result)
                results.append(result)

            pool.close()
            pool.join()
        finally:
            pool.terminate()

        return results
