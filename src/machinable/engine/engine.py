import os
import random
import datetime

from fs.errors import DirectoryExists
from fs.opener.parse import parse_fs_url

from ..project import Project
from ..config.interface import ConfigInterface
from ..observer import Observer
from ..utils.strings import decode_id, generate_task_id, generate_uid, generate_execution_id
from ..utils.formatting import msg
from ..task.task import Task
from ..task.parser import parse_task
from .handler import execute_job, execute_tune, execute_export
from .events import Events
from .promise import Promise
from .functional import FunctionalCallback
from .history import get_history


class Engine:

    def __init__(self, project_directory=None, mode=None, events=None):
        self.project = Project(project_directory)
        # set mode from environment variable
        self._mode = None
        self.mode = mode or os.getenv('MACHINABLE_MODE', 'DEFAULT')
        self.events = events or Events()

    @property
    def mode(self):
        return self._mode

    @mode.setter
    def mode(self, value=None):
        if not isinstance(value, str) or value.lower() not in ['dev', 'debug', 'default']:
            raise ValueError(f'Invalid mode: {value}')

        self._mode = value.upper()

    def execute(self, task, storage=None, seed=None, local=None, identifier=None, callback=None):
        if identifier is None:
            identifier = generate_execution_id()

        if isinstance(task, list):
            # if seed is a list, we match it with the task list otherwise we use the same seed for all schedules
            def s(t):
                if isinstance(seed, (list, tuple)):
                    return seed[t]
                else:
                    return seed

            return [self.execute(q, storage, s(i), local, identifier, callback) for i, q in enumerate(task)]

        task = Task.create(task)

        # generate unique task id
        if isinstance(seed, str):
            # from task id
            if len(seed) != 6:
                raise ValueError(f"Seed '{seed}' is not a valid task id")
            task_id = decode_id(seed)
            encoded_task_id = seed
        elif isinstance(seed, int):
            # from seed
            task_id, encoded_task_id = generate_task_id(random_state=seed)
        else:
            # freely generated (default)
            task_id, encoded_task_id = generate_task_id()

        self.events.trigger('generated_task_id', task_id, encoded_task_id)

        msg(f'\nTask: {encoded_task_id} ({task_id})\n------------', color='header')

        # the task id is used as seed and observer group name
        prng = random.Random(task_id)

        # observer
        if isinstance(storage, dict):
            observer_config = storage.copy()
        elif isinstance(storage, str):
            observer_config = {'storage': storage}
        else:
            observer_config = {}

        observer_config['group'] = encoded_task_id
        observer_config['events'] = self.events

        if self.mode == 'DEV':
            # disable code backups and persistent storage
            observer_config['code_backup'] = False
            observer_config['storage'] = 'mem://'

        if 'export' in task.specification:
            observer_config['code_backup'] = False
            if observer_config['storage'] == 'mem://':
                observer_config['storage'] = '.'
            observer_config['storage'].replace('osfs://', '')

        # we redirect re-runs to reruns directory
        rerun = 1
        while rerun > 0:
            try:
                observer = Observer(observer_config)
                break
            except DirectoryExists:
                # try storage/_reruns/:number
                if "://" not in observer_config['storage']:
                    observer_config['storage'] = "osfs://" + observer_config['storage']
                storage_path = parse_fs_url(observer_config['storage']).resource
                base_path = storage_path.replace('_reruns/' + str(rerun - 1), '')
                rerun_storage_path = os.path.join(base_path, '_reruns', str(rerun))
                observer_config['storage'] = observer_config['storage'].replace(storage_path, rerun_storage_path)
                rerun += 1

        if rerun > 1:
            msg(f"Task existing, re-running {rerun}. time", color='FAIL')

        # code backup
        if observer_config.get('code_backup', True):
            self.project.backup_source_code(observer, **observer.config['code_backup'])

        # parse
        config = ConfigInterface(self.project.parse_config(), task.specification['version'],
                                 default_class=FunctionalCallback(callback) if callback is not None else None)
        self.events.trigger('parsed_config', task_id, config)

        execution_plan = list(parse_task(task.specification, seed=task_id))
        self.events.trigger('parsed_execution_plan', task_id, execution_plan)

        # write meta information
        observer.store('task.json', {
            'id': encoded_task_id,
            'seed': task_id,
            'execution_id': identifier,
            'name': task.name,
            'tune': 'tune' in task.specification,
            'rerun': rerun - 1 if rerun > 1 else 0,
            'code_backup': observer_config.get('code_backup', True),
            'code_version': self.project.get_code_version()
        }, overwrite=True, _meta=True)
        # status information
        status = {
            'observations_count': len(execution_plan),
            'started': str(datetime.datetime.now()),
            'finished': False
        }
        observer._status = status
        observer.store('status.json', status, overwrite=True, _meta=True)

        # register storage location
        if observer.config['storage'] != 'mem://' and rerun <= 1:
            get_history().add(observer.config['storage'])

        promises = []

        for job_id, (node, children, resources) in enumerate(execution_plan):
            # generate unique directory
            observer_config['uid'] = generate_uid(random_state=prng)

            msg(f"\nObservation: {observer_config['uid']} "
                f"({job_id + 1}/{len(execution_plan)} of task {encoded_task_id})",
                color='header')

            node_config = config.get(node)
            children_config = [config.get(child) for child in children if child is not None]

            if 'tune' in task.specification:
                if callback is not None:
                    raise Exception('Tuning tasks do not support the functional API')

                if 'export' in task.specification:
                    raise Exception('Tuning tasks cannot be exported')

                if 'dry' in task.specification:
                    raise Exception('Tuning tasks do not support dry-execution')

                output = execute_tune(
                    node=node_config,
                    children=children_config,
                    observer=observer_config,
                    resources=resources,
                    **task.specification['tune']['arguments']
                )
            else:
                if 'export' in task.specification:
                    if callback is not None:
                        raise Exception('Export tasks do not support the functional API')

                    if 'dry' in task.specification:
                        raise Exception('Export tasks do not support dry-execution.')

                    output = execute_export(
                        project_path=self.project.directory_path,
                        node=node_config,
                        children=children_config,
                        observer=observer_config,
                        job=(job_id, len(execution_plan)),
                        **task.specification['export']['arguments']
                    )
                else:
                    output = execute_job(
                        node=node_config,
                        children=children_config,
                        observer=observer_config,
                        resources=resources,
                        local=local,
                        dry=task.specification.get('dry', {}).get('arguments', None)
                    )

            # handlers might return instantly with a promise that we resolve later to
            # allow parallel execution
            if isinstance(output, Promise):
                output.then(lambda result: self.events.trigger('completed_job', task_id, job_id, result))
                promises.append(output)
            else:
                self.events.trigger('completed_job', task_id, job_id, output)

        # resolve blocking promises
        for promise in promises:
            promise.resolve()

        status['finished'] = str(datetime.datetime.now())
        observer.store('status.json', status, overwrite=True, _meta=True)

        msg(f"\nFinished task {encoded_task_id}", color='header')

        return encoded_task_id
