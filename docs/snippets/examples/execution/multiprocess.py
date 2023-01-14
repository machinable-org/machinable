from multiprocessing import Pool

from machinable import Execution


class Multiprocess(Execution):
    class Config:
        processes: int = 1

    def on_dispatch(self):
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:
            pool.imap_unordered(
                lambda experiment: experiment(),
                self.experiments,
            )
            pool.close()
            pool.join()
        finally:
            pool.terminate()
