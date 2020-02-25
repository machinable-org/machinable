
class Promise:

    def __init__(self, payload, flags=None):
        self.payload = payload
        self._then = []
        self.flags = flags

    def then(self, *handlers):
        self._then.extend(handlers)

    def resolved(self, result):
        for callback in self._then:
            callback(result)
        self.clear()
        return result

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
                return self.resolved(self.payload)
            else:
                return self.resolved(ray.get(self.payload))
        except ImportError:
            pass

        return self.resolved(self.payload)
