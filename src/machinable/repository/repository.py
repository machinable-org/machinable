from machinable.utils.traits import Discoverable


class Repository(Discoverable):
    def __init__(self, name: str = None):
        """Repository base class

        # Arguments
        name: defines the repository path name
            May contain the following variables:
            - &EXPERIMENT will be replaced by the experiment name
            - &PROJECT will be replaced by project name
            - %x expressions will be replaced by strftime
            The variables are expanded following GNU bash's variable expansion rules, e.g.
            `&{EXPERIMENT:-default_value}` or `&{PROJECT:?}` can be used.
        """
        self.name = name
