import copy
import datetime
import json
from collections import OrderedDict

import jsonlines
import pendulum

from ..core.events import Events
from ..utils.dicts import serialize
from ..utils.formatting import msg, prettydict


def as_datetime(timestamp):
    if timestamp is None:
        return pendulum.now()
    elif isinstance(timestamp, datetime.datetime):
        return timestamp
    elif isinstance(timestamp, str):
        return pendulum.parse(timestamp)
    elif isinstance(timestamp, (float, int)):
        return pendulum.from_timestamp(timestamp)

    raise ValueError(f"'{timestamp}' cannot be converted to a datetime")


class Record:
    """Tabular record writer

    ::: tip
    Within components, the default record writer becomes available as ``self.record``
    :::

    Exposes the standard interface of Python loggers, e.g. info, debug etc.

    # Arguments
    storage: machinable.Storage
    scope: String, optional scope name
    """

    def __init__(self, storage, scope="default", events=None, created_at=None):
        from .storage import Storage

        self.storage = Storage.create(storage)
        self.scope = scope
        self.events = events or Events()

        self.latest = None
        self._record = OrderedDict()
        self._meta_data = self.storage.file(
            f"records/{self.scope}_meta_data.json",
            default={"created_at": created_at, "length": 0, "updated_at": None},
        )
        self._meta_data["created_at"] = as_datetime(self._meta_data["created_at"])
        if self._meta_data["updated_at"] is not None:
            self._meta_data["updated_at"] = as_datetime(self._meta_data["updated_at"])

    @property
    def filepath(self):
        """Returns the record filepath relative to the storage"""
        return f"records/{self.scope}.jsonl"

    def write(self, key, value):
        """Writes a cell value

        ```python
        self.record.write('loss', 0.1)
        # is equivalent to
        self.record['loss'] = 0.1
        ```

        # Arguments
        key: String, the column name
        value: Value to write
        """
        self._record[key] = value

    def timing(self, mode="iteration", end=None, return_type="seconds"):
        """Get timing statistics about the records

        # Arguments
        mode: String, 'iteration', 'avg' or 'total' that determines whether the last iteration, the average iteration
              or the total time is collected
        end: Mixed, end of the timespan; if None, datetime.now() is used
        return_type: String, specifying the return format 'seconds', 'words', or 'period' (pendulum.Period object)

        Returns: See return_type
        """
        end = as_datetime(end)

        if mode == "iteration":
            if self._meta_data["updated_at"] is not None:
                start = self._meta_data["updated_at"]
            else:
                start = self._meta_data["created_at"]
            elapsed = start.diff(end)
        elif mode == "total":
            elapsed = self._meta_data["created_at"].diff(end)
        elif mode == "avg":
            start = self._meta_data["created_at"]
            if self._meta_data["length"] > 0:
                elapsed = start.diff(end) / self._meta_data["length"]
            else:
                elapsed = start.diff(end)
        else:
            raise ValueError(
                f"Invalid mode: '{mode}'; must be 'iteration', 'avg' or 'total'."
            )

        if return_type == "seconds":
            seconds = elapsed.in_seconds()
            if seconds <= 0:
                return 1e-15  # guard against division by zero
            return seconds
        elif return_type == "words":
            return elapsed.in_words()
        elif return_type == "period":
            return elapsed
        else:
            raise ValueError(
                f"Invalid return_type: '{return_type}'; must be 'seconds', 'words' or 'period'."
            )

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

    def save(self, echo=False, force=False):
        """Save the current row

        # Arguments
        echo: Boolean, if True the written row will be printed to the terminal
        force: Boolean, if True the row will be written even if it empty

        # Returns
        The row data
        """
        data = copy.deepcopy(self._record)
        self._record = OrderedDict()

        # don't save if there are no records
        if len(data) == 0 and not force:
            return data

        now = pendulum.now()

        # statistics
        data["_time"] = str(now)
        iteration_time = self.timing("iteration", end=now, return_type="period")
        data["_seconds_taken"] = iteration_time.in_seconds()

        with jsonlines.Writer(
            self.storage.get_stream(self.storage.get_path(self.filepath), mode="a"),
            dumps=lambda *args, **kwargs: json.dumps(
                *args, sort_keys=True, default=serialize, **kwargs
            ),
        ) as writer:
            writer.write(data)

        # additional display information
        data["_time_taken"] = iteration_time.in_words()
        total_time = self.timing("total", end=now, return_type="period")
        data["_total_seconds_taken"] = total_time.in_seconds()
        data["_total_time_taken"] = total_time.in_words()

        self._meta_data["updated_at"] = now
        self._meta_data["length"] += 1
        self.storage.save_file(f"records/{self.scope}_meta_data.json", self._meta_data)

        self.events.trigger("records.on_save", self.scope, data, self._meta_data)
        self.latest = data

        if echo:
            msg(self.storage.get_url(f"records/{self.scope}.jsonl"))
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
