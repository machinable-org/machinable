from typing import Any, Dict, List, Optional, Union

from arrow.arrow import Arrow

VersionType = Union[str, dict, None, list[Union[str, dict, None]]]
ElementType = list[Union[str, dict]]
DatetimeType = Arrow
TimestampType = Union[float, int, DatetimeType]
JsonableType = dict[str, Union[str, float, int, None, DatetimeType]]
Optional[list[Union[str, dict]]]
