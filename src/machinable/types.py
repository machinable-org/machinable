from typing import Dict, List, Union

from arrow.arrow import Arrow

VersionType = Union[str, dict, None, List[Union[str, dict, None]]]
ComponentType = List[Union[str, dict]]
DatetimeType = Arrow
TimestampType = Union[float, int, DatetimeType]
JsonableType = Dict[str, Union[str, float, int, None, DatetimeType]]
