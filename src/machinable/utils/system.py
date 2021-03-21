from typing import Any, Callable, Union

import io
import json
import os
import pickle
import sys

from machinable.utils.dicts import serialize
from machinable.utils.utils import sentinel


def load_file(
    filepath: str,
    default: Any = sentinel,
    opener=open,
    **opener_kwargs,
):
    """Loads a data object from file

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)
    default: Optional default if reading fails
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener
    """
    _, ext = os.path.splitext(filepath)
    mode = opener_kwargs.pop("mode", "r")
    try:
        if ext == ".p":
            if "b" not in mode:
                mode = mode + "b"
            with opener(filepath, mode, **opener_kwargs) as f:
                data = pickle.load(f)
        elif ext == ".json":
            with opener(filepath, mode, **opener_kwargs) as f:
                data = json.load(f)
        elif ext == ".npy":
            import numpy as np

            if "b" not in mode:
                mode = mode + "b"
            with opener(filepath, mode, **opener_kwargs) as f:
                data = np.load(f, allow_pickle=True)
        elif ext in [".txt", ".log", ".diff"]:
            with opener(filepath, mode, **opener_kwargs) as f:
                data = f.read()
        else:
            raise ValueError(
                f"Invalid format: '{ext}'. "
                f"Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)"
            )
        return data
    except (FileNotFoundError, Exception) as _ex:
        if default is not sentinel:
            return default
        raise _ex


def save_file(
    filepath: str,
    data: Any,
    makedirs: Union[bool, Callable] = True,
    opener=open,
    **opener_kwargs,
):
    """Saves a data object to file

    # Arguments
    filepath: Target filepath. The extension is being used to determine
        the file format. Supported formats are:
        .json (JSON), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)
    data: The data object
    makedirs: If True or Callable, path will be created
    opener: Customer file opener
    opener_kwargs: Optional arguments to pass to the opener
    """
    path = os.path.dirname(filepath)
    name = os.path.basename(filepath)
    _, ext = os.path.splitext(name)
    mode = opener_kwargs.pop("mode", "w")

    if path != "":
        if makedirs is True:
            os.makedirs(path, exist_ok=True)
        elif callable(makedirs):
            makedirs(path)

    if ext == ".json":
        # json
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(json.dumps(data, ensure_ascii=False, default=serialize))
    elif ext == ".npy":
        import numpy as np

        if "b" not in mode:
            mode += "b"
        # numpy
        with opener(filepath, mode, **opener_kwargs) as f:
            np.save(f, data)
    elif ext == ".p":
        if "b" not in mode:
            mode += "b"
        with opener(filepath, mode, **opener_kwargs) as f:
            pickle.dump(data, f)
    elif ext in [".txt", ".log", ".diff"]:
        with opener(filepath, mode, **opener_kwargs) as f:
            f.write(data)
    else:
        raise ValueError(
            f"Invalid format: '{ext}'. "
            f"Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt|.log|.diff (txt)"
        )


def set_process_title(title):
    try:
        import setproctitle

        setproctitle.setproctitle(title)
    except ImportError:
        pass
    # tmux
    if (
        os.environ.get("TERM", None) == "screen"
        and os.environ.get("TMUX", None) is not None
    ):
        os.system(f"printf '\033]2;%s\033\\' '{title}'")


class OutputRedirection:
    def __init__(self, stream_type, mode, file_open, file_name=None):
        if stream_type not in ["stdout", "stderr"]:
            raise ValueError(f"Invalid stream type: {stream_type}")

        self._file_stream = None
        self.stream_type = stream_type
        self.mode = mode
        self.file_open = file_open
        self.file_name = file_name or stream_type + ".log"
        self.sys_stream = getattr(sys, stream_type)

        # capture output from other consumers of the underlying file descriptor
        if self.mode != "DISCARD":
            try:
                output_file_descriptor = os.dup(self.sys_stream.fileno())
                os.dup2(self.file_stream.fileno(), output_file_descriptor)
            except (AttributeError, OSError, io.UnsupportedOperation):
                pass

    @property
    def file_stream(self):
        if self._file_stream is None:
            self._file_stream = self.file_open(self.file_name, "a", buffering=1)

        return self._file_stream

    @property
    def streams(self):
        if self.mode == "DISCARD":
            return []

        if self.mode == "FILE_ONLY":
            return [self.file_stream]

        return [self.file_stream, self.sys_stream]

    def write(self, message):
        for i, stream in enumerate(self.streams):
            try:
                stream.write(message)
            except (OSError, AttributeError):
                if i == 0:
                    # close corrupt file stream
                    self.close_file_stream()

    def close_file_stream(self):
        try:
            self._file_stream.exit_on_completion()
        except (OSError, AttributeError):
            pass
        finally:
            self._file_stream = None

    # forward attributes to standard sys stream

    def __getattr__(self, item):
        return getattr(self.sys_stream, item)

    @classmethod
    def apply(cls, mode, file_open, file_name=None):
        if mode not in ["DISABLED", "FILE_ONLY", "SYS_AND_FILE", "DISCARD"]:
            raise ValueError(f"Invalid output redirection mode: {mode}")

        if mode == "DISABLED":
            return

        sys.stdout.flush()
        sys.stderr.flush()
        sys.stdout = cls("stdout", mode, file_open, file_name)
        sys.stderr = cls("stderr", mode, file_open, file_name)

    @classmethod
    def revert(cls):
        if isinstance(sys.stdout, cls):
            sys.stdout.close_file_stream()
            sys.stdout = sys.stdout.sys_stream
        if isinstance(sys.stderr, cls):
            sys.stderr.close_file_stream()
            sys.stderr = sys.stderr.sys_stream
