from typing import Any, Callable, Dict, List, Literal, Optional, Union

import copy
import json
import os
import shutil
import time
from contextlib import contextmanager
from functools import partial

try:
    from pysqlite3 import dbapi2 as sqlite3
except ModuleNotFoundError:
    import sqlite3

from machinable import schema
from machinable.element import get_lineage
from machinable.interface import Interface
from machinable.types import VersionType
from machinable.utils import is_directory_version, load_file, serialize


def _jn(data: Any) -> str:
    return json.dumps(
        data, sort_keys=True, separators=(",", ":"), default=serialize
    )


def interface_row_factory(cursor, row) -> schema.Interface:
    model = getattr(schema, row[1], schema.Interface)
    return model(
        uuid=row[0],
        kind=row[1],
        module=row[2],
        config=json.loads(row[3]),
        version=json.loads(row[6]),
        predicate=json.loads(row[7]),
        context=json.loads(row[11] or "null"),
        lineage=json.loads(row[8]),
        timestamp=int(row[9]),
        **json.loads(row[10]),
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
                config_update json,
                config_default json,
                version json,
                predicate json,
                lineage json,
                'timestamp' bigint,
                extra json
            )"""
        )
        cur.execute(
            """CREATE TABLE 'relations' (
                id integer PRIMARY KEY NOT NULL,
                relation text NOT NULL,
                uuid text NOT NULL REFERENCES 'index' (uuid),
                related_uuid text NOT NULL REFERENCES 'index' (uuid),
                'priority' integer NOT NULL DEFAULT 0,
                'timestamp' bigint,
                UNIQUE (uuid, related_uuid, relation)
            )"""
        )
        cur.execute("PRAGMA user_version = 1;")
        db.commit()
        version += 1
    if version == 1:
        # updates
        cur.execute("""ALTER TABLE 'index' ADD COLUMN 'context' json""")
        cur.execute("PRAGMA user_version = 2;")
        db.commit()
        version += 1
    if version == 2:
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
    default = None

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

    def config_in_directory(self, relative_path: str) -> str:
        return os.path.join("sqlite:///", self.config.directory, relative_path)

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
            config = copy.deepcopy(model.config)
            if config:
                default = config.pop("_default_", {})
                version = config.pop("_version_", [])
                update = config.pop("_update_", {})
            else:
                default = {}
                version = []
                update = {}

            cur.execute(
                """INSERT INTO 'index' (
                    uuid,
                    kind,
                    module,
                    config,
                    config_update,
                    config_default,
                    version,
                    predicate,
                    context,
                    lineage,
                    'timestamp',
                    extra
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    model.uuid,
                    model.kind,
                    model.module,
                    _jn(config),
                    _jn(update),
                    _jn(default),
                    _jn(version),
                    _jn(model.predicate),
                    _jn(model.context),
                    _jn(model.lineage),
                    model.timestamp,
                    _jn(model.extra()),
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
        timestamp: Optional[int] = None,
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
                timestamp = time.time_ns()
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

    def find(
        self,
        interface: Union[schema.Interface, Interface],
        by: Literal["id", "uuid", "hash"] = "hash",
    ) -> List[schema.Interface]:
        if by in ["id", "uuid"]:
            found = self.find_by_id(interface.uuid)
            if not found:
                return []
            return [found]

        if by == "hash":
            return self.find_by_hash(interface.hash)

        raise ValueError(
            f"Invalid field: {by}. Must be one of 'id', 'uuid', 'hash'."
        )

    def find_by_id(self, uuid: str) -> Optional[schema.Interface]:
        with db(self.config.database, create=False) as _db:
            if not _db:
                return None
            cur = _db.cursor()
            if len(uuid) == 6:  # short id
                row = cur.execute(
                    """SELECT * FROM 'index' WHERE uuid LIKE ?""",
                    (f"%{uuid[:2]}-{uuid[2:]}-%",),
                ).fetchone()
            else:
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
                    if hasattr(value, "items") and len(value) > 0:
                        # empty dict is a wildcard, so we only add
                        # condition if len(value) > 0
                        for p, v in value.items():
                            keys.append(
                                f"json_extract(context, '$.{field}.{p}')=?"
                            )
                            equals.append(v)
                else:
                    keys.append(f"json_extract(context, '$.{field}')=?")
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

    def find_by_hash(self, context_hash: str) -> List[schema.Interface]:
        with db(self.config.database, create=False) as _db:
            if not _db:
                return []
            cur = _db.cursor()

            query = cur.execute(
                """SELECT * FROM 'index' WHERE uuid LIKE ?""",
                (f"%{context_hash}",),
            )

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

    def import_directory(
        self,
        directory: str,
        relations: bool = True,
        file_importer: Callable[[str, str], None] = partial(
            shutil.copytree, symlinks=True
        ),
    ):
        data = load_file([directory, "model.json"])
        model = getattr(schema, data["kind"])

        interface = model(**data)

        if relations:
            relations = load_file([directory, "related", "metadata.jsonl"], [])
        else:
            relations = []

        # transfer into local directory
        src = os.path.abspath(directory)
        dst = os.path.abspath(self.local_directory(interface.uuid))
        if src != dst:
            file_importer(src, dst)

        # create index entry
        self.commit(interface)
        for r in relations:
            self.create_relation(r["name"], r["uuid"], r["related_uuid"])
