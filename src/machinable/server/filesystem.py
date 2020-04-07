import base64

from starlette.responses import PlainTextResponse

from ..observations.backend.filesystem import ObservationDirectory


async def observation_resolver(request):
    url = base64.urlsafe_b64decode(request.path_params['url']).decode('utf-8')
    filename = request.path_params['filename']

    observation = ObservationDirectory(url)
    data = observation.load_file(filename, meta=True)

    return PlainTextResponse(data)
