import logging
import os
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

    def __init__(self, store, config=None):
        self.store = store
        self.config = config
        self.logger = self._get_logger()

    def _get_logger(self):
        logger = logging.getLogger(__name__)
        logger.handlers = []
        logger.propagate = False

        logger.setLevel(logging.INFO)

        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.DEBUG)
        url = os.path.join(
            self.store.config["url"],
            os.path.join(
                self.store.config.get("directory", ""),
                self.store.config["experiment"],
                self.store.config.get("component", ""),
            ),
        )
        ch.setFormatter(
            logging.Formatter(
                fmt=f"{url}; %(asctime)s; %(levelname)s: %(message)s",
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
            return method(*args, **kwargs)

        return forward
