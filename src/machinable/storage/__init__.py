from .storage import Storage


def get_experiment(url):
    """Returns a [StorageExperiment](#) for the given URL

    # Arguments
    url: String, filesystem URL
    """
    from .experiment import StorageExperiment

    return StorageExperiment(url)


def find_experiments(url):
    """Searches given URL recursively to return a collection of its experiments

    # Arguments
    url: String, filesystem URL
    """
    from ..index.native_index import NativeIndex

    return NativeIndex().add_from_storage(url).find_all()
