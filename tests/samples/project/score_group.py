from pydantic import BaseModel

from machinable import Interface, get


class ScoreGroup(Interface):
    """An aggregate that lays out a grid of ScoreTrials in code."""

    class Config(BaseModel):
        points: tuple = ()

    def launch(self):
        for v in self.config.points:
            get("score_trial", {"value": v}).launch()
