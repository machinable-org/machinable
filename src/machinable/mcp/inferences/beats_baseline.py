"""``BeatsBaseline``: does operand A's quantity beat a fixed baseline value?

One operand; ``quantity()`` yields one scalar per run; a one-sample t-test against
``baseline`` decides the claim.
"""

from __future__ import annotations

from pydantic import BaseModel

from machinable import Inference
from machinable.mcp.inferences._stats import one_sample


class BeatsBaseline(Inference):
    requires = "scalar"

    class Config(BaseModel):
        quantity: str = "objective"
        baseline: float = 0.0
        tail: str = "greater"  # greater | less | two-sided
        alpha: float = 0.05

    def test(self, samples):
        (a,) = samples
        statistic, p_value = one_sample(a, self.config.baseline, tail=self.config.tail)
        mean = sum(a) / len(a) if a else float("nan")
        return {
            "claim": f"mean {self.config.quantity!r} is {self.config.tail} "
            f"{self.config.baseline}",
            "holds": bool(p_value < self.config.alpha),
            "test": "one_sample_t",
            "statistic": statistic,
            "p_value": p_value,
            "mean": mean,
            "baseline": self.config.baseline,
            "n": len(a),
            "alpha": self.config.alpha,
        }
