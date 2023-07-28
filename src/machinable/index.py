from typing import Any, Dict, List, Optional, Union

import copy
import json
import os
from contextlib import contextmanager
from datetime import datetime

try:
    from pysqlite3 import dbapi2 as sqlite3
except ModuleNotFoundError:
    import sqlite3

from machinable import schema
from machinable.element import filter_enderscores, get_lineage, idversion
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
        config=None,
        version=json.loads(row[9]),
        predicate=json.loads(row[10]),
        lineage=json.loads(row[11]),
        timestamp=float(row[12]),
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
                config_ json,
                config_update json,
                config_update_ json,
                config_default json,
                version json,
                version_ json,
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
                'timestamp' real,
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


@contextmanager
def db(database: str, create=False) -> Optional[sqlite3.Connection]:
    try:
        database = load(database, create)
        yield database
        database.close()
    except FileNotFoundError:
        yield None


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
        with db(self.config.database, create=True) as _db:
            cur = _db.cursor()
            if cur.execute(
                """SELECT uuid FROM 'index' WHERE uuid=?""", (model.uuid,)
            ).fetchone():
                # already exists
                return False
            config = copy.deepcopy(model.config or {})
            default = config.pop("_default_", {})
            version = config.pop("_version_", [])
            update = config.pop("_update_", {})

            cur.execute(
                """INSERT INTO 'index' (
                    uuid,
                    kind,
                    module,
                    config,
                    config_,
                    config_update,
                    config_update_,
                    config_default,
                    version,
                    version_,
                    predicate,
                    lineage,
                    'timestamp'
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    model.uuid,
                    model.kind,
                    model.module,
                    _jn(filter_enderscores(config)),
                    _jn(config),
                    _jn(filter_enderscores(update)),
                    _jn(update),
                    _jn(default),
                    _jn(idversion(version)),
                    _jn(version),
                    _jn(model.predicate),
                    _jn(model.lineage),
                    model.timestamp,
                ),
            )
            _db.commit()
        return True

    def create_relation(
        self,
        relation: str,
        uuid: str,
        related_uuid: Union[str, List[str]],
        priority: int = 0,
        timestamp: Optional[float] = None,
    ) -> None:
        if isinstance(related_uuid, (list, tuple)):
            for r in related_uuid:
                self.create_relation(relation, uuid, r, priority, timestamp)
            return
        with db(self.config.database, create=True) as _db:
            cur = _db.cursor()
            if cur.execute(
                """SELECT id FROM 'relations' WHERE uuid=? AND related_uuid=? AND relation=?""",
                (uuid, related_uuid, relation),
            ).fetchone():
                # already exists
                return
            if timestamp is None:
                timestamp = datetime.now().timestamp()
            cur.execute(
                """INSERT INTO 'relations' (
                    relation,
                    uuid,
                    related_uuid,
                    priority,
                    timestamp
                ) VALUES (?,?,?,?,?)""",
                (relation, uuid, related_uuid, priority, timestamp),
            )
            _db.commit()

    def find(self, uuid: str) -> Optional[schema.Interface]:
        with db(self.config.database, create=False) as _db:
            if not _db:
                return None
            cur = _db.cursor()
            row = cur.execute(
                """SELECT * FROM 'index' WHERE uuid=?""", (uuid,)
            ).fetchone()
            if row is None:
                return None
            return interface_row_factory(cur, row)

    def find_by_context(self, context: Dict) -> List[schema.Interface]:
        with db(self.config.database, create=False) as _db:
            if not _db:
                return []
            cur = _db.cursor()

            keys = []
            equals = []
            for field, value in context.items():
                if field == "predicate":
                    for p, v in value.items():
                        keys.append(f"json_extract(predicate, '$.{p}')=?")
                        equals.append(v)
                else:
                    keys.append(f"{field}=?")
                    equals.append(value)

            if len(keys) > 0:
                query = cur.execute(
                    """SELECT * FROM 'index' WHERE """ + (" AND ".join(keys)),
                    [
                        v if isinstance(v, (str, int, float)) else _jn(v)
                        for v in equals
                    ],
                )
            else:
                query = cur.execute("""SELECT * FROM 'index'""")

            return [interface_row_factory(cur, row) for row in query.fetchall()]

    def find_related(
        self, relation: str, uuid: str, inverse: bool = False
    ) -> Union[None, List[schema.Interface]]:
        with db(self.config.database, create=False) as _db:
            if not _db:
                return None
            cur = _db.cursor()
            if not inverse:
                rows = cur.execute(
                    """SELECT * FROM 'index' WHERE uuid IN
                        (
                        SELECT related_uuid FROM relations WHERE uuid=? AND relation=?
                        )  ORDER BY 'timestamp' DESC
                    """,
                    (uuid, relation),
                ).fetchall()
            else:
                rows = cur.execute(
                    """SELECT * FROM 'index' WHERE uuid IN
                        (
                        SELECT uuid FROM relations WHERE related_uuid=? AND relation=?
                        )  ORDER BY 'timestamp' DESC
                    """,
                    (uuid, relation),
                ).fetchall()
            return [interface_row_factory(cur, row) for row in rows or []]