from .promise import Promise


class Driver:

    @classmethod
    def create(cls, args):
        if isinstance(args, Driver):
            return args

        if isinstance(args, str):
            args = {'type': args}

        if args is None:
            args = {'type': 'default'}

        driver = args.pop('type')
        if driver.find(':') != -1:
            driver, args['inline_arg'] = driver.split(':', maxsplit=1)

        if driver == 'default' or driver == 'local':
            from .default_driver import DefaultDriver
            return DefaultDriver(**args)
        elif driver.startswith('ray'):
            from .ray_driver import RayDriver
            return RayDriver(**args)
        elif driver.startswith('multiprocessing'):
            from .multiprocessing_driver import MultiprocessingDriver
            return MultiprocessingDriver(**args)

        raise ValueError(f"Invalid driver: {args}")

    def submit(self, component, children, observer, resources):
        promise = Promise(component, children, observer, resources)
        self.execute(promise)

    def msg(self, message):
        print(message)

    def __str__(self):
        return self.__repr__()

    # abstract methods

    def __repr__(self):
        return 'machinable.driver.Driver'

    def init(self):
        raise NotImplementedError

    def join(self):
        raise NotImplementedError

    def shutdown(self):
        raise NotImplementedError

    def execute(self, promise: Promise):
        raise NotImplementedError
