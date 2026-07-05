"""``Ranks``: do k operands differ, and how do they rank? (Friedman omnibus).

Three or more operands measured over *paired* replicates (aligned by replicate
index). Reports the omnibus p-value and each operand's mean rank.
"""

from __future__ import annotations

from pydantic import BaseModel

from machinable import Inference


class Ranks(Inference):
    requires = "scalar"

    class Config(BaseModel):
        quantity: str = "objective"
        alpha: float = 0.05
        direction: str = "greater"  # greater = higher quantity ranks better

    def test(self, samples):
        import numpy as np
        from scipy import stats

        if len(samples) < 3:
            raise ValueError("Ranks needs at least 3 operands (Friedman omnibus)")
        n = min(len(s) for s in samples)
        if n < 2:
            raise ValueError("Ranks needs >=2 paired replicates per operand")
        cols = [list(s)[:n] for s in samples]  # align by replicate index
        statistic, p_value = stats.friedmanchisquare(*cols)

        matrix = np.asarray(cols, dtype=float)  # (k operands, n blocks)
        per_block = np.zeros_like(matrix)
        for j in range(n):
            block = matrix[:, j]
            per_block[:, j] = stats.rankdata(
                block if self.config.direction == "less" else -block
            )  # rank 1 = best
        mean_ranks = per_block.mean(axis=1).tolist()
        ranking = sorted(range(len(samples)), key=lambda i: mean_ranks[i])
        return {
            "claim": f"the {len(samples)} operands differ on {self.config.quantity!r}",
            "holds": bool(p_value < self.config.alpha),
            "test": "friedman",
            "statistic": float(statistic),
            "p_value": float(p_value),
            "mean_ranks": mean_ranks,
            "ranking": ranking,  # operand indices, best first
            "k": len(samples),
            "n_blocks": n,
            "alpha": self.config.alpha,
        }
