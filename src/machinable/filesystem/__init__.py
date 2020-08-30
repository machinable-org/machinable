import os

from ..utils.identifiers import decode_experiment_id


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
    parsed = parse_filesystem_url(url)
    resource = os.path.normpath(parsed["resource"])
    parsed["experiment_id"] = os.path.basename(resource)
    parsed["component_id"] = None
    if len(parsed["experiment_id"]) == 12:
        # if component, switch to experiment
        parsed["component_id"] = parsed["experiment_id"]
        parsed["experiment_id"] = os.path.basename(os.path.dirname(resource))
    decode_experiment_id(parsed["experiment_id"], or_fail=True)
    return parsed
