from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

import json
import os

try:
    from pysqlite3 import dbapi2 as sqlite3
except ModuleNotFoundError:
    import sqlite3

from machinable import schema
from machinable.errors import StorageError
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, JsonableType, VersionType
from machinable.utils import load_file, save_file, timestamp_to_directory

if TYPE_CHECKING:
    from machinable.element import Element


def _jn(data: Any) -> str:
    return json.dumps(data, sort_keys=True, separators=(",", ":"))


class Filesystem(Storage):
    class Config:
        """Config annotation"""

        directory: Optional[str] = None

    def __init__(
        self,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        super().__init__(version=version, default_group=default_group)
        self._db = None

    @property
    def sqlite_file(self) -> str:
        return os.path.join(self.config.directory or "", "storage.sqlite")

    def migrate(self) -> bool:
        if self._db is not None:
            # already connected
            return False
        if self.config.directory is None:
            raise StorageError("No filesystem directory was provided.")
        os.makedirs(self.config.directory, exist_ok=True)
        self._db = sqlite3.connect(self.sqlite_file)
        self._migrate(self._db)
        return True

    def is_migrated(self):
        return os.path.isfile(self.sqlite_file)

    def _migrate(self, database):
        cur = database.cursor()
        version = cur.execute("PRAGMA user_version;").fetchone()[0]
        if version == 0:
            # initial migration
            cur.execute(
                """CREATE TABLE executions (
                    id integer PRIMARY KEY,
                    storage_id text NOT NULL,
                    nickname text,
                    module text,
                    config json,
                    version json,
                    predicate json,
                    timestamp real
                )"""
            )
            cur.execute(
                """CREATE TABLE experiments (
                    id integer PRIMARY KEY,
                    storage_id text NOT NULL,
                    module text,
                    config json,
                    version json,
                    predicate json,
                    experiment_id text,
                    seed integer,
                    execution_id integer,
                    timestamp integer,
                    ancestor_id integer,
                    'group_id' integer,
                    project_id integer,
                    FOREIGN KEY (group_id) REFERENCES groups (id)
                    FOREIGN KEY (project_id) REFERENCES projects (id)
                    FOREIGN KEY (execution_id) REFERENCES executions (id)
                    FOREIGN KEY (ancestor_id) REFERENCES experiments (id)
                )"""
            )
            cur.execute(
                """CREATE TABLE elements (
                    id integer PRIMARY KEY,
                    storage_id text,
                    module text,
                    config json,
                    version json,
                    predicate json,
                    experiment_id integer,
                    FOREIGN KEY (experiment_id) REFERENCES experiments (id)
                )"""
            )
            cur.execute(
                """CREATE TABLE groups (
                    id integer PRIMARY KEY,
                    path text,
                    pattern text
                )"""
            )
            cur.execute(
                """CREATE TABLE projects (
                    id integer PRIMARY KEY,
                    directory text,
                    name text NOT NULL UNIQUE
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
    ) -> str:
        self.migrate()

        suffix = timestamp_to_directory(execution.timestamp)
        for experiment in experiments:
            execution_directory = os.path.join(
                experiment._storage_id, f"execution-{suffix}"
            )
            save_file(
                os.path.join(execution_directory, "execution.json"),
                execution.dict(),
                makedirs=True,
            )

        cur = self._db.cursor()
        cur.execute(
            """INSERT INTO executions (
            storage_id,
            nickname,
            module,
            config,
            version,
            predicate,
            timestamp
            ) VALUES (?,?,?,?,?,?,?)""",
            (
                execution_directory,
                execution.nickname,
                execution.module,
                _jn(execution.config),
                _jn(execution.version),
                _jn(execution.predicate),
                execution.timestamp,
            ),
        )
        self._db.commit()
        execution_id = cur.lastrowid
        for experiment in experiments:
            cur.execute(
                """UPDATE experiments SET
                execution_id=?
                WHERE experiment_id=? AND timestamp=?""",
                (execution_id, experiment.experiment_id, experiment.timestamp),
            )
            self._db.commit()

        return execution_directory

    def _create_element(
        self,
        element: schema.Element,
        experiment: schema.Experiment,
        _experiment_db_id: Optional[int] = None,
    ) -> str:
        self.migrate()

        # find experiment
        if not _experiment_db_id:
            _experiment_db_id = cur.execute(
                """SELECT id FROM experiments WHERE experiment_id=? AND timestamp=?""",
                (experiment.experiment_id, experiment.timestamp),
            ).fetchone()
            if not _experiment_db_id:
                raise StorageError("Invalid experiment")
            _experiment_db_id = _experiment_db_id[0]

        cur = self._db.cursor()
        cur.execute(
            """INSERT INTO elements (
            storage_id,
            module,
            config,
            version,
            predicate,
            experiment_id
            ) VALUES (?,?,?,?,?,?)""",
            (
                None,
                element.module,
                _jn(element.config),
                _jn(element.version),
                _jn(element.predicate),
                _experiment_db_id,
            ),
        )
        self._db.commit()
        storage_id = cur.lastrowid

        cur.execute(
            """UPDATE elements SET storage_id=? WHERE id=?""",
            (str(storage_id), storage_id),
        )
        self._db.commit()

        return storage_id

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        group: schema.Group,
        project: schema.Project,
        uses: List[schema.Element],
    ) -> str:
        self.migrate()

        project = self.create_project(project)
        group = self.create_group(group)
        head, tail = os.path.split(group.path)
        directory = os.path.join(
            head,
            f"{tail}{'-' if tail else ''}{experiment.experiment_id}",
        )
        derived_from = None
        if experiment.derived_from_id is not None:
            derived_from = self.find_experiment(
                experiment.derived_from_id, experiment.derived_from_timestamp
            )

        if derived_from is not None:
            storage_id = os.path.join(
                derived_from, "derived", experiment.experiment_id
            )
        else:
            if self.config.directory is not None:
                storage_id = os.path.join(
                    os.path.abspath(self.config.directory), directory
                )
            else:
                if not isinstance(experiment._storage_id, str):
                    raise StorageError(
                        "Can not write the experiment as no storage directory was provided."
                    )
                storage_id = experiment._storage_id

        save_file(
            os.path.join(storage_id, "experiment.json"),
            experiment.dict(),
            makedirs=True,
        )

        save_file(
            os.path.join(storage_id, "project.json"),
            project.dict(),
            makedirs=True,
        )

        save_file(
            os.path.join(storage_id, "uses.json"),
            [use.dict() for use in uses],
            makedirs=True,
        )

        cur = self._db.cursor()
        ancestor_id = cur.execute(
            """SELECT id FROM experiments WHERE experiment_id=? AND timestamp=?""",
            (experiment.derived_from_id, experiment.derived_from_timestamp),
        ).fetchone()
        if ancestor_id:
            ancestor_id = ancestor_id[0]
        group_id = cur.execute(
            """SELECT id FROM groups WHERE path=?""",
            (group.path,),
        ).fetchone()
        if group_id:
            group_id = group_id[0]
        project_id = cur.execute(
            """SELECT id FROM projects WHERE name=?""",
            (project.name,),
        ).fetchone()
        if project_id:
            project_id = project_id[0]
        cur.execute(
            """INSERT INTO experiments(
                storage_id,
                module,
                config,
                version,
                predicate,
                experiment_id,
                seed,
                seed,
                timestamp,
                'group_id',
                project_id,
                ancestor_id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                storage_id,
                experiment.module,
                _jn(experiment.config),
                _jn(experiment.version),
                _jn(experiment.predicate),
                experiment.experiment_id,
                experiment.seed,
                experiment.seed,
                experiment.timestamp,
                group_id,
                project_id,
                ancestor_id,
            ),
        )
        self._db.commit()
        experiment_id = cur.lastrowid

        experiment._storage_id = storage_id

        for use in uses:
            self._create_element(use, experiment, experiment_id)

        return storage_id

    def _create_group(self, group: schema.Group) -> str:
        self.migrate()

        cur = self._db.cursor()

        row = cur.execute(
            """SELECT id FROM groups WHERE path=?""",
            (group.path,),
        ).fetchone()
        if row is None:
            cur.execute(
                """INSERT INTO groups ('pattern', 'path') VALUES (?,?)""",
                (group.pattern, group.path),
            )
            self._db.commit()

        return group.path

    def _create_project(self, project: schema.Project) -> str:
        self.migrate()

        cur = self._db.cursor()

        row = cur.execute(
            """SELECT id FROM projects WHERE name=?""",
            (project.name,),
        ).fetchone()
        if row is None:
            cur.execute(
                """INSERT INTO projects ('directory', 'name') VALUES (?,?)""",
                (project.directory, project.name),
            )
            self._db.commit()

        return project.name

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        self.migrate()

        return save_file(
            os.path.join(experiment._storage_id, "records", f"{scope}.jsonl"),
            data=data,
            mode="a",
        )

    def _mark_started(
        self, experiment: schema.Experiment, timestamp: DatetimeType
    ) -> None:
        self.migrate()

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
        self.migrate()

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
        if not self.is_migrated():
            return None

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
        self, experiment_id: str, timestamp: int = None
    ) -> Optional[str]:
        if not self.is_migrated():
            return None
        self.migrate()
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

    def _find_experiment_by_predicate(
        self, module: str, predicate: Dict
    ) -> List[str]:
        if not self.is_migrated():
            return []
        self.migrate()
        cur = self._db.cursor()

        if predicate:
            keys = ["module=?"]
            values = [module]
            for p, v in predicate.items():
                keys.append(f"json_extract(predicate, '$.{p}')=?")
                values.append(v if isinstance(v, (str, int, float)) else _jn(v))
            query = cur.execute(
                """SELECT storage_id FROM experiments WHERE """
                + (" AND ".join(keys)),
                values,
            )
        else:
            query = cur.execute(
                """SELECT storage_id FROM experiments WHERE module=?""",
                (module,),
            )

        return [row[0] for row in query.fetchall()]

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return schema.Execution(
            **load_file(os.path.join(storage_id, "execution.json")),
        )

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        return schema.Experiment(
            **load_file(os.path.join(storage_id, "experiment.json")),
        )

    def _retrieve_group(self, storage_id: str) -> schema.Group:
        self.migrate()
        cur = self._db.cursor()
        row = cur.execute(
            """SELECT `path`, `pattern` FROM groups WHERE `path`=?""",
            (storage_id,),
        ).fetchone()
        return schema.Group(path=row[0], pattern=row[1])

    def _retrieve_project(self, storage_id: str) -> schema.Project:
        self.migrate()
        cur = self._db.cursor()
        row = cur.execute(
            """SELECT `directory`, `name` FROM projects WHERE `name`=?""",
            (storage_id,),
        ).fetchone()
        return schema.Project(directory=row[0], name=row[1])

    def _retrieve_element(self, storage_id: str) -> schema.Element:
        self.migrate()
        cur = self._db.cursor()
        row = cur.execute(
            """SELECT `module`, `config`, `version` FROM elements WHERE `storage_id`=?""",
            (storage_id,),
        ).fetchone()
        return schema.Element(
            module=row[0], config=json.loads(row[1]), version=json.loads(row[2])
        )

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
        if not self.is_migrated():
            return None
        self.migrate()
        if relation == "experiment.execution":
            cur = self._db.cursor()
            row = cur.execute(
                """SELECT executions.storage_id FROM executions
                LEFT JOIN experiments ON experiments.execution_id = executions.id
                WHERE experiments.storage_id=?""",
                (storage_id,),
            ).fetchone()
            if row:
                return row[0]
            return None
        if relation == "experiment.executions":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT executions.storage_id FROM executions
                LEFT JOIN experiments ON experiments.execution_id = executions.id
                WHERE experiments.storage_id=?""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "experiment.uses":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT elements.storage_id FROM elements
                LEFT JOIN experiments ON elements.experiment_id = experiments.id
                WHERE experiments.storage_id=?""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "execution.experiments":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT experiments.storage_id FROM experiments
                LEFT JOIN executions ON experiments.execution_id = executions.id
                WHERE executions.storage_id=?""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "group.experiments":
            cur = self._db.cursor()
            return [
                row[0]
                for row in cur.execute(
                    """SELECT experiments.storage_id FROM experiments
                LEFT JOIN groups ON experiments.group_id = groups.id
                WHERE groups.path=?""",
                    (storage_id,),
                ).fetchall()
            ]
        if relation == "experiment.group":
            cur = self._db.cursor()
            row = cur.execute(
                """SELECT groups.path FROM experiments
                LEFT JOIN groups ON experiments.group_id = groups.id
                WHERE experiments.storage_id=?""",
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
        if relation == "experiment.project":
            cur = self._db.cursor()
            row = cur.execute(
                """SELECT projects.name FROM experiments
                LEFT JOIN projects ON experiments.project_id = projects.id
                WHERE experiments.storage_id=?""",
                (storage_id,),
            ).fetchone()
            if row:
                return row[0]
        return None

    def _create_file(self, storage_id: str, filepath: str, data: Any) -> str:
        return save_file(
            os.path.join(storage_id, filepath), data, makedirs=True
        )

    def _retrieve_file(self, storage_id: str, filepath: str) -> Optional[Any]:
        return load_file(os.path.join(storage_id, filepath), default=None)

    def __repr__(self):
        return f"FilesystemStorage <{self.config.directory}>"
