# Reference inferences

A small set of well-tested [inferences](/guide/inference) ships with the MCP extra
(under `machinable.mcp.inferences`). They are shareable implementations, not core; each
brings its own `scipy` statistics, and they back the inference tools. You write your own
the same way (`add-inference`), or share one by URL like any interface.

| Inference / tool | Requires | Operands | Question |
| --- | --- | --- | --- |
| **`Outperforms`** (`outperforms` / `differs`) | `scalar` | 2 | Is A's quantity greater than B's? (Welch / Student / Mann-Whitney; `differs` is two-sided) |
| **`BeatsBaseline`** (`beats_baseline`) | `scalar` | 1 | Does A's quantity beat a fixed baseline? (one-sample t-test) |
| **`Ranks`** (`ranks`) | `scalar` | ≥3 | Do the operands differ, and how do they rank? (Friedman omnibus + mean ranks) |
| **`ConvergesFaster`** (`converges_faster`) | `series` | 2 | Does A's curve reach its target sooner? (AUC or steps-to-threshold, then a two-sample test) |

## Verdicts

Every verdict is a JSON-able dict with a `claim`, a boolean `holds`, the `p_value`, the
sample sizes, and `alpha`, plus inference-specific fields (effect size, mean ranks, the
summary used). It is saved as `verdict.json` on a normal interface, so it is
reproducible, cached on `(method × operands)`, searchable (`kind="Inference"`), and can
be surfaced as a [widget](/guide/widgets).

## Using them

From the MCP, call the tool (`outperforms(a=…, b=…, quantity=…)`). From Python, resolve
the module directly:

```python
from machinable import get

a, b = get("optimizers", ["~sgd"]), get("optimizers", ["~adam"])
a.launch(); b.launch()

verdict = (
    get("machinable.mcp.inferences.outperforms", {"quantity": "loss", "tail": "less"})
    .of(a, b)
    .launch()
    .verdict()
)
```

## Multiple comparisons

Correction is implementation, enabled by the searchable `kind`. Where the family is the
operand set, `Ranks` runs the omnibus itself. Where comparisons span many calls, the
`kind="Inference"` search makes the family enumerable, so a correction is expressible as
another inference over a set of verdicts (e.g. a `HolmCorrected(verdicts)`), also in
userspace. machinable makes the family discoverable; it never corrects silently.
