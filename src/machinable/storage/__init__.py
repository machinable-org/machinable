from .storage import Storage


def get_component(url):
    """Returns a [ComponentStorage](#) for the given URL

    # Arguments
    url: String, filesystem URL
    """
    from .component import ComponentStorage

    return ComponentStorage(url)


def get_experiment(url):
    """Returns a [ExperimentStorage](#) for the given URL

    # Arguments
    url: String, filesystem URL
    """
    from .experiment import ExperimentStorage

    return ExperimentStorage(url)
