# The research workflow

The headline prompt is `investigate(hypothesis)`. It frames a question and drives it to
a validated verdict. Here is the loop it runs for "is SGD faster than Adam on this
problem?".

## 1. Frame

The agent reads `guide://authoring`, `inferences://catalog`, and
`examples://investigate`, then `list_modules` to see what the project already has. Say
it finds a `train` interface but no optimizer sweep.

## 2. Scaffold the aggregate

It writes an [aggregate](/guide/advanced-execution#aggregates-and-deferred-collection) that
sweeps seeds for its configured arm, encoding the axis as
[version methods](/guide/versions):

```python [optimizers.py]
from pydantic import BaseModel
from machinable import Interface, get


class Optimizers(Interface):
    class Config(BaseModel):
        seeds: int = 10

    def launch(self):
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()

    def version_sgd(self):  return {"optimizer": "sgd"}
    def version_adam(self): return {"optimizer": "adam"}
```

`write_source` re-imports the module and returns any import/syntax error, so the agent
fixes mistakes immediately. You approve the write.

## 3. Launch

```
launch("optimizers", ["~sgd"])
launch("optimizers", ["~adam"])
```

20 runs total, content-addressed and incremental. `run_status` polls until they're
cached.

## 4. Ask the question

```
converges_faster(a="optimizers", a_version=["~sgd"],
                 b="optimizers", b_version=["~adam"], quantity="loss_curve")
```

If `train` has no `loss_curve()` accessor yet, the tool returns the contract:

```
needs: Train has no 'loss_curve()' accessor. Implement `def loss_curve(self)` returning
this run's series (e.g. by sieving self.load_file(...)).
```

The agent writes it:

```python
def loss_curve(self):
    return self.load_file("loss.json")["history"]
```

After the hot re-import and a re-run, it gets a verdict:

```json
{"claim": "a converges faster than b", "holds": true, "p_value": 0.004, "summary": "auc"}
```

Re-asking the same question is now a cached no-op (same method × operands), even if the
operands are spelled differently.

## 5. Surface and validate

`scaffold-widget` produces a convergence-curve widget bound to the verdict interface;
`read_widget_result` confirms the numbers structurally. You see a figure labeled by
version (`~sgd` / `~adam`) and the reproducible `(module, version)` operand spec.
Follow-ups ("add `~rmsprop`", "use Wilcoxon") only run the new work.
