import os

_history = None


def get_history(reload=False, file=None):
    global _history
    if _history is None or reload:
        _history = History(file)

    return _history


class History:

    def __init__(self, file=None):
        if file is None:
            file = 'history'
        os.makedirs(os.path.expanduser('~/.machinable'), exist_ok=True)
        self.horizon = 15
        self.url = os.path.expanduser(os.path.join('~/.machinable', file))
        self.data = []
        self._load()

    def _load(self):
        if not os.path.isfile(self.url):
            self.data = []
            return

        with open(self.url, "r") as f:
            for line in f:
                self.data.append(line)

    def _save(self):
        if len(self.data) == 0:
            try:
                os.remove(self.url)
            except OSError:
                pass
            return

        with open(self.url, 'w+') as f:
            for element in self.data:
                f.write(element + '\n')

    def available(self):
        return [e for e in self.data if os.path.isfile(e)]

    def add(self, storage):
        if not isinstance(storage, str):
            return False

        storage = storage.strip()
        if len(storage) == 0:
            return False

        if storage in self.data:
            self.data.remove(storage)
        self.data.append(storage)
        if len(self.data) > self.horizon:
            self.data = self.data[-self.horizon:]
        self._save()

    def reset(self):
        self.data = []
        self._save()

    def __len__(self):
        return len(self.data)
