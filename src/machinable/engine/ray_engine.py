import copy
import os

import machinable.errors
import ray
from machinable.engine import Engine
from ray.exceptions import RayActorError


class RayEngine(Engine):
    def serialize(self):
        return {"type": "ray"}

    def _dispatch(self, execution):
        if not ray.is_initialized():
            ray.init()

        results = [
            self.process(experiment) for experiment in execution.experiments
        ]

        for result in results:
            try:
                if isinstance(result, ray.ObjectID):
                    result = ray.get(result)
            except RayActorError as ex:
                result = machinable.errors.ExecutionFailed(
                    reason="exception",
                    message=f"The following exception occurred: {ex}\n{str(ex)}",
                )
                raise ex

        return execution

    def __repr__(self):
        return "Engine <ray>"

    def execute(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        # load lazy module
        if isinstance(component["class"], ModuleClass):
            component["class"] = component["class"].load(instantiate=False)
        nd = ray.remote(resources=resources)(component["class"]).remote(
            component["config"], component["flags"]
        )

        return nd.dispatch.remote(components, storage, nd)

    def tune(
        self,
        component,
        components=None,
        storage=None,
        resources=None,
        args=None,
        kwargs=None,
    ):
        # local import to enable Ray driver use without ray[tune] dependencies
        import ray.tune
        from ray.tune.result import DONE
        from ray.tune.trainable import Trainable

        if args is None:
            args = []
        if kwargs is None:
            kwargs = {}

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

                node_args = copy.deepcopy(component["config"])
                node_args = update_dict(node_args, node_update)
                node_flags = copy.deepcopy(component["flags"])
                node_flags["TUNING"] = True

                components_config = copy.deepcopy(components)
                for i in range(len(components)):
                    components_config[i]["config"] = update_dict(
                        components[i]["config"], components_update[i]
                    )

                storage_config = copy.deepcopy(storage)
                storage_config["url"] = "../../../"

                self.node = component["class"](node_args, node_flags)
                self.components = self.node.dispatch(
                    components_config, storage_config, self, lifecycle=False
                )
                self.node.create(self.components)
                self.node.execute()
                self._node_execution_iterations = -1

            def _train(self):
                if hasattr(self.node.on_execute_iteration, "_deactivated"):
                    raise NotImplementedError(
                        "on_execute_iteration has to be implemented to allow for step-wise tuning"
                    )

                self._node_execution_iterations += 1
                self.node.flags.ITERATION = self._node_execution_iterations
                self.node.on_before_execute_iteration(
                    self._node_execution_iterations
                )
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
                        if not self.node.record.empty():
                            self.node.record.save()
                except (KeyboardInterrupt, StopIteration):
                    callback = StopIteration

                data = self.node.record.latest or {}

                data[DONE] = callback is StopIteration

                return data

            def _save(self, tmp_checkpoint_dir):
                return self.node.save_checkpoint(tmp_checkpoint_dir)

            def _restore(self, checkpoint):
                self.node.restore_checkpoint(checkpoint)

            def _stop(self):
                self.node.destroy()

        if not storage["url"].startswith("osfs://"):
            raise ValueError(
                "Storage has to be local; use sync options of Ray tune to copy to remote."
            )

        kwargs["name"] = os.path.join(
            storage["submission"], storage["component"]
        )
        kwargs["resources_per_trial"] = resources
        kwargs["local_dir"] = os.path.join(
            storage["url"].split("osfs://")[-1],
            storage["directory"] or "",
            storage["submission"] or "",
            storage["component"] or "",
        )

        output = ray.tune.run(MachinableTuningComponent, *args, **kwargs)

        return output
