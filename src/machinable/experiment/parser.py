import copy
import random

from ..utils.dicts import update_dict
from ..utils.identifiers import encode_experiment_id, generate_component_id
from ..utils.utils import generate_seed


def parse_experiment(experiment, seed=None):
    seed_random_state = random.Random(seed)
    experiment_id = encode_experiment_id(seed, or_fail=False)

    # repeat behaviour
    repeats = []
    for level, repeat in enumerate(experiment.specification["repeats"]):
        # for each repeat that has been specified we proliferate
        k = repeat["arguments"]["k"]
        name = repeat["arguments"]["name"]
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
        for component in experiment.specification["components"]:
            node_arguments = copy.deepcopy(component["arguments"])
            components = node_arguments.pop("components")
            if not isinstance(components, (list, tuple)):
                components = [components]
            resources = node_arguments.pop("resources", None)
            node = node_arguments.pop("node")

            node.flags["GLOBAL_SEED"] = seed
            node.flags["EXPERIMENT_ID"] = experiment_id
            node.flags["SEED"] = generate_seed(random_state=seed_random_state)
            node.flags["COMPONENT_ID"] = generate_component_id()[0]
            node.flags.update(repeat)

            yield node, components, resources
