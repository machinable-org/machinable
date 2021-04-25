import json

from ariadne import ScalarType

json_scalar = ScalarType("JSON")
datetime_scalar = ScalarType("DateTime")
uuid_scalar = ScalarType("UUID")


@datetime_scalar.serializer
def serialize_datetime(value):
    # arrow instance
    return value.isoformat()


@json_scalar.serializer
def serialize_json(value):
    if value is None:
        return None
    return json.dumps(value)


@json_scalar.value_parser
def parse_json(value):
    if value is None:
        return None
    return json.loads(value)


scalars = [datetime_scalar, json_scalar, uuid_scalar]
