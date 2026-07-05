from pydantic import BaseModel

from machinable import Execution


class Dummy(Execution):
    class Config(BaseModel):
        a: int = 1
        ignore_me_: int = -1

    def name(self):
        return "dummy"
