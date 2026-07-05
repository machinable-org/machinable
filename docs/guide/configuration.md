# Configuration

Every interface declares its knobs in a nested `Config` class. `Config` is always a
[pydantic](https://docs.pydantic.dev/) `BaseModel`; plain `dict` or dataclass configs
are not supported and raise a `ConfigurationError`.

```python
from pydantic import BaseModel

from machinable import Interface


class Train(Interface):
    class Config(BaseModel):
        lr: float = 0.1
        layers: int = 2
```

Access the resolved configuration through `self.config`:

```python
def __call__(self):
    print(self.config.lr, self.config.layers)
```

Typed fields are coerced to their annotation, so passing `lr=1` to a `float` field
stores `1.0`. This matters because coercion is what keeps a run's
[identity](./identity.md) well-defined; the reasoning is in
[Design notes → Key decisions](/design/decisions#pydantic-only-config).

## Unknown keys are rejected

Passing a key the `Config` doesn't declare raises a `ConfigurationError`:

```python
get("train", {"lrr": 0.5})   # ConfigurationError: lrr (extra inputs are not permitted)
```

Pydantic would ignore the extra key by default, but since configuration is identity, a
typo would silently resolve to the default config and deduplicate onto the wrong
record. To accept undeclared keys anyway, set `extra` explicitly on your model and
machinable respects it:

```python
from pydantic import BaseModel, ConfigDict

class Config(BaseModel):
    model_config = ConfigDict(extra="allow")   # extras become part of the config
    lr: float = 0.1
```

The check reaches into nested models, including models inside `list`/`dict`
fields, and reports the full dotted path (`optimizer.lrr`). A nested model that sets `extra`
itself keeps its own behavior at that level.

## Defaults, required fields, and nesting

```python
class Config(BaseModel):
    lr: float = 0.1            # default
    seed: int                  # required; must be supplied at resolve time

    class Optimizer(BaseModel):
        name: str = "sgd"
        momentum: float = 0.9

    optimizer: Optimizer = Optimizer()   # nested model (preferred over free-form dicts)
```

- A field without a default is required; resolving without it raises a validation
  error. Required fields are always part of the run's identity.
- Nested `BaseModel`s are preferred over free-form `dict`s, since their inner scalars are
  typed and coerced too. A free-form `dict` field keeps its contents verbatim.

Override values when you resolve:

```python
get("train", {"lr": 0.5, "optimizer": {"momentum": 0.95}})
```

### Dotted paths

Nested overrides can be written as dotted keys that expand before validation, so both
spellings resolve to the same configuration (and therefore the same run):

```python
get("train", {"optimizer.momentum": 0.95})   # same as {"optimizer": {"momentum": 0.95}}
```

This is the same shorthand the [CLI](./cli.md) uses (`optimizer.momentum=0.95`).
[Unknown-key rejection](#unknown-keys-are-rejected) covers every segment, so both
`{"optimzer.momentum": 0.95}` and `{"optimizer.momentun": 0.95}` raise, naming the
offending path.

## Going further

That's everything you need to configure and run experiments. When configuration gets
more demanding, [Advanced configuration](./advanced-configuration.md) covers:

- **Config methods**: values computed from other values (`lr: float = "scaled(0.1)"`).
- **Non-identifying fields**: excluding environment-dependent fields (like data paths)
  from a run's identity.
- **References**: passing factories or other interfaces as configuration.
