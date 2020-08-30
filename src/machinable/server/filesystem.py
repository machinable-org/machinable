import base64

from starlette.responses import PlainTextResponse

from ..filesystem import open_fs


async def filesystem_resolver(request):
    url = base64.urlsafe_b64decode(request.path_params["url"]).decode("utf-8")
    filename = request.path_params["filename"]

    with open_fs(url) as filesystem:
        data = filesystem.load_file(filename)

    return PlainTextResponse(data)
