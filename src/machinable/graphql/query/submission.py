from machinable.graphql.query.query_type import query
from machinable.submission.submission import Submission


@query.field("submission")
async def resolve_submission(obj, info, url):
    return Submission(url)
