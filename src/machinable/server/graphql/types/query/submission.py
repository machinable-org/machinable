from machinable.server.graphql.types.query.query_type import query
from machinable.submission import Submission


@query.field("submission")
async def resolve_submission(obj, info, url):
    return Submission(url)


@query.field("submissionComponent")
async def resolve_submission_component(obj, info, url):
    return Submission.get(url, component=0)
