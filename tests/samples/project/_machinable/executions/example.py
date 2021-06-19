from machinable import Execution, project


class Example(Execution):
    @property
    def is_extended(self) -> bool:
        return True
