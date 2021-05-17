from typing import TYPE_CHECKING, Optional

import os
from datetime import datetime

from machinable.collection.execution import ExecutionCollection
from machinable.element import Element, has_many

if TYPE_CHECKING:
    from machinable.execution import Execution


class Repository(Element):
    """Repository base class

    # Arguments
    name: defines the repository path name
        May contain the following variables:
        - &EXPERIMENT will be replaced by the experiment name
        - &PROJECT will be replaced by project name
        - %x expressions will be replaced by strftime
    """

    def __init__(self, name: Optional[str] = None):
        super().__init__()
        self._name = name

    def name(self, name: Optional[str] = None) -> "Execution":
        """Sets the name of the execution

        The name is used as relative storage path

        # Arguments
        name: Name, defaults to '%U_%a_&NICKNAME'
            May contain the following variables:
            - &PROJECT will be replaced by project name
            - &NICKNAME will be replaced by the random nickname of the execution
            - %x expressions will be replaced by strftime
            The variables are expanded following GNU bash's variable expansion rules, e.g.
            `&{NICKNAME:-default_value}` or `&{PROJECT:?}` can be used.
        """
        if name is None:
            name = get_settings()["default_name"]

        if name is None:
            name = "%U_%a_&NICKNAME"

        if not isinstance(name, str):
            raise ValueError(f"Name has to be a str. '{name}' given.")

        # expand % variables
        name = expand(
            name,
            environ={
                "PROJECT": self.project.name or "",
                "NICKNAME": self.nickname,
            },
            var_symbol="&",
        )
        # apply strftime
        name = datetime.now().strftime(name)

        name = os.path.normpath(name)

        self.name = name

        return self

    def commit(self, execution: "Execution"):
        if execution.is_mounted():
            raise NotImplementedError  # todo: handle duplicates

        self.__storage__.create_execution(
            # todo: host_info, code_version, code_diff, seed
            execution=self.to_model(),
            experiments=[
                experiment.to_model() for experiment in self._experiments
            ],
        )

        self.__related__["executions"] = execution
        execution.__related__["repository"] = self

    @has_many
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution, ExecutionCollection
