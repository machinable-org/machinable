import os

import machinable.errors
from ariadne.graphql import graphql_sync
from ariadne.types import ExtensionSync as Extension
from machinable.graphql.schema import schema


def from_string(value):
    if value is None:
        return None

    if value.startswith("{") and value.endswith("}"):
        return json.loads(value)

    if value.startswith("int:"):
        return int(value[4:])

    return value


class Client:
    """
    Thin wrapper that handles the GraphQL queries

    When running in the browser this will be replaced with a
    javascript call to the API
    """

    def request(self, query, variables, root_value=None, middleware=None):
        successful, result = graphql_sync(
            schema=schema,
            data=dict(query=query, variables=variables),
            root_value=root_value,
            middleware=middleware,
        )
        if not successful:
            raise machinable.errors.GraphQLError(result=result)

        if "errors" in result:
            raise machinable.errors.GraphQLError(str(result))

        return result["data"]


client = Client()
