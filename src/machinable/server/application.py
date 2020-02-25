import os

from ariadne import load_schema_from_path, make_executable_schema
from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware

dir_path = os.path.dirname(os.path.realpath(__file__))
schema = make_executable_schema(load_schema_from_path(os.path.join(dir_path, "graphql/schema/")))

application = CORSMiddleware(GraphQL(schema, keepalive=True),
                             allow_origins=['*'],
                             allow_methods=['*'],
                             allow_headers=['*'],
                             allow_credentials=True)
