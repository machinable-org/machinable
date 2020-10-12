import logging
import sys


class Log:
    """A simple logging interface

    ::: tip
    Within components, the log becomes available as ``self.log``
    :::

    Exposes the standard interface of Python loggers, e.g. info, debug etc.

    # Arguments
    storage: machinable.Storage
    """

    def __init__(self, storage):
        from .storage import Storage

        self.storage = Storage.create(storage)
        self._logger = self._get_logger()

    def _get_logger(self):
        logger = logging.getLogger(__name__)
        logger.handlers = []
        logger.propagate = False

        logger.setLevel(logging.INFO)

        ch = logging.StreamHandler(sys.stdout)
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(
            logging.Formatter(
                fmt=f"{self.storage.get_url()}; %(asctime)s; %(levelname)s: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
        logger.addHandler(ch)

        fileh = logging.StreamHandler(self.storage.get_stream("log.txt", "a"))
        fileh.setFormatter(
            logging.Formatter(
                "%(asctime)s; %(levelname)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
            )
        )

        logger.addHandler(fileh)

        return logger

    def debug(self, msg, *args, **kwargs):
        """Logs a message with level DEBUG on this logger."""
        return self._logger.debug(msg, *args, **kwargs)

    def info(self, msg, *args, **kwargs):
        """Logs a message with level INFO on this logger."""
        return self._logger.info(msg, *args, **kwargs)

    def warning(self, msg, *args, **kwargs):
        """Logs a message with level WARNING on this logger."""
        return self._logger.warning(msg, *args, **kwargs)

    def error(self, msg, *args, **kwargs):
        """Logs a message with level ERROR on this logger."""
        return self._logger.error(msg, *args, **kwargs)

    @property
    def logger(self):
        """The underlying logging interface"""
        return self._logger
