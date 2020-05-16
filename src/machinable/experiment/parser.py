import copy
import random

from machinable.execution.identifiers import generate_component_id

from ..utils.dicts import update_dict
from ..utils.utils import generate_seed


def parse_experiment(specification, seed=None):
    seed_random_state = random.Random(seed)
    uid_random_state = random.Random(seed)

    # repeat behaviour
    repeats = []
    for level, repeat in enumerate(specification["repeats"]):
        # for each repeat that has been specified we proliferate
        k = repeat["arguments"]["k"]
        name = repeat["arguments"]["name"]
        # todo: support resuming mode that allows for nested cross validation etc
        #  mode = repeat['arguments']['mode']
        repeat_seed = generate_seed(seed_random_state)
        # collect repeat configuration and extend already existing inner repeats
        repeat_collection = []
        for r in range(k):
            suffix = "_" + str(level) if level > 0 else ""
            info = {
                name + "_SEED" + suffix: repeat_seed,
                name + "_TOTAL" + suffix: k,
                name + "_NUMBER" + suffix: r,
            }
            loop = [update_dict(inner, info, copy=True) for inner in repeats]
            if len(loop) == 0:
                loop = [info]
            repeat_collection.extend(loop)
        repeats = repeat_collection
    if not len(repeats):
        repeats.append({})

    for repeat in repeats:
        for component in specification["components"]:
            node_arguments = copy.deepcopy(component["arguments"])
            components = node_arguments.pop("components")
            if not isinstance(components, (list, tuple)):
                components = [components]
            resources = node_arguments.pop("resources", None)
            node = node_arguments.pop("node")

            node.flags["GLOBAL_SEED"] = seed
            node.flags["SEED"] = generate_seed(random_state=seed_random_state)
            node.flags["UID"] = generate_component_id(random_state=uid_random_state)[0]
            node.flags.update(repeat)

            yield node, components, resources
