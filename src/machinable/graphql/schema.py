import os

from ariadne import (
    load_schema_from_path,
    make_executable_schema,
    snake_case_fallback_resolvers,
)
from machinable.graphql.directives import directives
from machinable.graphql.scalars import scalars
from machinable.graphql.types import types

path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "schema.graphql"
)

schema = make_executable_schema(
    load_schema_from_path(path),
    *scalars,
    *types,
    snake_case_fallback_resolvers,
    directives=directives,
)
