import json

from ariadne import SchemaDirectiveVisitor
from graphql import default_field_resolver
from machinable.utils import serialize


def as_json(obj):
    return json.dumps(obj, default=serialize)


class JsonDirective(SchemaDirectiveVisitor):
    def visit_field_definition(self, field, object_type):
        original_resolver = field.resolve or default_field_resolver

        def resolve_jsonable(obj, info, **kwargs):
            result = original_resolver(obj, info, **kwargs)
            if result is None:
                return None

            if isinstance(result, list):
                return [as_json(o) for o in result]

            return as_json(result)

        field.resolve = resolve_jsonable
        return field


class MethodDirective(SchemaDirectiveVisitor):
    def visit_field_definition(self, field, object_type):
        def resolve_method(obj, info, *args, **kwargs):
            result = getattr(obj, info.field_name, None)
            if not callable(result):
                return None

            return result(*args, **kwargs)

        field.resolve = resolve_method
        return field


directives = {"json": JsonDirective, "method": MethodDirective}
