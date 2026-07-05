from pydantic import BaseModel

from machinable import Interface


class View(Interface):
    """A content-addressed view: searchable config plus a mutable label."""

    class Config(BaseModel):
        duration: int = 0
        created_day: str = ""
