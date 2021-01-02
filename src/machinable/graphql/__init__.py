import os

from ariadne import load_schema_from_path, make_executable_schema
from machinable.graphql.directives import directives
from machinable.graphql.mutation import mutation
from machinable.graphql.query import query
from machinable.graphql.scalars import scalars
from machinable.graphql.subscription import subscription

schema_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "schema.graphql"
)

schema = make_executable_schema(
    load_schema_from_path(schema_path),
    [*scalars, query, mutation, subscription],
    directives=directives,
)
