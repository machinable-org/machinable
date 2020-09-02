import copy
import datetime
import json
import os
import pickle
from collections import OrderedDict

import pendulum

from ..filesystem import open_fs
from ..utils.formatting import msg, prettydict, serialize


class Record:
    """Tabular record writer

    ::: tip
    Becomes available as ``self.store.record`` and ``self.record``
    :::

    # Arguments
    store: machinable.store.Observer, parent store instance
    config: dict, configuration options
    scope: String, optional destination name
    """

    def __init__(self, store, config=None, scope="default"):
        self.store = store
        self.config = config if config is not None else {}
        self.scope = scope
        # create records directory
        self.store.get_path("records", create=True)
        # restore if existing
        with open_fs(self.store.config["url"]) as filesystem:
            self.history = filesystem.load_file(
                self.store.get_path(f"records/{scope}.p"), default=[]
            )
        self._record = OrderedDict()

    def write(self, key, value, fmt=None):
        """Writes a cell value

        Note that you can use array notation to write value as well, for example

        ```python
        self.record.write('loss', 0.1)
        # is equivalent to
        self.record['loss'] = 0.1
        ```

        # Arguments
        key: String, the column name
        value: Value to write
        fmt: String, optional formatter.
        """
        if fmt == "seconds":
            value = str(datetime.timedelta(seconds=value))

        self._record[key] = value

    def update(self, dict_like=None, **kwargs):
        """Update record values using a dictionary. Equivalent to dict's update method.

        # Arguments
        dict_like: dict, update values
        """
        self._record.update(dict_like, **kwargs)

    def empty(self):
        """Whether the record writer is empty (len(self.record) == 0)
        """
        return len(self._record) == 0

    def timing(self, mode="iteration", timestamp=None, return_type="seconds"):
        """Get timing statistics about the records

        # Arguments
        mode: String, 'iteration', 'avg' or 'total' that determines whether the last iteration, the average iteration
              or the total time is collected
        timestamp: Mixed, end of the timespan; if None, datetime.now() is used
        return_type: String, specifying the return format 'seconds', 'words', or 'period' (pendulum.Period object)

        Returns: See return_type
        """
        if timestamp is None:
            timestamp = pendulum.now()
        elif isinstance(timestamp, str):
            timestamp = pendulum.parse(timestamp)
        elif isinstance(timestamp, (float, int)):
            timestamp = pendulum.from_timestamp(timestamp)

        start = self.store.created_at

        if mode == "iteration":
            if len(self.history) > 0:
                start = self.history[-1]["_timestamp"]
            elapsed = pendulum.from_timestamp(int(start)).diff(timestamp)
        elif mode == "total":
            if len(self.history) > 0:
                start = self.history[0]["_timestamp"]
            elapsed = pendulum.from_timestamp(int(start)).diff(timestamp)
        elif mode == "avg":
            if len(self.history) > 0:
                start = self.history[0]["_timestamp"]
                elapsed = pendulum.from_timestamp(int(start)).diff(timestamp) / len(
                    self.history
                )
            else:
                elapsed = pendulum.from_timestamp(int(start)).diff(timestamp)
        else:
            raise ValueError(
                f"Invalid mode: '{mode}'; must be 'iteration', 'avg' or 'total'."
            )

        if return_type == "seconds":
            seconds = elapsed.in_seconds()
            if seconds == 0:
                return 1e-15  # avoids division by zero errors
            return seconds
        elif return_type == "words":
            return elapsed.in_words()
        elif return_type == "period":
            return elapsed
        else:
            raise ValueError(
                f"Invalid return_type: '{return_type}'; must be 'seconds', 'words' or 'period'."
            )

    def save(self, echo=False, force=False):
        """Save the current row

        # Arguments
        echo: Boolean, if True the written row will be printed to the terminal
        force: Boolean, if True the row will be written even if it contains no columns

        # Returns
        The row data
        """
        data = copy.deepcopy(self._record)
        self._record = OrderedDict()

        # don't save if there are no records
        if len(data) == 0 and not force:
            return data

        now = pendulum.now()

        # meta-data
        data["_timestamp"] = now.timestamp()
        data["_time"] = str(now)
        iteration_time = self.timing(
            "iteration", timestamp=data["_timestamp"], return_type="period"
        )
        data["_seconds_taken"] = iteration_time.in_seconds()
        data["_time_taken"] = iteration_time.in_words()

        total_time = self.timing(
            "total", timestamp=data["_timestamp"], return_type="period"
        )
        data["_total_seconds_taken"] = total_time.in_seconds()
        data["_total_time_taken"] = total_time.in_words()

        self.history.append(data)

        if self.scope == "default":
            if hasattr(self.store.component, "events"):
                self.store.component.events.trigger("store.record.on_save", data)

        # json
        with self.store.get_stream(f"records/{self.scope}.json", "w") as f:
            json.dump(self.history, f, ensure_ascii=False, default=serialize)

        # pickle
        with self.store.get_stream(f"records/{self.scope}.p", "wb") as f:
            pickle.dump(self.history, f)

        if self.scope == "default":
            if hasattr(self.store, "events"):
                self.store.events.trigger("store.on_change", "record.save")

        if echo:
            msg(os.path.join(self.store.config["url"], self.store.get_path()))
            msg(prettydict(data, sort_keys=True))

        return data

    def __len__(self):
        return len(self._record)

    def __delitem__(self, key):
        del self._record[key]

    def __getitem__(self, key):
        return self._record[key]

    def __setitem__(self, key, value):
        self._record[key] = value
