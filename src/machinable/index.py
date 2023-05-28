from typing import Any, Dict, List, Optional, Union

import json
import os

try:
    from pysqlite3 import dbapi2 as sqlite3
except ModuleNotFoundError:
    import sqlite3

from machinable import schema
from machinable.element import Element, get_lineage
from machinable.interface import Interface
from machinable.settings import get_settings
from machinable.types import VersionType
from machinable.utils import is_directory_version


def _jn(data: Any) -> str:
    return json.dumps(data, sort_keys=True, separators=(",", ":"))


def interface_row_factory(cursor, row) -> schema.Interface:
    return schema.Interface(
        uuid=row[0],
        kind=row[1],
        module=row[2],
        config=json.loads(row[3]),
        version=json.loads(row[4]),
        predicate=json.loads(row[5]),
        lineage=json.loads(row[6]),
        timestamp=float(row[7]),
    )


def migrate(db: sqlite3.Connection) -> None:
    cur = db.cursor()
    version = cur.execute("PRAGMA user_version;").fetchone()[0]
    if version == 0:
        # initial migration
        cur.execute(
            """CREATE TABLE 'index' (
                uuid text PRIMARY KEY,
                kind text,
                module text,
                config json,
                version json,
                predicate json,
                lineage json,
                'timestamp' real
            )"""
        )
        cur.execute(
            """CREATE TABLE 'relations' (
                id integer PRIMARY KEY NOT NULL,
                relation text NOT NULL,
                uuid text NOT NULL REFERENCES 'index' (uuid),
                related_uuid text NOT NULL REFERENCES 'index' (uuid),
                'priority' integer NOT NULL DEFAULT 0,
                UNIQUE (uuid, related_uuid, relation)
            )"""
        )
        cur.execute("PRAGMA user_version = 1;")
        db.commit()
        version += 1
    if version == 1:
        # future migrations
        ...


def load(database: str, create=False) -> sqlite3.Connection:
    if database.startswith("sqlite:///"):
        database = database[10:]
    if ":memory:" not in database:
        database = os.path.expanduser(database)
        if not os.path.isfile(database):
            if not create:
                raise FileNotFoundError(
                    f"Could not find index database at {database}"
                )
            else:
                os.makedirs(os.path.dirname(database), exist_ok=True)
    db = sqlite3.connect(database)
    migrate(db)
    return db


class Index(Interface):
    kind = "Index"
    default = get_settings().default_index

    class Config:
        directory: str = "./storage"
        database: str = "in_directory('index.sqlite')"

    def __init__(self, version: VersionType = None):
        if is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        super().__init__(version=version)
        self.__model__ = schema.Index(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self._db = None

    def config_in_directory(self, relative_path: str) -> str:
        return os.path.join("sqlite:///", self.config.directory, relative_path)

    @property
    def db(self) -> sqlite3.Connection:
        if self._db is None:
            self._db = load(self.config.database, create=True)
        return self._db

    def local_directory(self, uuid: str, *append: str) -> str:
        # TODO: allow custom directory mappings
        return os.path.join(self.config.directory, uuid, *append)

    def commit(self, model: schema.Interface) -> bool:
        cur = self.db.cursor()
        if cur.execute(
            """SELECT uuid FROM 'index' WHERE uuid=?""", (model.uuid,)
        ).fetchone():
            # already exists
            return False
        cur.execute(
            """INSERT INTO 'index' (
                uuid,
                kind,
                module,
                config,
                version,
                predicate,
                lineage,
                'timestamp'
            ) VALUES (?,?,?,?,?,?,?,?)""",
            (
                model.uuid,
                model.kind,
                model.module,
                _jn(model.config),
                _jn(model.version),
                _jn(model.predicate),
                _jn(model.lineage),
                model.timestamp,
            ),
        )
        self.db.commit()
        return True

    def create_relation(
        self,
        relation: str,
        uuid: str,
        related_uuid: Union[str, List[str]],
        priority: int = 0,
    ) -> None:
        if isinstance(related_uuid, (list, tuple)):
            for r in related_uuid:
                self.create_relation(relation, uuid, r, priority)
            return

        cur = self.db.cursor()
        if cur.execute(
            """SELECT id FROM 'relations' WHERE uuid=? AND related_uuid=? AND relation=?""",
            (uuid, related_uuid, relation),
        ).fetchone():
            # already exists
            return
        cur.execute(
            """INSERT INTO 'relations' (
                relation,
                uuid,
                related_uuid,
                priority
            ) VALUES (?,?,?,?)""",
            (
                relation,
                uuid,
                related_uuid,
                priority,
            ),
        )
        self.db.commit()

    def find(self, uuid: str) -> Optional[schema.Interface]:
        cur = self.db.cursor()
        row = cur.execute(
            """SELECT * FROM 'index' WHERE uuid=?""", (uuid,)
        ).fetchone()
        if row is None:
            return None
        return interface_row_factory(cur, row)

    def find_by_predicate(
        self, module: str, predicate: Optional[Dict] = None
    ) -> List[schema.Interface]:
        cur = self.db.cursor()
        if predicate:
            keys = ["module=?"]
            values = [module]
            for p, v in predicate.items():
                keys.append(f"json_extract(predicate, '$.{p}')=?")
                values.append(v if isinstance(v, (str, int, float)) else _jn(v))
            query = cur.execute(
                """SELECT * FROM 'index' WHERE """ + (" AND ".join(keys)),
                values,
            )
        else:
            query = cur.execute(
                """SELECT * FROM 'index' WHERE module=?""",
                (module,),
            )

        return [interface_row_factory(cur, row) for row in query.fetchall()]

    def find_related(
        self, relation: str, uuid: str, inverse: bool = False
    ) -> Union[None, List[schema.Interface]]:
        cur = self.db.cursor()
        if not inverse:
            rows = cur.execute(
                """SELECT * FROM 'index' WHERE uuid IN
                    (
                    SELECT related_uuid FROM relations WHERE uuid=? AND relation=?
                    )
                """,
                (uuid, relation),
            ).fetchall()
        else:
            rows = cur.execute(
                """SELECT * FROM 'index' WHERE uuid IN
                    (
                    SELECT uuid FROM relations WHERE related_uuid=? AND relation=?
                    )
                """,
                (uuid, relation),
            ).fetchall()
        return [interface_row_factory(cur, row) for row in rows or []]
