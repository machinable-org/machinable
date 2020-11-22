from .....submission.submission import Submission
from .query_type import query


@query.field("submission")
async def resolve_submission(obj, info, url):
    return Submission(url)


@query.field("submissionComponent")
async def resolve_submission_component(obj, info, url):
    return Submission.get(url, component=0)
