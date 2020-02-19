

class ExecutionException(Exception):

    def __init__(self, reason, message):
        super().__init__(message)
        self.reason = reason
