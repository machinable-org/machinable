import os

from machinable.core.settings import get_settings

from ..utils.formatting import msg


def fetch_link(source, target):
    os.symlink(source, target, target_is_directory=True)
    return True


def fetch_directory(source, target):
    if not os.path.isdir(source):
        raise ValueError(f"{source} is not a directory")

    # we use symlink rather than copy for performance and consistency
    fetch_link(source, target)

    return True


def fetch_git(source, target):
    raise FileNotFoundError(
        f"Dependency missing. Please 'git clone {source}' into {target}"
    )


def fetch_import(source, target):
    if source is None:
        return False

    # git
    if source.startswith("git+"):
        return fetch_git(source[4:], target)

    # symlink
    if source.startswith("link+"):
        return fetch_link(source[5:], target)

    # default: directory
    return fetch_directory(source, target)


def fetch_imports(project, config=None):
    if config is None:
        config = project.get_config()["+"]
    rc = get_settings()
    top_level_vendor = project.get_root().vendor_path
    os.makedirs(top_level_vendor, exist_ok=True)

    imports = []
    for dependency in config:
        if isinstance(dependency, str):
            dependency = {dependency: None}

        for name, args in dependency.items():
            imports.append(name)

            # source config
            if not isinstance(args, str):
                args = None

            # give local .machinablerc priority over project config
            source = rc["imports"].get(name, args)
            if isinstance(source, str):
                source = os.path.expanduser(source)

            # local target folder
            os.makedirs(os.path.join(project.directory_path, "vendor"), exist_ok=True)
            target = os.path.join(project.directory_path, "vendor", name)

            # protect against invalid symlinks
            if os.path.islink(target) and not os.path.exists(target):
                os.unlink(target)

            # skip if already existing
            if os.path.exists(target):
                break

            # top-level target folder
            top_level = os.path.join(top_level_vendor, name)

            # protect against invalid symlinks
            if os.path.islink(top_level) and not os.path.exists(top_level):
                os.unlink(top_level)

            # fetch import to the top-level if it does not exist
            if not os.path.exists(top_level):
                msg(f"Fetching '+.{name}' to {top_level}")
                if not fetch_import(source, top_level):
                    raise FileNotFoundError(
                        f"Could not fetch '+.{name}'. Please place it into {top_level}"
                    )

            # symlink from top-level to local target if not identical
            if top_level != target:
                os.symlink(top_level, target, target_is_directory=True)

            break

    return imports
