from pydantic import BaseModel, Field, model_validator

from machinable import Interface


class Bounded(Interface):
    """Constrained config — the fixture for invalid-config reporting."""

    class Config(BaseModel):
        alpha: float = Field(default=0.5, ge=0.0, le=1.0, description="Weight.")
        n: int = 4
        labels: list = []

        @model_validator(mode="after")
        def labels_match_n(self):
            if self.labels and len(self.labels) != self.n:
                raise ValueError(
                    f"labels has {len(self.labels)} entries but n is {self.n}"
                )
            return self

    def __call__(self):
        print("bounded ran")
