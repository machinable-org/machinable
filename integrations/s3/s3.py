"""S3: records in an S3 or S3-compatible bucket (via obstore)."""

from collections.abc import Callable
from typing import Any
from urllib.parse import urlparse

from pydantic import BaseModel, Field

from machinable import Storage

# objects up to this size are read whole, larger ones in chunks
_WHOLE = 8 * 1024 * 1024


class S3(Storage):
    """A home in a bucket: ``s3://bucket/prefix``."""

    catalog_log = True

    class Config(BaseModel):
        """Where the records live, and how to reach the bucket.

        Credentials come from obstore's default chain (environment, profile,
        instance role) unless given here or by a ``credential_provider``
        (``module:function``, or a callable passed to the constructor)
        returning refreshing credentials. ``endpoint`` points at an
        S3-compatible service; ``conditional_writes: false`` for one that
        does not honour ``If-None-Match``/``If-Match`` (no exclusive claims).
        """

        url: str = Field("???")
        directory: str = "./storage"
        region: str | None = None
        endpoint: str | None = None
        access_key_id: str | None = None
        secret_access_key: str | None = None
        session_token: str | None = None
        credential_provider: str | None = None
        catalog_max_bytes: int = 1024 * 1024
        conditional_writes: bool = True

    def __init__(
        self, version: Any = None, credential_provider: Callable | None = None
    ):
        super().__init__(version=version)
        self._credential_provider = credential_provider
        self._store: Any = None

    @property
    def id(self) -> str:
        """Identifier for this storage provider."""
        return "s3"

    @property
    def store(self) -> Any:
        """The obstore ``S3Store`` of ``url`` (made on first use)."""
        if self._store is None:
            from obstore.store import S3Store

            parsed = urlparse(self.config.url)
            if parsed.scheme != "s3" or not parsed.netloc:
                raise ValueError(
                    f"Expected s3://bucket/prefix, got '{self.config.url}'"
                )
            keys = ("region", "endpoint", "access_key_id", "secret_access_key")
            config = {k: getattr(self.config, k) for k in (*keys, "session_token")}
            provider = self._credential_provider
            if provider is None and self.config.credential_provider:
                from machinable.config import import_object_by_path

                provider = import_object_by_path(self.config.credential_provider)
            http = str(self.config.endpoint or "").startswith("http://")
            self._store = S3Store(
                parsed.netloc,
                prefix=parsed.path.strip("/") or None,
                config={k: v for k, v in config.items() if v is not None},
                client_options={"allow_http": True} if http else None,
                credential_provider=provider,
            )
        return self._store

    def root_uri(self) -> str:
        """The bucket URL records are laid out under."""
        return self.config.url.rstrip("/")

    def owns(self, uri: str | None) -> bool:
        """Whether ``uri`` is under this storage's URL."""
        root = self.root_uri()
        return uri is not None and (uri == root or uri.startswith(root + "/"))

    def _key(self, location: str, name: str = "") -> str:
        relative = location[len(self.root_uri()) :].strip("/")
        return "/".join(p for p in (relative, name) if p)

    def list(self, location: str, recursive: bool = True):
        """The objects under ``location`` (a paginated LIST)."""
        import obstore

        prefix = self._key(location)
        base = prefix + "/" if prefix else ""
        if recursive:
            objects = [
                m for batch in obstore.list(self.store, prefix or None) for m in batch
            ]
            directories = []
        else:
            found = obstore.list_with_delimiter(self.store, prefix or None)
            objects = found["objects"]
            directories = [
                (p[len(base) :] + "/", 0, None) for p in found["common_prefixes"]
            ]
        files = [(m["path"][len(base) :], m["size"], m["e_tag"]) for m in objects]
        return sorted(files + directories)

    def read(self, location: str, name: str):
        """GET an object: bytes, or chunks for a large one; None if absent."""
        import obstore

        try:
            result = obstore.get(self.store, self._key(location, name))
        except FileNotFoundError:
            return None
        if result.meta["size"] <= _WHOLE:
            return bytes(result.bytes())
        return (bytes(chunk) for chunk in result)

    def write(self, location: str, name: str, data) -> None:
        """PUT an object (multipart for a large stream)."""
        import obstore

        obstore.put(self.store, self._key(location, name), data)

    def remove(self, location: str, name: str) -> None:
        """DELETE an object."""
        import obstore

        try:
            obstore.delete(self.store, self._key(location, name))
        except FileNotFoundError:
            pass

    def exclusive_claims(self) -> bool:
        """Whether the bucket honours conditional writes."""
        return self.config.conditional_writes

    def read_versioned(self, location: str) -> tuple[bytes, str | None] | None:
        """GET an object with its ETag."""
        import obstore

        try:
            result = obstore.get(self.store, self._key(location))
        except FileNotFoundError:
            return None
        return bytes(result.bytes()), result.meta.get("e_tag")

    def create_if_absent(self, location: str, data: bytes) -> bool:
        """PUT with ``If-None-Match: *``."""
        import obstore
        from obstore.exceptions import AlreadyExistsError, PreconditionError

        try:
            obstore.put(self.store, self._key(location), data, mode="create")
        except (AlreadyExistsError, PreconditionError):
            return False
        return True

    def replace_if_unchanged(self, location: str, data: bytes, version: str) -> bool:
        """PUT with ``If-Match`` on the ETag ``version``."""
        import obstore
        from obstore.exceptions import PreconditionError

        try:
            obstore.put(self.store, self._key(location), data, mode={"e_tag": version})
        except PreconditionError:
            return False
        return True
