from .driver import Driver


class DefaultDriver(Driver):

    def __init__(self, **kwargs):
        pass

    def __repr__(self):
        return '-'

    def init(self):
        pass

    def shutdown(self):
        pass

    def join(self):
        pass

    def execute(self, promise):
        if promise.resources is not None:
            self.msg('Resource specification has no effect in local mode')

        nd = promise.component['class'](promise.component['args'], promise.component['flags'])
        result = nd.dispatch(promise.children, promise.observer)

        promise.resolve(result)
