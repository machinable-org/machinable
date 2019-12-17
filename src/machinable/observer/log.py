import sys
import logging


class Log:
    """Logs to the console and the storage

    ::: tip
    Becomes available as ``self.observer.log`` and ``self.log``
    :::

    Exposes the standard interface of Python loggers, e.g. info, debug etc.

    # Arguments
    observer: machinable.observer.Observer, parent observer instance
    config: dict, configuration options
    """

    def __init__(self, observer, config=None):
        self.observer = observer
        self.config = config
        self.logger = self._get_logger()

    def _get_logger(self):
        logger = logging.getLogger(__name__)
        logger.handlers = []
        logger.propagate = False

        logger.setLevel(logging.INFO)

        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(logging.Formatter(fmt=f"{self.observer.directory()}; %(asctime)s; %(levelname)s: %(message)s",
                                          datefmt="%Y-%m-%d %H:%M:%S"))
        logger.addHandler(ch)

        fileh = logging.StreamHandler(self.observer.get_stream('log.txt', 'a'))
        fileh.setFormatter(logging.Formatter("%(asctime)s; %(levelname)s: %(message)s",
                                             datefmt="%Y-%m-%d %H:%M:%S"))

        logger.addHandler(fileh)

        return logger

    # forward function calls to logger

    def __getattr__(self, item):
        def forward(*args, **kwargs):
            method = getattr(self.logger, item)
            if hasattr(self.observer, 'events'):
                self.observer.events.trigger('observer.on_change', 'log.' + item)
            return method(*args, **kwargs)

        return forward
