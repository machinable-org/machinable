from typing import List, Union

from arrow.arrow import Arrow

VersionType = Union[str, dict, None, List[Union[str, dict, None]]]
ComponentType = List[Union[str, dict]]
DatetimeType = Arrow
