from pydantic import BaseModel

from machinable import Interface


class ScoreTrial(Interface):
    class Config(BaseModel):
        value: float = 0.0

    def score(self):
        return float(self.config.value)
