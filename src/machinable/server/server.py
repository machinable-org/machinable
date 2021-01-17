import os

from ariadne.asgi import GraphQL
from machinable.graphql.schema import schema
from machinable.server.filesystem import filesystem_resolver
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

graphql = GraphQL(schema, keepalive=True)

routes = [
    Route(
        "/filesystem/{url:path}/{filename:path}", endpoint=filesystem_resolver
    )
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
]

server = Starlette(routes=routes, middleware=middleware)
server.mount("/", graphql)
