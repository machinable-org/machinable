from typing import List, Optional

import os

import aim
from machinable import Interface, Storage
from pydantic import BaseModel, Field


class Aimstack(Storage):
    class Config(BaseModel):
        repo: str = "./storage"
        system_tracking_interval: Optional[int] = None
        log_system_params: Optional[bool] = False
        include: List[str] = Field(
            default_factory=lambda: ["machinable.component"]
        )

    def __init__(self, version=None):
        super().__init__(version=version)
        self._runs = {}
        self._repo = None

    @property
    def repo(self) -> aim.Repo:
        if self._repo is None:
            self._repo = aim.Repo(os.path.abspath(self.config.repo), init=True)

        return self._repo

    def contains(self, uuid: str) -> bool:
        try:
            query_res = self.repo.query_runs(
                f"run.uuid=='{uuid}'", report_mode=0
            ).iter_runs()
            runs = [item.run for item in query_res]
        except:
            runs = []
        return len(runs) == 1

    def commit(self, interface: "Interface") -> None:
        # only track target interfaces
        if set(interface.lineage).isdisjoint(self.config.include):
            return

        self._runs[interface.uuid] = run = aim.Run(
            repo=os.path.abspath(self.config.directory),
            read_only=False,
            experiment=interface.module,
            force_resume=False,
            system_tracking_interval=self.config.system_tracking_interval,
            log_system_params=self.config.log_system_params,
        )

        for k, v in interface.__model__.model_dump().items():
            run[k] = v
