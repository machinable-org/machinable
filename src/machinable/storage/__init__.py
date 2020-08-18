from .storage import Storage


def get_component(url):
    """Returns a [StorageComponent](#) for the given URL

    # Arguments
    url: String, filesystem URL
    """
    from .component import StorageComponent

    return StorageComponent(url)


def get_experiment(url):
    """Returns a [StorageExperiment](#) for the given URL

    # Arguments
    url: String, filesystem URL
    """
    from .experiment import StorageExperiment

    return StorageExperiment(url)
