from typing import Any, Dict, List, Optional, Union

from arrow.arrow import Arrow

VersionType = Union[str, dict, None, List[Union[str, dict, None]]]
ElementType = List[Union[str, dict]]
DatetimeType = Arrow
TimestampType = Union[float, int, DatetimeType]
JsonableType = Dict[str, Union[str, float, int, None, DatetimeType]]
Optional[List[Union[str, dict]]]
