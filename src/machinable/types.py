from arrow.arrow import Arrow

VersionType = str | dict | None | list[str | dict | None]
ElementType = list[str | dict]
DatetimeType = Arrow
TimestampType = float | int | DatetimeType
JsonableType = dict[str, str | float | int | None | DatetimeType]
list[str | dict] | None
