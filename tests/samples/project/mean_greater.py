from pydantic import BaseModel

from machinable import Inference


class MeanGreater(Inference):
    """A trivial reference inference (no stats dependency): is a's mean > b's?"""

    class Config(BaseModel):
        quantity: str = "score"

    requires = "scalar"

    def test(self, samples):
        a, b = samples
        mean_a, mean_b = sum(a) / len(a), sum(b) / len(b)
        return {
            "claim": "a > b",
            "holds": mean_a > mean_b,
            "mean_a": mean_a,
            "mean_b": mean_b,
            "n_a": len(a),
            "n_b": len(b),
        }
