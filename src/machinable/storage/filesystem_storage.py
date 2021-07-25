from typing import TYPE_CHECKING, Any, List, Optional, Union

import json
import os
import sqlite3

import arrow
from machinable import schema
from machinable.errors import StorageError
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, JsonableType, VersionType
from machinable.utils import load_file, save_file

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.element import Element


class FilesystemStorage(Storage):
    class Config:
        """Config annotation"""

        directory: Optional[str]

    def __init__(
        self,
        config: dict,
        version: VersionType,
        parent: Union["Element", "Component", None] = None,
    ):
        super().__init__(config, version=version, parent=parent)
        if self.config.directory is None:
            return
        os.makedirs(self.config.directory, exist_ok=True)
        self._db_file = os.path.join(self.config.directory, "storage.sqlite")
        self._db = sqlite3.connect(self._db_file)
        self._migrate(self._db)

    def _migrate(self, database):
        cur = database.cursor()
        version = cur.execute("PRAGMA user_version;").fetchone()[0]
        if version == 0:
            # initial migration
            cur.execute(
                """CREATE TABLE executions (
                    id integer PRIMARY KEY,
                    storage_id text NOT NULL,
                    engine json,
                    nickname text,
                    timestamp real,
                    seed integer,
                    'grouping_id' integer,
                    FOREIGN KEY (grouping_id) REFERENCES groupings (id)
                )"""
            )
            cur.execute(
                """CREATE TABLE experiments (
                    id integer PRIMARY KEY,
                    storage_id text NOT NULL,
                    interface json,
                    uses json,
                    experiment_id text,
                    resources json,
                    seed integer,
                    config json,
                    execution_id integer,
                    timestamp real,
                    ancestor_id integer,
                    FOREIGN KEY (execution_id) REFERENCES executions (id)
                    FOREIGN KEY (ancestor_id) REFERENCES experiments (id)
                )"""
            )
            cur.execute(
                """CREATE TABLE groupings (
                    id integer PRIMARY KEY,
                    'group' text,
                    pattern text
                )"""
            )
            cur.execute("PRAGMA user_version = 1;")
            database.commit()
            version += 1
        if version == 1:
            # future migrations
            pass

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping],
        project: schema.Project,
    ) -> str:
        primary_directory = None
        for i, experiment in enumerate(experiments):
            self.create_experiment(
                experiment=experiment,
                execution=execution,
                grouping=grouping,
                project=project,
            )
            execution_directory = os.path.join(
                experiment._storage_id, "execution"
            )
            if i == 0:
                # create primary directory
                primary_directory = execution_directory
                os.makedirs(primary_directory, exist_ok=True)
            else:
                # symlink to primary directory
                os.symlink(
                    primary_directory,
                    execution_directory,
                    target_is_directory=True,
                )
        # write execution data
        save_file(
            os.path.join(execution_directory, "execution.json"),
            {
                **execution.dict(),
                "_related_experiments": [
                    f"../../{os.path.basename(experiment._storage_id)}"
                    for experiment in experiments
                ],
            },
        )

        cur = self._db.cursor()

        row = cur.execute(
            """SELECT id FROM groupings WHERE 'group'=?""",
            (grouping.group,),
        ).fetchone()
        if row is None:
            cur.execute(
                """INSERT INTO groupings ('pattern', 'group') VALUES (?,?)""",
                (grouping.pattern, grouping.group),
            )
            self._db.commit()
            grouping_id = cur.lastrowid
        else:
            grouping_id = row["id"]

        cur.execute(
            """INSERT INTO executions (
                storage_id,
                engine,
                nickname,
                timestamp,
                seed,
                'grouping_id'
                ) VALUES (?,?,?,?,?,?)""",
            (
                primary_directory,
                json.dumps(execution.engine),
                execution.nickname,
                execution.timestamp,
                execution.seed,
                grouping_id,
            ),
        )
        self._db.commit()
        execution_id = cur.lastrowid
        for experiment in experiments:
            ancestor_id = cur.execute(
                """SELECT id FROM experiments WHERE experiment_id=? AND timestamp=?""",
                (experiment.derived_from_id, experiment.derived_from_timestamp),
            ).fetchone()
            if ancestor_id:
                ancestor_id = ancestor_id[0]
            cur.execute(
                """INSERT INTO experiments(
                    storage_id,
                    interface,
                    uses,
                    experiment_id,
                    resources,
                    seed,
                    config,
                    execution_id,
                    timestamp,
                    ancestor_id
                    ) VALUES (?,?,?,?,?,?,?,?,?,?)""",
                (
                    experiment._storage_id,
                    json.dumps(experiment.interface),
                    json.dumps(experiment.uses),
                    experiment.experiment_id,
                    json.dumps(experiment.resources),
                    experiment.seed,
                    json.dumps(experiment.config),
                    execution_id,
                    experiment.timestamp,
                    ancestor_id,
                ),
            )
        self._db.commit()

        return primary_directory

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        execution: schema.Execution,
        grouping: schema.Grouping,
        project: schema.Project,
    ) -> str:
        grouping = self.create_grouping(grouping)

        path, prefix = os.path.split(grouping._storage_id)

        timestamp = int(execution.timestamp)

        derived_from = None
        if experiment.derived_from_id is not None:
            derived_from = self.find_experiment(
                experiment.derived_from_id, experiment.derived_from_timestamp
            )

        directory = os.path.join(
            path,
            f"{prefix}{'-' if prefix else ''}{experiment.experiment_id}",
        )

        if derived_from is not None:
            storage_id = os.path.join(derived_from, "derived", directory)
        else:
            if self.config.directory is not None:
                storage_id = os.path.join(
                    os.path.abspath(self.config.directory), directory
                )
            else:
                if not isinstance(experiment._storage_id, str):
                    raise StorageError(
                        "Can not write the experiment as no storage directory was provided. Set a storage directory or use Experiment.set_filesystem()."
                    )
                storage_id = experiment._storage_id

        save_file(
            os.path.join(storage_id, "experiment.json"),
            experiment.dict(),
            makedirs=True,
        )

        return storage_id

    def _create_grouping(self, grouping: schema.Grouping) -> str:
        # directory is created implicitly during experiment creation
        # so we just return the resolved group
        return grouping.group

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        return save_file(
            os.path.join(experiment._storage_id, "records", f"{scope}.jsonl"),
            data=data,
            mode="a",
        )

    def _mark_started(
        self, experiment: schema.Experiment, timestamp: DatetimeType
    ) -> None:
        save_file(
            os.path.join(experiment._storage_id, "started_at"),
            str(timestamp) + "\n",
            # starting event can occur multiple times
            mode="a",
        )

    def _update_heartbeat(
        self,
        experiment: schema.Experiment,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        save_file(
            os.path.join(experiment._storage_id, "heartbeat_at"),
            str(timestamp),
            mode="w",
        )
        if mark_finished:
            save_file(
                os.path.join(experiment._storage_id, "finished_at"),
                str(timestamp),
            )

    def _retrieve_status(
        self, experiment_storage_id: str, field: str
    ) -> Optional[str]:
        status = load_file(
            os.path.join(experiment_storage_id, f"{field}_at"), default=None
        )
        if status is None:
            return None
        if field == "started":
            # can have multiple rows, return latest
            return status.strip("\n").split("\n")[-1]
        return status

    def _find_experiment(
        self, experiment_id: str, timestamp: float = None
    ) -> Optional[str]:
        cur = self._db.cursor()
        if timestamp is not None:
            query = cur.execute(
                """SELECT storage_id FROM experiments WHERE experiment_id=? AND timestamp=?""",
                (experiment_id, timestamp),
            )
        else:
            query = cur.execute(
                """SELECT storage_id FROM experiments WHERE experiment_id=?""",
                (experiment_id,),
            )
        result = query.fetchone()
        if result:
            return result[0]

        return None

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return schema.Execution(
            **load_file(os.path.join(storage_id, "execution.json")),
        )

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        return schema.Experiment(
            **load_file(os.path.join(storage_id, "experiment.json")),
        )

    def _retrieve_grouping(self, storage_id: str) -> schema.Grouping:
        cur = self._db.cursor()
        row = cur.execute(
            """SELECT `group`, `pattern` FROM groupings WHERE `group`=?""",
            (storage_id,),
        ).fetchone()
        return schema.Grouping(group=row[0], pattern=row[1])

    def _retrieve_records(
        self, experiment_storage_id: str, scope: str
    ) -> List[JsonableType]:
        return load_file(
            os.path.join(experiment_storage_id, "records", f"{scope}.jsonl"),
            default=[],
        )

    def _retrieve_output(self, experiment_storage_id: str) -> str:
        return self._retrieve_file(experiment_storage_id, "output.log")

    def _local_directory(
        self, experiment_storage_id: str, *append: str
    ) -> Optional[str]:
        return os.path.join(experiment_storage_id, *append)

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        if relation == "experiment.execution":
            directory = os.path.join(storage_id, "execution")
            if not os.path.isdir(directory):
                return None
            return directory
        if relation == "execution.experiments":
            return [
                os.path.normpath(os.path.join(storage_id, p))
                for p in load_file(os.path.join(storage_id, "execution.json"))[
                    "_related_experiments"
                ]
            ]
        if relation == "grouping.executions":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT executions.storage_id FROM executions
                LEFT JOIN groupings ON executions.grouping_id = groupings.id
                WHERE groupings.`group`=?""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "execution.grouping":
            cur = self._db.cursor()
            row = cur.execute(
                """SELECT groupings.`group` FROM executions
                LEFT JOIN groupings ON executions.grouping_id = groupings.id
                WHERE executions.storage_id=?""",
                (storage_id,),
            ).fetchone()
            if row:
                return row[0]
        if relation == "experiment.derived":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT storage_id FROM experiments WHERE ancestor_id=(SELECT id FROM experiments WHERE storage_id=?)""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "experiment.ancestor":
            cur = self._db.cursor()
            row = cur.execute(
                """SELECT e.storage_id FROM experiments e INNER JOIN experiments m ON m.ancestor_id=e.id WHERE m.storage_id=?""",
                (storage_id,),
            ).fetchone()
            if row:
                return row[0]
        return None

    def _create_file(
        self, experiment_storage_id: str, filepath: str, data: Any
    ) -> str:
        return save_file(
            os.path.join(experiment_storage_id, filepath), data, makedirs=True
        )

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return load_file(
            os.path.join(experiment_storage_id, filepath), default=None
        )
