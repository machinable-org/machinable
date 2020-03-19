import traceback

import ray
from ray.exceptions import RayActorError

from .driver import Driver
from ..core.exceptions import ExecutionException
from ..engine.functional import FunctionalCallback, FunctionalEngine


class RayDriver(Driver):

    def __init__(self, init_options=None):
        self.init_options = init_options if init_options is not None else {}
        self.queue = {}
        self.address_information = None

    def init(self):
        # todo: workout from config whether to init
        if not ray.is_initialized():
            self.address_information = ray.init(**self.init_options)

    def shutdown(self):
        # workout whether to shutdown from config
        self.queue = {}
        ray.shutdown()

    def execute(self, promise):
        if isinstance(promise.component['class'], FunctionalCallback):
            nd = ray.remote(resources=promise.resources)(FunctionalEngine).remote(
                promise.component['class'].callback,
                promise.component['args'],
                promise.component['flags']
            )
        else:
            nd = ray.remote(resources=promise.resources)(promise.component['class']).remote(
                promise.component['args'],
                promise.component['flags']
            )

        # destroy events class as independent instances will be recreated in the local workers
        promise.observer['events'] = None

        object_id = nd.dispatch.remote(promise.children, promise.observer, nd)
        self.queue[object_id] = promise

    def join(self):
        for object_id, promise in self.queue.items():
            try:
                promise.resolve(ray.get(object_id))
            except RayActorError as ex:
                trace = ''.join(traceback.format_exception(etype=type(ex), value=ex, tb=ex.__traceback__))
                result = ExecutionException(reason='exception',
                                            message=f"The following exception occurred: {ex}\n{trace}")
                promise.resolve(result)
