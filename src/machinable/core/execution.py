import os
import random
import datetime
from typing import Union, Any, Callable

import yaml
from fs.errors import DirectoryExists
from fs.opener.parse import parse_fs_url

from ..core.core import FunctionalComponent
from ..engine import Engine
from ..project import Project
from ..config.interface import ConfigInterface
from ..store import Store
from ..utils.strings import (
    decode_id,
    generate_experiment_id,
    generate_uid,
    generate_execution_id,
)
from ..utils.formatting import msg
from ..experiment.experiment import Experiment
from ..experiment.parser import parse_experiment


def execute(
    experiment: Union[Experiment, Any],
    storage: Union[Store, dict, str] = None,
    engine: Union[str, dict, Engine, None] = None,
    project: Union[Project, Callable, str, dict] = None,
    seed: Union[int, None, str] = None,
):
    experiment = Experiment.create(experiment)
    engine = Engine.create(engine)
    project = Project.create(project)

    # generate unique experiment id
    if isinstance(seed, str):
        # from experiment id
        if len(seed) != 6:
            raise ValueError(f"Seed '{seed}' is not a valid experiment ID")
        experiment_id = decode_id(seed)
        encoded_experiment_id = seed
    elif isinstance(seed, int):
        # from seed
        experiment_id, encoded_experiment_id = generate_experiment_id(random_state=seed)
    else:
        # freely generated (default)
        experiment_id, encoded_experiment_id = generate_experiment_id()

    # todo: handle verbosity, should probably be handled by the engine
    msg(
        f"\nTask: {encoded_experiment_id} ({experiment_id})\n------------",
        color="header",
    )

    # parse config
    config = ConfigInterface(
        project.parse_config(),
        experiment.specification["version"],
        default_class=project.default_component,
    )

    # store
    if isinstance(storage, dict):
        storage_config = storage.copy()
    elif isinstance(storage, str):
        storage_config = {"url": storage}
    else:
        storage_config = {}

    storage_config["group"] = encoded_experiment_id

    # todo: disable code backups and persistent write
    # storage_config["code_backup"] = False
    # storage_config["url"] = "mem://"
    # don't use output redirection for local store
    output_redirection = storage_config.pop("output_redirection", "SYS_AND_FILE")

    # use project abstraction to determine whether we are in current environment

    # we redirect re-runs to reruns directory
    rerun = 1
    while rerun > 0:
        try:
            store = Store(storage_config)
            break
        except DirectoryExists:
            # try write/_reruns/:number
            if "://" not in storage_config["url"]:
                storage_config["url"] = "osfs://" + storage_config["url"]
            storage_path = parse_fs_url(storage_config["url"]).resource
            base_path = storage_path.replace("_reruns/" + str(rerun - 1), "")
            rerun_storage_path = os.path.join(base_path, "_reruns", str(rerun))
            storage_config["url"] = storage_config["url"].replace(
                storage_path, rerun_storage_path
            )
            rerun += 1

    if rerun > 1:
        msg(f"Experiment existing, re-running {rerun}. time", color="FAIL")

    # code backup
    if storage_config.get("code_backup", True):
        project.backup_source_code(
            filepath=store.config["code_backup"]["filepath"], opener=store.get_stream,
        )

    execution_plan = list(
        parse_experiment(experiment.specification, seed=experiment_id)
    )

    # write meta information
    meta = {
        "id": encoded_experiment_id,
        "seed": experiment_id,
        "execution_id": generate_execution_id(),
        "execution_cardinality": len(execution_plan),
        "name": experiment.specification["name"],
        "tune": "tune" in experiment.specification,
        "rerun": rerun - 1 if rerun > 1 else 0,
        "code_backup": storage_config.get("code_backup", True),
        "code_version": project.get_code_version(),
    }
    store.write(
        "experiment.json", meta, overwrite=True, _meta=True,
    )
    status = {
        "started": str(datetime.datetime.now()),
        "finished": False,
    }
    store._status = status
    store.write("status.json", status, overwrite=True, _meta=True)

    engine.init()

    # todo: move into parse_task
    prng = random.Random(experiment_id)
    for index, (node, components, resources) in enumerate(execution_plan):
        node.flags["UID"] = generate_uid(random_state=prng)
        node.flags["EXPERIMENT_ID"] = encoded_experiment_id
        node.flags["EXECUTION_INDEX"] = index
        node.flags["EXECUTION_CARDINALITY"] = meta["execution_cardinality"]
        node.flags["EXECUTION_ID"] = meta["execution_id"]

        storage_config["uid"] = node.flags["UID"]
        storage_config["output_redirection"] = output_redirection
        node_config = config.get(node)
        components_config = []
        for component in components:
            c = config.get(component)
            if c is not None:
                components_config.append(c)
        # execution middleware
        for c in [node_config] + components_config:
            project.registration.before_execution_middleware(c["args"], c["flags"])

        # execution print summary (todo: make this an optional output)
        msg(
            f"\nObservation: {node.flags['UID']} ({index + 1}/{len(execution_plan)} of experiment {encoded_experiment_id})",
            color="header",
        )

        msg(f"\nExecution:", color="yellow")
        msg(f"Store: {store.config['url']}", color="blue")
        msg(f"Engine: {engine}", color="blue")
        msg(f"Resources: {resources}", color="blue")

        msg(f"\nComponent: {node_config['name']}", color="yellow")
        msg(f":: {node_config['flags']}")
        if len(node_config["versions"]) > 0:
            msg(f">> {', '.join(node_config['versions'])}", color="green")
        msg(yaml.dump(node_config["args"]), color="blue")

        for component in components_config:
            if component:
                msg(f"\t {component['name']}", color="yellow")
                msg(f"\t:: {component['flags']}")
                if len(component["versions"]) > 0:
                    msg(f"\t>> {', '.join(component['versions'])}", color="green")
                msg("\t" + yaml.dump(component["args"]), color="blue")
        # end print summary

        # execution
        if "tune" in experiment.specification:
            if isinstance(project.default_component, FunctionalComponent):
                raise Exception("Tuning experiments do not support the functional API")

            if "dry" in experiment.specification:
                raise Exception("Tuning tasks do not support dry-execution")

            engine.tune(
                component=node_config,
                components=components_config,
                store=storage_config,
                resources=resources,
                **experiment.specification["tune"]["arguments"],
            )
        elif experiment.specification.get("dry", {}).get("arguments", None):
            # dry execution
            pass
        else:
            # this can be blocking
            engine.submit(node_config, components_config, storage_config, resources)

    engine.join()

    status["finished"] = str(datetime.datetime.now())
    store.write("status.json", status, overwrite=True, _meta=True)

    msg(f"\nFinished experiment {encoded_experiment_id}", color="header")

    engine.shutdown()
