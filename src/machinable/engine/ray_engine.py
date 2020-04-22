import os
import copy
import traceback

import ray
from ray.exceptions import RayActorError

from .engine import Engine
from ..utils.dicts import update_dict
from ..core.exceptions import ExecutionException
from ..core.core import FunctionalComponent


class RayEngine(Engine):
    def __init__(self):
        self.queue = {}

    def init(self):
        if not ray.is_initialized():
            ray.init()

    def shutdown(self):
        # workout whether to shutdown from config
        self.queue = {}
        ray.shutdown()

    def execute(self, promise):
        if isinstance(promise.component["class"], FunctionalComponent):
            nd = ray.remote(resources=promise.resources)(FunctionalComponent).remote(
                promise.component["class"].function,
                promise.component["args"],
                promise.component["flags"],
            )
        else:
            nd = ray.remote(resources=promise.resources)(
                promise.component["class"]
            ).remote(promise.component["args"], promise.component["flags"])

        # destroy events class as independent instances will be recreated in the local workers
        promise.storage["events"] = None

        object_id = nd.dispatch.remote(promise.components, promise.storage, nd)
        self.queue[object_id] = promise

    def join(self):
        for object_id, promise in self.queue.items():
            try:
                promise.resolve(ray.get(object_id))
            except RayActorError as ex:
                trace = "".join(
                    traceback.format_exception(
                        etype=type(ex), value=ex, tb=ex.__traceback__
                    )
                )
                result = ExecutionException(
                    reason="exception",
                    message=f"The following exception occurred: {ex}\n{trace}",
                )
                promise.resolve(result)

    def tune(
        self,
        component,
        components=None,
        store=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        # local import to enable Ray driver use without ray[tune] dependencies
        import ray.tune
        from ray.tune.trainable import Trainable
        from ray.tune.result import DONE

        if args is None:
            args = []
        if kwargs is None:
            kwargs = {}

        if "events" in store:
            del store["events"]

        class MachinableTuningComponent(Trainable):
            def _setup(self, config):
                # apply config updates
                components_update = [{} for _ in range(len(components))]
                if "node" in config:
                    node_update = config["node"]
                    if "components" in config:
                        components_update = config["children_patch"]
                else:
                    node_update = config

                node_args = copy.deepcopy(component["args"])
                node_args = update_dict(node_args, node_update)
                node_flags = copy.deepcopy(component["flags"])
                node_flags["TUNING"] = True

                components_config = copy.deepcopy(components)
                for i in range(len(components)):
                    components_config[i]["args"] = update_dict(
                        components[i]["args"], components_update[i]
                    )

                observer_config = copy.deepcopy(store)
                observer_config["url"] = "../../../"
                observer_config["allow_overwrites"] = True

                self.node = component["class"](node_args, node_flags)
                self.children, self.observer = self.node.dispatch(
                    components_config, observer_config, self, lifecycle=False
                )
                self.node.create(self.children, self.observer)
                self.node.execute()
                self._node_execution_iterations = -1

            def _train(self):
                if hasattr(self.node.on_execute_iteration, "_deactivated"):
                    raise NotImplementedError(
                        "on_execute_iteration has to be implemented to allow for step-wise tuning"
                    )

                self._node_execution_iterations += 1
                self.node.flags.ITERATION = self._node_execution_iterations
                self.node.on_before_execute_iteration(self._node_execution_iterations)
                try:
                    callback = self.node.on_execute_iteration(
                        self._node_execution_iterations
                    )
                    if (
                        self.node.on_after_execute_iteration(
                            self._node_execution_iterations
                        )
                        is not False
                    ):
                        # trigger records.save() automatically
                        if (
                            self.node.store.has_records()
                            and not self.node.store.record.empty()
                        ):
                            self.observer.record[
                                "_iteration"
                            ] = self._node_execution_iterations
                            self.observer.record.save()
                except (KeyboardInterrupt, StopIteration):
                    callback = StopIteration

                if len(self.node.record.history) > self._node_execution_iterations:
                    data = self.node.record.history[-1].copy()
                else:
                    data = {}

                data[DONE] = callback is StopIteration

                return data

            def _save(self, tmp_checkpoint_dir):
                return self.node.save_checkpoint(tmp_checkpoint_dir)

            def _restore(self, checkpoint):
                self.node.restore_checkpoint(checkpoint)

            def _stop(self):
                self.node.destroy()

        if "url" not in store:
            store["url"] = "~/ray_results"

        if store["url"].find("://") != -1:
            fs_prefix, local_dir = store["url"].split("://")
            if fs_prefix != "osfs":
                raise ValueError(
                    "Store has to be local; use upload_dir or sync options of Ray tune to copy to remote."
                )
        else:
            local_dir = store["url"]

        kwargs["name"] = os.path.join(store["group"], store["uid"])
        kwargs["resources_per_trial"] = resources
        kwargs["local_dir"] = local_dir

        output = ray.tune.run(MachinableTuningComponent, *args, **kwargs)

        return output
