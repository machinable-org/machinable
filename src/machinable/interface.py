from __future__ import annotations

import shlex
import sys

from flatten_dict import flatten
from machinable.settings import get_settings

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from machinable import schema
from machinable.collection import ElementCollection, ExecutionCollection
from machinable.element import (
    Element,
    belongs_to,
    get_dump,
    get_lineage,
    has_many,
)
from machinable.project import Project
from machinable.storage import Storage


class Interface(Element):
    kind = "Interface"
    default = get_settings().default_interface

    def __init__(
        self,
        version: VersionType = None,
        uses: Union[None, Element, List[Element]] = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Interface(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        self.__related__["uses"] = ElementCollection()
        if uses:
            self.use(uses)

    def to_cli(self) -> str:
        cli = [self.module]
        for v in self.__model__.version:
            if isinstance(v, str):
                cli.append(v)
            else:
                cli.extend(
                    [
                        f"{key}={shlex.quote(str(val))}"
                        for key, val in flatten(v, reducer="dot").items()
                    ]
                )

        return " ".join(cli)

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    @has_many
    def uses() -> ElementCollection:
        return Element, ElementCollection

    @has_many
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution, ExecutionCollection

    @belongs_to
    def execution() -> Execution:
        from machinable.execution import Execution

        return Execution, False

    def use(self, use: Union[Element, List[Element]]) -> Experiment:
        self._assert_editable()

        if isinstance(use, (list, tuple)):
            for _use in use:
                self.use(_use)
            return self

        if not isinstance(use, Element):
            raise ValueError(f"Expected element, but found: {type(use)} {use}")

        self.__related__["uses"].append(use)

        return self

    def launch(self) -> Self:
        from machinable.execution import Execution

        execution = Execution.get()

        execution.add(self)

        if Execution.is_connected():
            # commit only, defer execution
            self.commit()
        else:
            execution.dispatch()

        return self

    @property
    def resources(self) -> Optional[Dict]:
        if self.execution is None:
            return None
        return self.execution.load_file(
            f"resources-{self.experiment_id}.json", None
        )

    def dispatch() -> Self:
        self.__call__()
        return self

    def cached(self) -> bool:
        return False

    def __call__(self) -> None:
        """Main code"""

    def dispatch_code(self, inline: bool = True) -> Optional[str]:
        storage = Storage.get().as_json().replace('"', '\\"')
        code = f"""
        from machinable import Project, Storage, Experiment
        from machinable.errors import StorageError
        Project('{Project.get().path()}').__enter__()
        Storage.from_json('{storage}').__enter__()
        experiment__ = Experiment.find('{self.experiment_id}', timestamp={self.timestamp})
        experiment__.dispatch()
        """

        if inline:
            code = code.replace("\n        ", ";")[1:-1]
            return f'{sys.executable} -c "{code}"'

        return code.replace("        ", "")[1:-1]
