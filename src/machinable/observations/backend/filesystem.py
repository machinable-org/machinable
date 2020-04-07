import os
import pickle
import json

from fs import open_fs
from fs.opener.parse import parse_fs_url

from ...utils.strings import is_task_id, is_uid


class ObservationDirectory:

    def __init__(self, url):
        if "://" not in url:
            url = "osfs://" + url
        self._url = url
        resource = os.path.normpath(parse_fs_url(self._url).resource)
        self._path = os.path.basename(resource)
        self._uid = None
        if is_uid(self._path):
            # switch to parent
            self._uid = self._path
            self._path = os.path.basename(os.path.dirname(resource))
            self._url = self._url.replace('/' + self._uid, '')
        if not is_task_id(self._path):
            raise ValueError('The provided path is not a valid observation directory')
        self.filesystem = open_fs(self._url)

    def load_file(self, filename, meta=False, default=None):
        # todo: how to handle multiple uids?
        # implement automatic caching layer
        # how to handle _reruns?

        name, ext = os.path.splitext(filename)

        path = self._uid if not meta else ''
        filepath = path + filename

        if not self.filesystem.exists(filepath):
            return FileNotFoundError if default is None else default

        if ext == '.p':
            with self.filesystem.open(filepath, 'rb') as f:
                data = pickle.load(f)
        elif ext == '.json':
            with self.filesystem.open(filepath, 'r') as f:
                data = json.load(f)
        elif ext == '.npy':
            import numpy as np
            with self.filesystem.open(filepath, 'rb') as f:
                data = np.load(f, allow_pickle=True)
        elif ext in ['.txt', '.log']:
            with self.filesystem.open(filepath, 'r') as f:
                data = f.read()
        else:
            raise ValueError('Invalid file format')

        return data
