from .storage import Storage


def get_experiment(url):
    """Returns a [StorageExperiment](#) for the given URL

    # Arguments
    url: String, filesystem URL

    Returns None if the experiment does not exist
    """
    from .experiment import StorageExperiment

    try:
        return StorageExperiment(url)
    except ValueError:
        return None


def find_experiments(url):
    """Searches given URL recursively to return a collection of its experiments

    # Arguments
    url: String, filesystem URL
    """
    from ..index.native_index import NativeIndex

    return NativeIndex().add_from_storage(url).find_all()


def get_component(url, index=0):
    """Returns a [StorageComponent](#) for the given URL

    # Arguments
    url: String, filesystem URL
    index: Component to be returned if the URL is an experiment containing multiple components.
            Defaults to 0 (first in the collection); if False, no component is automatically
            selected and None is returned instead.
    """
    from .component import StorageComponent

    try:
        return StorageComponent(url)
    except ValueError:
        if index is not False:
            experiment = get_experiment(url)
            if experiment is not None:
                return experiment.components[index]
        return None
