"""examples://config: common Config patterns.

Nested models, version methods, config methods, and identity affordances.

Config is the experiment's knobs. Encode *axes* as version methods (`~versions`), keep
overrides tiny, and exclude environment-dependent fields from identity.
"""

from pydantic import BaseModel

from machinable import Field, Interface
from machinable.config import predicate_from_manifest


class Model(Interface):
    class Config(BaseModel):
        # nested pydantic model, preferred over a free-form dict (its scalars coerce)
        class Optimizer(BaseModel):
            name: str = "sgd"
            lr: float = 0.1

        optimizer: Optimizer = Optimizer()
        layers: int = 2

        # an environment-dependent location, excluded from identity; the data is
        # re-identified by a content id in a manifest beside it (a content predicate)
        dataset_uri: str = Field("", identifying=False)

        # a config method: computed at resolve time, referenced as a string token
        run_name: str = "name()"

    # version methods: experiment axes as ~versions
    def version_sgd(self):
        return {"optimizer": {"name": "sgd", "lr": 0.1}}

    def version_adam(self, lr=1e-3):  # ~adam  or  ~adam(lr=3e-4)
        return {"optimizer": {"name": "adam", "lr": lr}}

    # config method: config_<name>(self, ...)
    def config_name(self):
        return f"{self.config.optimizer.name}-{self.config.layers}L"

    def on_compute_predicate(self):
        # location is out of identity; content id (from the manifest) re-identifies it
        if self.config.dataset_uri:
            return predicate_from_manifest(self.config.dataset_uri, "dataset_id")
        return {}
