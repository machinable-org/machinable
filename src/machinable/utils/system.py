import io
import os
import sys


def set_process_title(title):
    try:
        import setproctitle

        setproctitle.setproctitle(title)
    except (ImportError, ModuleNotFoundError):
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
            except (AttributeError, IOError, io.UnsupportedOperation):
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
            except (IOError, AttributeError):
                if i == 0:
                    # close corrupt file stream
                    self.close_file_stream()

    def close_file_stream(self):
        try:
            self._file_stream.exit_on_completion()
        except (IOError, AttributeError):
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
