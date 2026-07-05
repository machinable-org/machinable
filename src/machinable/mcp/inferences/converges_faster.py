"""``ConvergesFaster``: does A's curve reach its target sooner than B's?

A ``series`` inference: ``quantity()`` yields a convergence curve per run (a list of
values, or ``[step, value]`` pairs). Each curve is reduced to a scalar (AUC, or
steps-to-threshold), then a two-sample test compares; "faster" = a *smaller* summary.
"""

from __future__ import annotations

from pydantic import BaseModel

from machinable import Inference
from machinable.mcp.inferences._stats import reduce_curve, two_sample


class ConvergesFaster(Inference):
    requires = "series"

    class Config(BaseModel):
        quantity: str = "loss_curve"
        summary: str = "auc"  # auc | steps_to_threshold
        threshold: float = 0.0
        test: str = "welch"  # welch | student | mannwhitney
        alpha: float = 0.05

    def test(self, samples):
        a_curves, b_curves = samples
        a = [
            reduce_curve(
                c, summary=self.config.summary, threshold=self.config.threshold
            )
            for c in a_curves
        ]
        b = [
            reduce_curve(
                c, summary=self.config.summary, threshold=self.config.threshold
            )
            for c in b_curves
        ]
        # "a converges faster than b" == a's summary is smaller -> one-sided 'less'
        statistic, p_value = two_sample(a, b, test=self.config.test, tail="less")
        return {
            "claim": f"a converges faster than b ({self.config.summary} of "
            f"{self.config.quantity!r})",
            "holds": bool(p_value < self.config.alpha),
            "test": self.config.test,
            "summary": self.config.summary,
            "statistic": statistic,
            "p_value": p_value,
            "mean_a": sum(a) / len(a) if a else float("nan"),
            "mean_b": sum(b) / len(b) if b else float("nan"),
            "n_a": len(a),
            "n_b": len(b),
            "alpha": self.config.alpha,
        }
