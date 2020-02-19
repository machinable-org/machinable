import os
import yaml
import copy

from .export import Export
from ..utils.dicts import update_dict
from ..utils.formatting import msg
from .promise import Promise
from .functional import FunctionalCallback, FunctionalEngine


def execute_job(node, children=None, observer=None, resources=None, local=None, echo=True, dry=None):
    try:
        import ray
        RAY_SUPPORT = True
    except ImportError:
        RAY_SUPPORT = False

    if not RAY_SUPPORT or not ray.is_initialized():
        if local is False:
            msg('Ray backend is not available, using local mode instead.', level='warning')
        local = True

    # echo
    if echo:
        msg(f"\nExecution:", color='yellow')
        msg(f"Storage: {observer.get('storage', 'mem://')}")
        msg(f"Resources: {resources}", color='blue')
        msg(f"Local: {local}", color='blue')

        msg(f"\nComponent: {node['name']}", color='yellow')
        msg(f":: {node['flags']}")
        if len(node['versions']) > 0:
            msg(f">> {', '.join(node['versions'])}", color='green')
        msg(yaml.dump(node['args']), color='blue')

        for child in children:
            if child:
                msg(f"\t {child['name']}", color='yellow')
                msg(f"\t:: {child['flags']}")
                if len(child['versions']) > 0:
                    msg(f"\t>> {', '.join(child['versions'])}", color='green')
                msg(yaml.dump(child['args']), color='blue')

    if dry:
        return -1

    if local:
        if resources is not None:
            msg('Resource specification has no effect in local mode', level='warning')

        nd = node['class'](copy.deepcopy(node['args']), copy.deepcopy(node['flags']))
        promise = Promise(nd.dispatch(copy.deepcopy(children), observer), flags=node['flags'])
    else:
        # ray remote execution
        if isinstance(node['class'], FunctionalCallback):
            nd = ray.remote(resources=resources)(FunctionalEngine).remote(node['class'].callback,
                                                                          node['args'],
                                                                          node['flags'])
        else:
            nd = ray.remote(resources=resources)(node['class']).remote(node['args'], node['flags'])

        # destroy events class as independent instances will be recreated in the local workers
        observer['events'] = None

        promise = Promise(nd.dispatch.remote(children, observer, nd), flags=node['flags'])

    return promise


def execute_tune(node, children=None, observer=None, resources=None,
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

            node_args = copy.deepcopy(node['args'])
            node_args = update_dict(node_args, node_update)
            node_flags = copy.deepcopy(node['flags'])
            node_flags['TUNING'] = True

            children_config = copy.deepcopy(children)
            for i in range(len(children)):
                children_config[i]['args'] = update_dict(children[i]['args'], children_update[i])

            observer_config = copy.deepcopy(observer)
            observer_config['storage'] = '../../../'
            observer_config['allow_overwrites'] = True

            self.node = node['class'](node_args, node_flags)
            self.children, self.observer = self.node.dispatch(children_config, observer_config, self, lifecycle=False)
            self.node.create(self.children, self.observer)
            self.node.execute()
            self._node_execution_iterations = -1

        def _train(self):
            if hasattr(self.node.on_execute_iteration, '_deactivated'):
                raise NotImplementedError('on_execute_iteration has to be implemented to allow for step-wise tuning')

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
            raise ValueError('Storage has to be local; use upload_dir or sync options of Ray tune to copy to remote.')
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


def execute_export(project_path, node, children=None, observer=None, job=None, path=None, overwrite=False):
    if path is None:
        path = os.path.join(project_path, 'exports')

    if 'events' in observer:
        del observer['events']

    # if more than one job, write into subdirectories
    if job[1] > 1:
        path = os.path.join(path, str(job[0]))

    export_path = os.path.abspath(path)

    if os.path.exists(export_path) and not overwrite:
        raise FileExistsError(f"Export directory '{export_path}' exists. To overwrite, set overwrite=True")

    msg(f"\nExporting to {export_path}", color='yellow')

    export = Export(project_path, export_path)

    # instantiate targets
    exp = node['class'](config=node['args'], flags=node['flags'])
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
    export.module(node['class'])
    for child in children:
        export.module(child['class'])

    # export mixins
    mixins = node['args'].get('_mixins_', [])
    for child in children:
        mixins.extend(child['args'].get('_mixins_', []))
    for mixin in mixins:
        export.module(mixin['origin'].replace('+.', 'vendor.'), from_module_path=True)

    export.write('__init__.py')

    export.machinable()

    export.entry_point(node, children)

    export.echo()

    msg(f"\nExporting finished. Run as 'cd {export_path} && python run.py'", color='yellow')
