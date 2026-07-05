"""examples://inference: a scientific question as an Inference subclass.

The subclass is the question; Config is the *method* (test/alpha/quantity); operands are
subjects via `.of(...)`. Implement `test(samples)` (one sample list per operand,
`quantity()` collected across its runs) and bring your own statistics.
"""

from pydantic import BaseModel

from machinable import Inference


class Outperforms(Inference):
    requires = "scalar"  # quantity() yields one number per run

    class Config(BaseModel):
        quantity: str = "objective"
        test: str = "welch"
        tail: str = "greater"
        alpha: float = 0.05

    def test(self, samples):
        from scipy import stats  # the inference brings its own statistics

        a, b = samples
        res = stats.ttest_ind(a, b, equal_var=False, alternative=self.config.tail)
        return {
            "claim": f"a is {self.config.tail} b on {self.config.quantity!r}",
            "holds": bool(res.pvalue < self.config.alpha),
            "p_value": float(res.pvalue),
            "statistic": float(res.statistic),
            "n_a": len(a),
            "n_b": len(b),
            "alpha": self.config.alpha,
        }


# usage:
#   get("inference.outperforms", {"quantity": "loss", "tail": "less"}) \
#       .of(get("optimizers", ["~sgd"]), get("optimizers", ["~adam"]))()
