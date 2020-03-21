import os
import random
import datetime
import copy

import yaml
from fs.errors import DirectoryExists
from fs.opener.parse import parse_fs_url

from ..project import Project
from ..config.interface import ConfigInterface
from ..observer import Observer
from ..utils.strings import decode_id, generate_task_id, generate_uid, generate_execution_id
from ..utils.formatting import msg
from ..utils.dicts import update_dict
from ..task.task import Task
from ..task.parser import parse_task
from .events import Events
from .functional import FunctionalCallback
from .history import get_history
from ..driver import Driver
from .export import Export


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

    def execute(self, task, storage=None, seed=None, driver=None, identifier=None, callback=None):
        if identifier is None:
            identifier = generate_execution_id()

        if isinstance(task, list):
            # if seed is a list, we match it with the task list otherwise we use the same seed for all schedules
            def s(t):
                if isinstance(seed, (list, tuple)):
                    return seed[t]
                else:
                    return seed

            return [self.execute(q, storage, s(i), driver, identifier, callback) for i, q in enumerate(task)]

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

        # initialise driver
        driver = Driver.create(driver)
        driver.init()

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

        # don't use output redirection for local observer
        output_redirection = observer_config.pop('output_redirection', 'SYS_AND_FILE')

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
            self.project.backup_source_code(
                filepath=observer.config['code_backup']['filepath'],
                opener=observer.get_stream
            )

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
            'name': task.specification['name'],
            'execution_cardinality': len(execution_plan),
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

        # register storage location (todo: write into sql database)
        if observer.config['storage'] != 'mem://' and rerun <= 1:
            get_history().add(observer.config['storage'])

        for index, (node, children, resources) in enumerate(execution_plan):
            node.flags['UID'] = generate_uid(random_state=prng)
            node.flags['TASK'] = encoded_task_id
            node.flags['EXECUTION_INDEX'] = index
            node.flags['EXECUTION_CARDINALITY'] = len(execution_plan)

            observer_config['uid'] = node.flags['UID']
            observer_config['output_redirection'] = output_redirection
            node_config = config.get(node)
            children_config = [config.get(child) for child in children if child is not None]

            # execution middleware
            for c in [node_config] + children_config:
                self.project.registration.before_execution_middleware(c['args'], c['flags'])

            # execution print summary (todo: make this an optional output)
            msg(f"\nObservation: {node.flags['UID']} ({index + 1}/{len(execution_plan)} of task {encoded_task_id})",
                color='header')

            msg(f"\nExecution:", color='yellow')
            msg(f"Storage: {observer.config['storage']}", color='blue')
            msg(f"Driver: {driver}", color='blue')
            msg(f"Resources: {resources}", color='blue')

            msg(f"\nComponent: {node_config['name']}", color='yellow')
            msg(f":: {node_config['flags']}")
            if len(node_config['versions']) > 0:
                msg(f">> {', '.join(node_config['versions'])}", color='green')
            msg(yaml.dump(node_config['args']), color='blue')

            for child in children_config:
                if child:
                    msg(f"\t {child['name']}", color='yellow')
                    msg(f"\t:: {child['flags']}")
                    if len(child['versions']) > 0:
                        msg(f"\t>> {', '.join(child['versions'])}", color='green')
                    msg("\t" + yaml.dump(child['args']), color='blue')
            # end print summary

            # execution
            if 'tune' in task.specification:
                if callback is not None:
                    raise Exception('Tuning tasks do not support the functional API')

                if 'export' in task.specification:
                    raise Exception('Tuning tasks cannot be exported')

                if 'dry' in task.specification:
                    raise Exception('Tuning tasks do not support dry-execution')

                self.execute_tune(
                    component=node_config,
                    children=children_config,
                    observer=observer_config,
                    resources=resources,
                    **task.specification['tune']['arguments']
                )
            elif 'export' in task.specification:
                if callback is not None:
                    raise Exception('Export tasks do not support the functional API')

                if 'dry' in task.specification:
                    raise Exception('Export tasks do not support dry-execution.')

                self.execute_export(
                    component=node_config,
                    children=children_config,
                    observer=observer_config,
                    job=(index, len(execution_plan)),
                    **task.specification['export']['arguments']
                )
            elif task.specification.get('dry', {}).get('arguments', None):
                # dry execution
                pass
            else:
                # this can be blocking
                driver.submit(node_config, children_config, observer_config, resources)

        driver.join()

        status['finished'] = str(datetime.datetime.now())
        observer.store('status.json', status, overwrite=True, _meta=True)

        msg(f"\nFinished task {encoded_task_id}", color='header')

        driver.shutdown()

    def execute_tune(self, component, children=None, observer=None, resources=None,
                     stop=None, config=None, num_samples=1, kwargs=None):
        try:
            import ray
            import ray.tune
            from ray.tune.trainable import Trainable
            from ray.tune.result import DONE
        except ImportError:
            raise ImportError('You have to install Ray to use tuning')

        if not ray.is_initialized():
            raise RuntimeError('Ray has not been initialised. Please make sure to run ray.init().')

        if kwargs is None:
            kwargs = {}

        if 'events' in observer:
            del observer['events']

        class MachinableTuningComponent(Trainable):

            def _setup(self, config):
                # apply config updates
                children_update = [{} for _ in range(len(children))]
                if 'node' in config:
                    node_update = config['node']
                    if 'children' in config:
                        children_update = config['children_patch']
                else:
                    node_update = config

                node_args = copy.deepcopy(component['args'])
                node_args = update_dict(node_args, node_update)
                node_flags = copy.deepcopy(component['flags'])
                node_flags['TUNING'] = True

                children_config = copy.deepcopy(children)
                for i in range(len(children)):
                    children_config[i]['args'] = update_dict(children[i]['args'], children_update[i])

                observer_config = copy.deepcopy(observer)
                observer_config['storage'] = '../../../'
                observer_config['allow_overwrites'] = True

                self.node = component['class'](node_args, node_flags)
                self.children, self.observer = self.node.dispatch(children_config, observer_config, self,
                                                                  lifecycle=False)
                self.node.create(self.children, self.observer)
                self.node.execute()
                self._node_execution_iterations = -1

            def _train(self):
                if hasattr(self.node.on_execute_iteration, '_deactivated'):
                    raise NotImplementedError(
                        'on_execute_iteration has to be implemented to allow for step-wise tuning')

                self._node_execution_iterations += 1
                self.node.flags.ITERATION = self._node_execution_iterations
                self.node.on_before_execute_iteration(self._node_execution_iterations)
                try:
                    callback = self.node.on_execute_iteration(self._node_execution_iterations)
                    if self.node.on_after_execute_iteration(self._node_execution_iterations) is not False:
                        # trigger records.save() automatically
                        if self.node.observer.has_records() and not self.node.observer.record.empty():
                            self.observer.record['_iteration'] = self._node_execution_iterations
                            self.observer.record.save()
                except (KeyboardInterrupt, StopIteration):
                    callback = StopIteration

                if len(self.node.record.history) > self._node_execution_iterations:
                    data = self.node.record.history[-1].copy()
                else:
                    data = {}

                data[DONE] = callback is StopIteration

                return data

            def _save(self, tmp_checkpoint_dir):
                return self.node.save_checkpoint(tmp_checkpoint_dir)

            def _restore(self, checkpoint):
                self.node.restore_checkpoint(checkpoint)

            def _stop(self):
                self.node.destroy()

        if 'storage' not in observer:
            observer['storage'] = '~/ray_results'

        if observer['storage'].find('://') != -1:
            fs_prefix, local_dir = observer['storage'].split('://')
            if fs_prefix != 'osfs':
                raise ValueError(
                    'Storage has to be local; use upload_dir or sync options of Ray tune to copy to remote.')
        else:
            local_dir = observer['storage']

        output = ray.tune.run(
            MachinableTuningComponent,
            name=os.path.join(observer['group'], observer['uid']),
            stop=stop,
            config=config,
            resources_per_trial=resources,
            num_samples=num_samples,
            local_dir=local_dir,
            **kwargs
        )

        return output

    def execute_export(self, component, children=None, observer=None, job=None, path=None, overwrite=False):
        if path is None:
            path = os.path.join(self.project.directory_path, 'exports')

        if 'events' in observer:
            del observer['events']

        # if more than one job, write into subdirectories
        if job[1] > 1:
            path = os.path.join(path, str(job[0]))

        export_path = os.path.abspath(path)

        if os.path.exists(export_path) and not overwrite:
            raise FileExistsError(f"Export directory '{export_path}' exists. To overwrite, set overwrite=True")

        msg(f"\nExporting to {export_path}", color='yellow')

        export = Export(self.project.directory_path, export_path)

        # instantiate targets
        exp = component['class'](config=component['args'], flags=component['flags'])
        mdl = [child['class'](config=child['args'], flags=child['flags'], node=exp) for child in children]

        # export config
        export.write('config.json', {
            'node': {
                'args': exp.config.toDict(evaluate=True),
                'flags': exp.flags.toDict(evaluate=True)
            },
            'children': [{
                'args': mdl[i].config.toDict(evaluate=True),
                'flags': mdl[i].flags.toDict(evaluate=True),
                'class': children[i]['class'].__name__
            } for i in range(len(children))],
            'observer': observer
        }, meta=True)

        # export children and node
        export.module(component['class'])
        for child in children:
            export.module(child['class'])

        # export mixins
        mixins = component['args'].get('_mixins_', [])
        for child in children:
            mixins.extend(child['args'].get('_mixins_', []))
        for mixin in mixins:
            export.module(mixin['origin'].replace('+.', 'vendor.'), from_module_path=True)

        export.write('__init__.py')

        export.machinable()

        export.entry_point(component, children)

        export.echo()

        msg(f"\nExporting finished. Run as 'cd {export_path} && python run.py'", color='yellow')
