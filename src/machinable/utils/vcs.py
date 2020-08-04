import os

import sh

# This following method is modified 3rd party source code from
# https://github.com/IDSIA/sacred/blob/7897c664b1b93fa2e2b6f3af244dfee590b1342a/sacred/dependencies.py#L401.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.


def get_commit(filename, search_parent_directories=True):
    try:
        from git import InvalidGitRepositoryError, Repo

        try:
            directory = os.path.dirname(filename)
            repo = Repo(directory, search_parent_directories=search_parent_directories)
            try:
                branch = str(repo.active_branch)
            except TypeError:
                branch = None

            try:
                path = repo.remote().url
            except ValueError:
                path = "git:/" + repo.working_dir
            is_dirty = repo.is_dirty()
            commit = repo.head.commit.hexsha
            return {
                "path": path,
                "commit": commit,
                "is_dirty": is_dirty,
                "branch": branch,
            }
        except (InvalidGitRepositoryError, ValueError):
            pass
    except ImportError:
        pass

    return {"path": None, "commit": None, "is_dirty": None, "branch": None}


def get_root_commit(filename):
    wd = None
    try:
        from git import InvalidGitRepositoryError, Repo

        try:
            directory = os.path.dirname(filename)
            repo = Repo(directory, search_parent_directories=True)
            wd = repo.working_dir
        except (InvalidGitRepositoryError, ValueError):
            pass
    except ImportError:
        pass

    try:
        return sh.tail(sh.git("rev-list", "--parents", "HEAD", _cwd=wd), "-1").replace(
            "\n", ""
        )
    except:
        return None


def get_diff(filename):
    try:
        from git import InvalidGitRepositoryError, Repo

        try:
            directory = os.path.dirname(filename)
            repo = Repo(directory, search_parent_directories=True)
        except (InvalidGitRepositoryError, ValueError):
            return None

        return repo.git.diff(repo.head.commit.tree)
    except ImportError:
        return None
