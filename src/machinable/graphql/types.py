"""Registers all resolvers"""

from typing import Any

from ariadne import ObjectType
from ariadne.types import GraphQLResolveInfo

query = ObjectType("Query")
mutation = ObjectType("Mutation")
subscription = ObjectType("Subscription")


@mutation.field("storage")
def storage(root, info: GraphQLResolveInfo, url=None):
    from machinable.storage.storage import Storage

    return Storage(url)


types = [query, mutation, subscription]
