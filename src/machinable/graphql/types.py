"""Registers all resolvers"""

from typing import Any

from ariadne import ObjectType
from ariadne.types import GraphQLResolveInfo

query = ObjectType("Query")
mutation = ObjectType("Mutation")
subscription = ObjectType("Subscription")

repository = ObjectType("Repository")


# @repository.field("url")
# def repo_re(repository_model, info: GraphQLResolveInfo):
#     key = ".".join(info.path.as_list())
#     return repository_model.read(key)


types = [query, mutation, subscription, repository]
