from starlette.responses import PlainTextResponse


async def filesystem_resolver(request):
    return PlainTextResponse('Not implemented')
