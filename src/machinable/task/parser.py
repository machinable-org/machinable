import random
import copy

from ..utils.utils import generate_seed
from ..utils.dicts import update_dict


def parse_task(specification, seed=None):
    random_state = random.Random(seed)

    # repeat behaviour
    repeats = []
    for level, repeat in enumerate(specification['repeats']):
        # for each repeat that has been specified we proliferate
        k = repeat['arguments']['k']
        name = repeat['arguments']['name']
        # todo: support resuming mode that allows for nested cross validation etc
        #  mode = repeat['arguments']['mode']
        repeat_seed = generate_seed(random_state)
        # collect repeat configuration and extend already existing inner repeats
        repeat_collection = []
        for r in range(k):
            suffix = '_' + str(level) if level > 0 else ''
            info = {
                name + '_SEED' + suffix: repeat_seed,
                name + '_TOTAL' + suffix: k,
                name + '_NUMBER' + suffix: r
            }
            loop = [update_dict(inner, info, copy=True) for inner in repeats]
            if len(loop) == 0:
                loop = [info]
            repeat_collection.extend(loop)
        repeats = repeat_collection
    if not len(repeats):
        repeats.append({})

    for repeat in repeats:
        for node in specification['nodes']:
            node_arguments = copy.deepcopy(node['arguments'])
            children = node_arguments.pop('children')
            resources = node_arguments.pop('resources', None)
            component = node_arguments.pop('component')

            component.flags['GLOBAL_SEED'] = seed
            component.flags['SEED'] = generate_seed(random_state)
            component.flags.update(repeat)

            if not isinstance(children, (list, tuple)):
                children = [children]

            yield component, children, resources
