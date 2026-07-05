# Authoring machinable interfaces (read this first)

machinable is code all the way down: there is no metrics schema and no sweep DSL. You
express experiments, measurements, and even statistical questions as ordinary interface
code. machinable supplies identity, dedup, storage, search, and a few contracts. This
guide is the mental model plus the idioms that make first-try code correct.

## Mental model

- **Content-addressing & dedup.** An interface's identity is `hash(module +
  canonical(config))`. Same module + same *resolved* config means the same record (a
  cached no-op). A grid that re-`get(...).launch()`s is therefore incremental:
  already-run cells are skipped. Identity ignores how the config was *spelled* (see
  versions) and is robust to adding a config field with a default.
- **`.interfaces`** collects an aggregate's runs without executing them: it runs
  `launch()` inside a deferred `Execution` and gathers the grid instances. `.cached()`
  tells you which have results.
- **Predicates & scopes** distinguish runs that share a config: `with
  get('machinable.scope', {'seed': s}): ...` tags each run with `seed=s`.

## Config is always a pydantic `BaseModel`

```python
from pydantic import BaseModel
from machinable import Interface

class Train(Interface):
    class Config(BaseModel):     # plain dict / dataclass Config RAISES
        lr: float = 0.1
        layers: int = 2
```
Typed fields are coerced (`1` → `1.0`), which is what makes identity well-defined.
A field with no default is *required*. Nested `BaseModel`s are fine and preferred over
free-form `dict`s. Unknown keys are rejected (a typo raises `ConfigurationError`
instead of silently resolving to the defaults); set `model_config =
ConfigDict(extra="allow")` to accept free-form keys deliberately.

## Compact configuration: versions

Encode experiment axes as `version_*` methods, invoked as `~versions`, instead of
inlining parameter dicts:

```python
class Train(Interface):
    class Config(BaseModel):
        optimizer: str = "sgd"
        lr: float = 0.1

    def version_sgd(self):            # ~sgd
        return {"optimizer": "sgd", "lr": 0.1}

    def version_adam(self, lr=1e-3):  # ~adam  or  ~adam(lr=3e-4)
        return {"optimizer": "adam", "lr": lr}
```
Then a grid reads `for opt in ['~sgd', '~adam']: get('train', [opt]).launch()`, and
overrides stay small: `get('train', ['~adam', {'lr': 3e-4}])`. Nested overrides accept
dotted paths: `{'optimizer.lr': 3e-4}` expands to `{'optimizer': {'lr': 3e-4}}`.
Version spelling never affects identity: `['~adam']` and the dict it expands to are
the same record.
*Config methods* (a config value computed by a `config_<name>(self, ...)` method,
referenced as a string `"name(arg)"`) fold computed values in the same way.

## The quantity convention: how a run exposes a measurement

An inference asks an operand for one run's atomic measurement via a plain
`<quantity>()` accessor returning a `scalar` (one number) or a `series` (a curve):

```python
class Train(Interface):
    def loss(self):                       # scalar quantity
        return self.load_file("loss.json")["final"]

    def loss_curve(self):                 # series quantity: list of values or [step, value]
        return self.load_file("loss.json")["history"]
```
Accessors are useful on their own (call them in a notebook) and are what an inference
maps across `.interfaces`. If an inference needs an accessor you haven't written, it
raises a `NotImplementedError` naming what to implement; write it and re-run.

## Aggregates lay out the sweep in code (and are never materialized)

```python
class Optimizers(Interface):
    class Config(BaseModel):
        seeds: int = 10

    def launch(self):                     # the aggregate coordinates; it is ephemeral
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()

    def version_sgd(self):  return {"optimizer": "sgd"}
    def version_adam(self): return {"optimizer": "adam"}
```
The two operands are `get('optimizers', ['~sgd'])` and `get('optimizers', ['~adam'])`.

## Inferences: scientific questions as interfaces

An `Inference` subclass is a question; its `Config` is the *method* (`test`, `alpha`,
`quantity`); the operands are *subjects* passed via `.of(a, b)` (folded into the
predicate by config identity). It implements `test(samples)` and brings its own stats:

```python
from machinable import Inference
class Outperforms(Inference):
    requires = "scalar"
    class Config(BaseModel):
        quantity: str = "objective"
        test: str = "welch"
        alpha: float = 0.05
    def test(self, samples):
        from scipy import stats
        a, b = samples
        res = stats.ttest_ind(a, b, equal_var=False, alternative="greater")
        return {"claim": "a > b", "holds": res.pvalue < self.config.alpha,
                "p_value": float(res.pvalue), "alpha": self.config.alpha}
```
A verdict is a normal interface: reproducible, cached on `(method × operands)`,
searchable (`kind="Inference"`), and widget-surfaceable. Re-asking is a cached no-op.
There is no automatic staleness detection; to invalidate after results change, call
`verdict.cached(False)` and re-run.

## Identity affordances (for operands over external data)

- **`Field(default, identifying=False)`** excludes an environment-dependent field
  (e.g. a data URI that differs per machine) from identity:
  ```python
  from machinable import Field
  class Sorter(Interface):
      class Config(BaseModel):
          recording_uri: str = Field("", identifying=False)
          sorter: str = "simple"
      def on_compute_predicate(self):
          from machinable.config import predicate_from_manifest
          return predicate_from_manifest(self.config.recording_uri, "recording_id")
  ```
  The location is out of identity; a content predicate re-identifies the data, so a
  recording moved from `file://` to `s3://` reuses its cached result.
- **References** pass a factory or *another interface* as config via the
  `(module, version)` element form: store `("pkg:make", {"n": 8})` and resolve with
  `machinable.config.import_ref(self.config.x)`, or `get(*self.config.x)` for an
  interface. JSON-able and identifying.

## Collections: live runs, then pandas

A `Collection` (e.g. `iface.interfaces`) holds live interfaces: use
`.filter/.map/.first/.last`, relation traversal, `.launch()`, `find_many_by_id`. For
analysis, hand off to pandas: `df = runs.as_dataframe()` (flat columns: `uuid`,
`module`, `version`, `config.*`, `cached`, `label`), then `.query`/`.groupby`/`.agg`,
then round-trip by uuid: `runs.find_many_by_id(df.query("config.optimizer=='sgd'").uuid)`.
There is no `pluck`/`avg`/`implode`; that analytics surface was removed in favor of
pandas.

## Do / don't

- **Do** make `Config` a `BaseModel`; encode axes as `version_*`; return one run's
  value from `<quantity>()`; let dedup make grids incremental.
- **Don't** invent a metrics file format, a `log_metric` call, or a `sweep()` DSL;
  write the grid in Python. Don't put statistics in the operand; that's the
  inference's job. Don't hash a data location into identity; exclude it and use a
  content predicate.
