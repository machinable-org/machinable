import io
import json
import os
import pickle
import sys

from machinable.utils.dicts import serialize
from machinable.utils.utils import sentinel


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


def backup_source_code(
    self, filepath="code.zip", opener=None, exclude=None, echo=None
) -> bool:
    """Writes all files in project (excluding those in .gitignore) to zip file

    # Arguments
    filepath: String, target file
    opener: Optional file opener object. Defaults to built-in `open`
    exclude: Optional list of gitignore-style rules to exclude files from the backup

    # Returns
    True if backup of all files was sucessful
    """
    import igittigitt
    from fs.zipfs import WriteZipFS

    if opener is None:
        opener = open

    msg(
        f"\nCreating code backup ...",
        color="green",
    )

    # Get stream in the PyFS to create zip file with
    zip_stream = opener(filepath, "wb")

    status = True
    counter = 0
    t = time.time()

    # Parse .gitignore
    class GitIgnoreParser(igittigitt.IgnoreParser):
        def match(self, file_path) -> bool:
            # overwrite parent to prevent premature symlink resolution
            str_file_path = os.path.abspath(file_path)
            is_file = os.path.isfile(str_file_path)
            match = self._match_rules(str_file_path, is_file)
            if match:
                match = self._match_negation_rules(str_file_path)
            return match

    gitignore = GitIgnoreParser()
    gitignore.parse_rule_files(self.directory_path)

    if exclude is not None:
        for rule in exclude:
            gitignore.add_rule(rule, self.directory_path)

    with WriteZipFS(file=zip_stream) as zip_fs:
        for folder, subfolders, filenames in os.walk(
            self.directory_path, followlinks=True
        ):

            # Remove subfolders that are listed in .gitignore, so they won't be explored later
            subfolders[:] = [
                sub
                for sub in subfolders
                if sub != ".git"
                and not gitignore.match(os.path.join(folder, sub))
            ]

            for file_name in filenames:
                # Find absolute path of file for .gitignore checking
                abspath_file = os.path.join(folder, file_name)

                # Ignore binary file types
                file_type = mimetypes.guess_type(abspath_file)[0]
                if (
                    file_type is None or not file_type.startswith("text/")
                ) and not file_name.endswith(".yaml"):
                    continue

                if gitignore.match(abspath_file):
                    # Skip file if it is listed in .gitignore
                    continue

                # Get relative paths (which will be replicated in zip)
                relpath_folder = os.path.relpath(folder, self.directory_path)
                relpath_file = os.path.join(relpath_folder, file_name)

                # Make directories in zip if necessary
                if not zip_fs.exists(relpath_folder):
                    # Need to use makedirs (not makedir) in case file in nested folders
                    zip_fs.makedirs(relpath_folder)

                # Read file contents
                try:
                    file_content = open(
                        os.path.join(self.directory_prefix, relpath_file),
                    ).read()
                except UnicodeDecodeError as ex:
                    msg(
                        f"Code backup failed for file {relpath_file}. {exception_to_str(ex)}",
                        color="fail",
                    )
                    status = False
                    continue

                # Add file to zip
                zip_fs.writetext(relpath_file, file_content)

                if echo is True:
                    msg(relpath_file, color="green")

                counter += 1

        # Add zip to PyFS
        zip_fs.write_zip()

    took = time.time() - t
    msg(
        f" >>> Code backup of {counter} files completed in {took}\n",
        color="green",
    )

    return status
