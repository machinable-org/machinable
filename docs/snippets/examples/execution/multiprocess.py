from multiprocessing import Pool

from machinable import Execution


class Multiprocess(Execution):
    class Config:
        processes: int = 1

    def on_dispatch(self):
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
