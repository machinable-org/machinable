class ExecutionException(Exception):
    def __init__(self, message, reason=None):
        super().__init__(message)
        self.reason = reason
