import logging
import sys


class Log:
    """Logs to the console and the write

    ::: tip
    Becomes available as ``self.store.log`` and ``self.log``
    :::

    Exposes the standard interface of Python loggers, e.g. info, debug etc.

    # Arguments
    store: machinable.store.Observer, parent store instance
    config: dict, configuration options
    """

    def __init__(self, observer, config=None):
        self.store = observer
        self.config = config
        self.logger = self._get_logger()

    def _get_logger(self):
        logger = logging.getLogger(__name__)
        logger.handlers = []
        logger.propagate = False

        logger.setLevel(logging.INFO)

        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(
            logging.Formatter(
                fmt=f"{self.store.directory()}; %(asctime)s; %(levelname)s: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
        logger.addHandler(ch)

        fileh = logging.StreamHandler(self.store.get_stream("log.txt", "a"))
        fileh.setFormatter(
            logging.Formatter(
                "%(asctime)s; %(levelname)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
            )
        )

        logger.addHandler(fileh)

        return logger

    # forward function calls to logger

    def __getattr__(self, item):
        def forward(*args, **kwargs):
            method = getattr(self.logger, item)
            if hasattr(self.store, "events"):
                self.store.events.trigger("store.on_change", "log." + item)
            return method(*args, **kwargs)

        return forward
