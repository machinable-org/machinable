"""examples://investigate, the whole research loop: "is SGD better than Adam?".

A minimal end-to-end project. Write each class into its own module: `Train` as
`train.py`, `Optimizers` as `optimizers.py`, `Outperforms` as e.g.
`inference/outperforms.py` (one Interface subclass per module). The `train` interface
exposes a `loss()` quantity, the `optimizers` aggregate sweeps seeds for its configured
arm (`~sgd`/`~adam`), and the question is asked with the `outperforms` inference.

Drive it from the MCP like this:

    launch("optimizers", ["~sgd"])          # 10 seeded runs (incremental, dedup'd)
    launch("optimizers", ["~adam"])
    outperforms(a="optimizers", a_version=["~sgd"],
                b="optimizers", b_version=["~adam"],
                quantity="loss", tail="less")     # lower loss = better
    # -> a verdict: "a is less b on 'loss'" with p_value, effect_size, n.
    # If `loss()` were missing, the tool returns a `needs` contract naming it; you
    # write_source it on `train`/`optimizers`, then re-run (cached thereafter).
"""

import random

from pydantic import BaseModel

from machinable import Inference, Interface, get


class Train(Interface):
    """One training run: its final loss depends on the optimizer + seed."""

    class Config(BaseModel):
        optimizer: str = "sgd"
        lr: float = 0.1

    def __call__(self):
        rng = random.Random(self.predicate.get("seed", 0))
        floor = 0.10 if self.config.optimizer == "sgd" else 0.16  # sgd a touch better
        self.save_file("loss.json", {"final": floor + 0.02 * rng.random()})

    def loss(self):  # the <quantity>(): one run's atomic measurement
        return self.load_file("loss.json")["final"]


class Optimizers(Interface):
    """Aggregate: sweep `seeds` runs of `train` for the configured optimizer arm."""

    class Config(BaseModel):
        seeds: int = 10

    def launch(self):
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()

    def version_sgd(self):
        return {"optimizer": "sgd", "lr": 0.1}

    def version_adam(self):
        return {"optimizer": "adam", "lr": 1e-3}


class Outperforms(Inference):
    """Two-sample Welch test: is operand A's quantity {greater|less} than B's?"""

    requires = "scalar"

    class Config(BaseModel):
        quantity: str = "loss"
        tail: str = "less"
        alpha: float = 0.05

    def test(self, samples):
        from scipy import stats

        a, b = samples
        res = stats.ttest_ind(a, b, equal_var=False, alternative=self.config.tail)
        return {
            "claim": f"a is {self.config.tail} b on {self.config.quantity!r}",
            "holds": bool(res.pvalue < self.config.alpha),
            "p_value": float(res.pvalue),
            "mean_a": sum(a) / len(a),
            "mean_b": sum(b) / len(b),
            "alpha": self.config.alpha,
        }
