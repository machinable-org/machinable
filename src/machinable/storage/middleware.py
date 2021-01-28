class Middleware:
    def __init__(self, storage: Storage):
        self.storage = storage

    def __getattr__(self, name):
        """
        Forward to the underlying model
        """
        return getattr(self.__dict__["storage"], name)
