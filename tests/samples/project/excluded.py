from pydantic import BaseModel

from machinable import Field, Interface
from machinable.config import predicate_from_manifest


class Excluded(Interface):
    """Volatile-location pattern: ``recording_uri`` is excluded from identity, and a
    content predicate re-identifies the underlying data via a manifest beside it."""

    class Config(BaseModel):
        recording_uri: str = Field("", identifying=False)
        sorter: str = "simple"

    def on_compute_predicate(self):
        return predicate_from_manifest(self.config.recording_uri, "recording_id")
