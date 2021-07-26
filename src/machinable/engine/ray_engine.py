import ray
from machinable.engine import Engine
from ray.exceptions import RayActorError


class RayEngine(Engine):
    def _dispatch(self):
        if not ray.is_initialized():
            ray.init()

        results = [
            self._actor(experiment) for experiment in self.execution.experiments
        ]

        done = []
        for result in results:
            try:
                if isinstance(result, ray.ObjectID):
                    result = ray.get(result)
                done.append(result)
            except RayActorError as _ex:
                done.append(_ex)

        return done

    def _actor(self, experiment):
        interface = experiment.interface()
        actor = ray.remote(resources=self.resources(experiment))(
            interface.__class__
        ).remote(**interface.serialize())

        return actor.dispatch.remote(**experiment.components())

    def __repr__(self):
        return "Engine <ray>"
