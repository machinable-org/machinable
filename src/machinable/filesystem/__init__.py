import os

from ..utils.identifiers import decode_submission_id


def open_fs(config):
    from .filesystem import FileSystem

    return FileSystem(config)


def parse_filesystem_url(url):
    from fs.opener.parse import parse_fs_url

    parsed = parse_fs_url(url)

    return {
        k: getattr(parsed, k)
        for k in ["protocol", "username", "password", "resource", "params", "path"]
    }


def parse_storage_url(url):
    if "://" not in url:
        url = "osfs://" + url
    parsed = parse_filesystem_url(url)
    resource = os.path.normpath(parsed["resource"])
    parsed["submission_id"] = os.path.basename(resource)
    parsed["component_id"] = None
    if len(parsed["submission_id"]) == 12:
        # if component, switch to experiment
        parsed["component_id"] = parsed["submission_id"]
        parsed["submission_id"] = os.path.basename(os.path.dirname(resource))
    decode_submission_id(parsed["submission_id"], or_fail=True)
    return parsed


def abspath(url):
    if not url.startswith("osfs://"):
        return url
    return "osfs://" + os.path.abspath(url[7:])
