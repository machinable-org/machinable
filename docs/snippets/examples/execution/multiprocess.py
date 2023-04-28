from multiprocessing import Pool

from machinable import Execution


class Multiprocess(Execution):
    class Config:
        processes: int = 1

    def __call__(self):
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:
            pool.imap_unordered(
                lambda component: component(),
                self.components,
            )
            pool.close()
            pool.join()
        finally:
            pool.terminate()
