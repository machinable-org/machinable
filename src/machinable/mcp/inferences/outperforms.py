"""``Outperforms``: is operand A's quantity greater than operand B's?

A reference inference (shareable, not core). Two operands; ``quantity()`` yields one
scalar per run; a two-sample test decides the claim.
"""

from __future__ import annotations

from pydantic import BaseModel

from machinable import Inference
from machinable.mcp.inferences._stats import cohens_d, two_sample


class Outperforms(Inference):
    requires = "scalar"

    class Config(BaseModel):
        quantity: str = "objective"
        test: str = "welch"  # welch | student | mannwhitney
        tail: str = "greater"  # greater | less | two-sided
        alpha: float = 0.05

    def test(self, samples):
        a, b = samples
        statistic, p_value = two_sample(
            a, b, test=self.config.test, tail=self.config.tail
        )
        return {
            "claim": f"a is {self.config.tail} b on {self.config.quantity!r}",
            "holds": bool(p_value < self.config.alpha),
            "test": self.config.test,
            "statistic": statistic,
            "p_value": p_value,
            "effect_size": cohens_d(a, b),
            "n_a": len(a),
            "n_b": len(b),
            "alpha": self.config.alpha,
        }
