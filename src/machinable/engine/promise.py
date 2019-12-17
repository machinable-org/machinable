
class Promise:

    def __init__(self, payload):
        self.payload = payload
        self._then = []

    def then(self, *handlers):
        self._then.extend(handlers)

    def resolved(self, result):
        for callback in self._then:
            callback(result)
        self.clear()

    def clear(self):
        self._then = []
        self.payload = None

    def resolve(self):
        if self.payload is None:
            # already resolved
            return

        try:
            import ray
            if not isinstance(self.payload, ray.ObjectID):
                self.resolved(self.payload)
            else:
                try:
                    self.resolved(ray.get(self.payload))
                except StopIteration as e:
                    self.resolved(e)
        except ImportError:
            pass
