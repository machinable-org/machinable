# Inference

An [`Inference`](/reference/python/inference) turns a scientific question ("is A better than
B?", "does this beat the baseline?") into an interface. The question's answer, a
*verdict*, is content-addressed, cached, searchable, and reproducible like any other
run.

machinable ships only the contract; the statistics live in the inference implementation,
which brings its own scipy. A set of ready-made inferences ships with the
[MCP](/mcp/reference-inferences).

## The shape of an inference

An `Inference` is an `Interface`, parallel to an [`Execution`](./execution.md):

- the **subclass** is the question (`Outperforms`, `BeatsBaseline`, `Ranks`);
- the **`Config`** is the method (`test`, `alpha`, `quantity`);
- the **operands** are the subjects, passed via `.of(...)`, not config.

```python
from pydantic import BaseModel

from machinable import Inference


class Outperforms(Inference):
    requires = "scalar"                      # what one unit's quantity() yields

    class Config(BaseModel):
        quantity: str = "objective"
        test: str = "welch"
        tail: str = "greater"
        alpha: float = 0.05

    def test(self, samples):                 # one sample list per operand
        from scipy import stats
        a, b = samples
        res = stats.ttest_ind(a, b, equal_var=False, alternative=self.config.tail)
        return {
            "claim": "a outperforms b",
            "holds": bool(res.pvalue < self.config.alpha),
            "p_value": float(res.pvalue),
            "alpha": self.config.alpha,
        }
```

## Quantities: how operands supply numbers

The inference asks each operand for one run's atomic measurement via a plain
`<quantity>()` accessor returning a `scalar` (a number) or a `series` (a curve). The
inference collects it across the operand's runs (its cached
[`.interfaces`](./advanced-execution.md#aggregates-and-deferred-collection), or the
operand itself):

```python
class Train(Interface):
    def objective(self):                     # the scalar quantity
        return self.load_file("result.json")["score"]
```

## Asking the question

```python
from machinable import get

a = get("optimizers", ["~sgd"])
b = get("optimizers", ["~adam"])
a.launch(); b.launch()                       # compute the operands

verdict = get("inference.outperforms", {"quantity": "objective"}).of(a, b).launch().verdict()
# -> {"claim": "a outperforms b", "holds": True, "p_value": 0.004, ...}
```

## Identity = method × operands

The operands fold into the verdict's [predicate](./identity.md) (by config identity),
so a verdict's identity is the method times its operands. Same method + same operands
dedups, so re-asking the same question is a cached no-op, even across different version
spellings. Different operands or a different method are distinct verdicts. (Operands
can be ephemeral aggregates that are never materialized; they are referenced by
`catalog_identity_key`, which is computable without materialization.)

## The missing-accessor contract

If an operand doesn't expose the quantity you asked for, `resolve` raises a
`NotImplementedError` that names what to write:

```
Train has no 'objective()' accessor. Implement `def objective(self)` returning this run's
scalar (e.g. by sieving self.load_file(...)).
```

Write the accessor, re-run, and the verdict computes. This loop is what the
[MCP](/mcp/workflow) automates; why the contract is designed this way is in
[Design notes → Inference design](/design/inference).
