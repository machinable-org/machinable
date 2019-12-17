import copy
import datetime

from ..config.mapping import config_map
from ..utils.utils import apply_seed
from ..observer import Observer


class FunctionalEngine:

    def __init__(self, function, node_config, node_flags):
        self.function = function
        self.node = {
            'config': copy.deepcopy(node_config),
            'flags': copy.deepcopy(node_flags)
        }

    def dispatch(self, children_config, observer_config, actor_config=None):
        self.node['flags']['ACTOR'] = actor_config
        apply_seed(self.node['flags'].get('SEED'))
        observer = Observer(observer_config)
        children = [
            {
                'config': copy.deepcopy(child['args']),
                'flags': copy.deepcopy(child['flags'])
            } for child in children_config
        ]
        observer.statistics['on_execute_start'] = datetime.datetime.now()
        observer.refresh_meta_data(
            node=self.node['config'],
            children=[child['config'] for child in children],
            flags={
                'node': self.node['flags'],
                'children': [child['flags'] for child in children]
            }
        )

        try:
            return self.function(config_map(self.node), [config_map(child) for child in children], observer)
        except (KeyboardInterrupt, StopIteration) as e:
            return e


class FunctionalCallback:

    def __init__(self, callback):
        self.callback = callback

    def __call__(self, *args, **kwargs):
        return FunctionalEngine(self.callback, *args, **kwargs)
