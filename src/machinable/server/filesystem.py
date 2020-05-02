import base64

from starlette.responses import PlainTextResponse

from ..storage.directory import Directory


async def storage_resolver(request):
    url = base64.urlsafe_b64decode(request.path_params["url"]).decode("utf-8")
    filename = request.path_params["filename"]

    data = Directory(url).load_file(filename, uid="")

    return PlainTextResponse(data)
