from .filesystem import FileSystem


def open_fs(config):
    return FileSystem(config)


def parse_fs_url(url):
    from fs.opener.parse import parse_fs_url

    parsed = parse_fs_url(url)

    return {
        k: getattr(parsed, k)
        for k in ["protocol", "username", "password", "resource", "params", "path"]
    }
