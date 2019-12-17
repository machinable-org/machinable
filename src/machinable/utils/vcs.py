import os

# This following method is modified 3rd party source code from
# https://github.com/IDSIA/sacred/blob/7897c664b1b93fa2e2b6f3af244dfee590b1342a/sacred/dependencies.py#L401.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.


def get_commit(filename, search_parent_directories=False):
    # git
    try:
        from git import Repo, InvalidGitRepositoryError
        try:
            directory = os.path.dirname(filename)
            repo = Repo(directory, search_parent_directories=search_parent_directories)
            try:
                path = repo.remote().url
            except ValueError:
                path = 'git:/' + repo.working_dir
            is_dirty = repo.is_dirty()
            commit = repo.head.commit.hexsha
            return {'path': path, 'commit': commit, 'is_dirty': is_dirty}
        except (InvalidGitRepositoryError, ValueError):
            pass
    except ImportError:
        pass

    return {'path': None, 'commit': None, 'is_dirty': None}
