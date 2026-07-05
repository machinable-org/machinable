# Advanced configuration

Beyond [typed fields and versions](./configuration.md), configuration can compute its
own values, exclude environment-dependent fields from identity, and reference objects
or other interfaces.

## Computed values: config methods

Some configuration values are best derived from others rather than set by hand. A config
value can be computed by a method named `config_<name>`, referenced as a string
`"<name>(args)"`. The method may take arguments and reads the rest of the config via
`self.config`.

A classic example is the linear learning-rate scaling rule, where the right learning rate
depends on the batch size, so instead of recomputing it every time you change the batch
size, derive it from a base rate defined at a reference batch size:

```python
class Config(BaseModel):
    batch_size: int = 256
    lr: float = "base_learning_rate(0.1)"   # 0.1 at the reference batch size

def config_base_learning_rate(self, base, reference_batch_size=256):
    # linear scaling (Goyal et al. 2017): lr grows with the batch size
    return base * self.config.batch_size / reference_batch_size
```

Now `lr` is always consistent with `batch_size` (`batch_size=256` resolves to `lr=0.1`,
`batch_size=512` to `lr=0.2`) and you only ever set the batch size. The resolved value
is what gets stored, so it correctly participates in [identity](./identity.md), since a
different batch size yields a different `lr`, hence a different run.

The same pattern applies whenever one quantity is a function of others:

```python
class Config(BaseModel):
    epochs: int = 90
    batch_size: int = 256
    steps: int = "total_steps()"            # derived training length
    # numerical PDE solver: a stable timestep from the CFL condition
    dx: float = 0.01
    max_velocity: float = 2.0
    dt: float = "cfl_timestep(0.4)"          # dt = CFL · dx / max_velocity

def config_total_steps(self, dataset_size=1_281_167):
    return self.config.epochs * dataset_size // self.config.batch_size

def config_cfl_timestep(self, cfl):
    return cfl * self.config.dx / self.config.max_velocity
```

For experiment axes you want to sweep, prefer [version methods](./versions.md), which
compose into reusable `~versions`. Reach for config methods when a value is a
deterministic function of other config that should stay consistent automatically.

## Non-identifying fields: `machinable.Field`

Some configuration is environment-dependent and should not affect identity, such as a
data path that differs per machine. Mark it with
[`Field`](/reference/python/helpers#field):

```python
from machinable import Field


class Config(BaseModel):
    recording_uri: str = Field("", identifying=False)   # excluded from identity
    sorter: str = "simple"
```

`Field` is a thin wrapper over `pydantic.Field` (all its options still work). The
excluded field is dropped from the identity hash; this works inside nested models too
(the field is excluded by its dotted path).

Dropping a field from identity usually calls for re-identifying the underlying *data*
by content rather than location, via a predicate:

```python
from machinable import Field
from machinable.config import predicate_from_manifest


class Sorter(Interface):
    class Config(BaseModel):
        recording_uri: str = Field("", identifying=False)   # location: not identity
        sorter: str = "simple"

    def on_compute_predicate(self):
        # a stable content id, read from a manifest beside the data
        return predicate_from_manifest(self.config.recording_uri, "recording_id")
```

Now the same recording moved from `file://` to `s3://` reuses its cached result: the
location left identity, but a content id (`recording_id`) re-entered via the
predicate. `predicate_from_manifest(uri, *keys)` reads those keys from a JSON manifest
next to the blob. Excluding fields *without* adding a predicate back collapses every
instance to one identity, so machinable warns when it sees that.

## References: passing objects or interfaces as config

Config must be JSON-able, but you often want a factory, a complex object, or another
interface. Addressing such an object *by value* would make identity fragile; instead,
store a reference (the same `(module, version)` form `get` accepts) and resolve it at
runtime:

```python
from machinable import config, get


class Config(BaseModel):
    feature_dtypes: tuple = ("pkg.module:make_dtypes", {"n": 8})
    surrogate: tuple = ("interface.resnet", {"depth": 50})

def __call__(self):
    dtypes = config.import_ref(self.config.feature_dtypes)   # -> make_dtypes(n=8)
    model = get(*self.config.surrogate)                      # -> a resolved interface
```

The reference (a string, or a `(path, kwargs…)` tuple) is JSON-able and identifies by
name + arguments, not by the behavior of the referenced code, so the run's identity
stays stable while the referenced implementation lives only at runtime.
