import os
import pickle
import mimetypes
import sys
import importlib
import traceback

from fs.zipfs import WriteZipFS
import gitignore_parser

from ..utils.utils import get_file_hash
from ..utils.vcs import get_commit
from ..utils.strings import is_valid_variable_name
from ..utils.formatting import msg
from ..core import Component as BaseComponent
from ..core import Mixin as BaseMixin
from ..config.loader import from_file as load_config_file
from ..config.parser import parse_module_list
from .manager import fetch_imports
from ..engine.settings import get_settings
from .registration import Registration


class Project:

    def __init__(self, directory=None, parent=None):
        self.config_file = 'machinable.yaml'
        self.registration_module = '_machinable'
        if directory is None:
            directory = os.getcwd()
        self.directory = directory
        self.parent = parent
        self.config_hash = None
        self.config = None
        self.parsed_config = None
        self.vendor_directory = os.path.join(self.directory, 'vendor')
        self.vendor_caching = get_settings()['cache'].get('imports', False)
        self._registration = None

        if not self.has_config():
            return
            # raise FileNotFoundError(f"'{self.directory_path}' does not contain a machinable.yaml")

        # create __init__.py in vendor directory and non-root projects to enable importing
        try:
            open(os.path.join(self.directory_path, '__init__.py'), 'a').close()
            if os.path.isdir(self.vendor_path):
                open(os.path.join(self.vendor_path, '__init__.py'), 'a').close()
        except IOError:
            pass

        if self.is_root() and self.directory_path not in sys.path:
            sys.path.insert(0, self.directory_path)

    @property
    def config_filepath(self):
        return os.path.join(self.directory, self.config_file)

    @property
    def directory_path(self):
        return os.path.abspath(self.directory)

    @property
    def directory_prefix(self):
        if self.directory == '.':
            return ''

        return self.directory

    @property
    def vendor_path(self):
        return os.path.abspath(self.vendor_directory)

    @property
    def import_prefix(self):
        # find relative address to target import class
        prefix = os.path.relpath(self.directory_path, os.getcwd())

        if prefix == '.':
            return None

        # todo: support for relative directory that contain ../

        return prefix.replace('/', '.')

    def is_root(self):
        return self.parent is None

    def get_root(self):
        if self.is_root():
            return self

        p = self.parent
        while not p.is_root():
            p = p.parent

        return p

    def has_config(self):
        return os.path.isfile(os.path.join(self.directory_path, self.config_file))

    def has_registration(self):
        return os.path.isfile(os.path.join(self.directory_path, self.registration_module + '.py')) or \
               os.path.isfile(os.path.join(self.directory_path, self.registration_module, '__init__.py'))

    def exists(self):
        return os.path.isfile(self.directory_path)

    @property
    def registration(self):
        if self._registration is None:
            if not self.has_registration():
                self._registration = Registration()
            else:
                try:
                    registration_module = importlib.import_module(self.registration_module)
                except ImportError as ex:
                    trace = ''.join(traceback.format_exception(etype=type(ex), value=ex, tb=ex.__traceback__))
                    msg(f"Could not import project registration. {ex}\n{trace}", level='error', color='fail')

                registration_class = getattr(registration_module, 'Project', False)
                if not registration_class:
                    registration_class = Registration

                self._registration = registration_class()

        return self._registration

    def get_config(self, cached='auto'):
        config_hash = None
        if cached == 'auto':
            config_hash = get_file_hash(self.config_filepath)
            if config_hash is None:
                cached = False
            else:
                cached = (self.config_hash == config_hash)

        if cached is not False and self.config is not None:
            return self.config

        # load file
        self.config = load_config_file(self.config_filepath, default={})
        self.parsed_config = None

        # manage hash
        if config_hash is None:
            config_hash = get_file_hash(self.config_filepath)
        self.config_hash = config_hash

        # validate and set defaults
        self.config.setdefault('_evaluate', True)

        self.config.setdefault('+', [])
        assert isinstance(self.config['+'], (tuple, list)), \
            'Invalid import definition: ' + str(self.config['+'])

        self.config.setdefault('mixins', [])

        return self.config

    def backup_source_code(self, filepath='code.zip', opener=None):
        """Writes all files in project (excluding those in .gitignore) to zip file

        # Arguments
        filepath: String, target file
        opener: Optional file opener object. Defaults to built-in `open`
        """
        if opener is None:
            opener = open

        # Get stream in the PyFS to create zip file with
        zip_stream = opener(filepath, 'wb')

        # Get object to test whether files are in .gitignore
        try:
            gitignore = gitignore_parser.parse_gitignore(os.path.join(self.directory_prefix, '.gitignore'))
        except FileNotFoundError:
            def gitignore(*args, **kwargs):
                return False

        with WriteZipFS(file=zip_stream) as zip_fs:
            for folder, subfolders, filenames in os.walk(self.directory_path):

                # Remove subfolders that are listed in .gitignore, so they won't be explored later
                subfolders[:] = [sub for sub in subfolders if sub != '.git' and
                                 not gitignore(os.path.join(folder, sub))]

                for file_name in filenames:
                    # Find absolute path of file for .gitignore checking
                    abspath_file = os.path.join(folder, file_name)

                    # Ignore binary file types
                    file_type = mimetypes.guess_type(abspath_file)[0]
                    if (file_type is None or not file_type.startswith('text/')) and not file_name.endswith('.yaml'):
                        continue

                    if gitignore(abspath_file):
                        # Skip file if it is listed in .gitignore
                        continue

                    # Get relative paths (which will be replicated in zip)
                    relpath_folder = os.path.relpath(folder, self.directory_path)
                    relpath_file = os.path.join(relpath_folder, file_name)

                    # Make directories in zip if necessary
                    if not zip_fs.exists(relpath_folder):
                        # Need to use makedirs (not makedir) in case file in nested folders
                        zip_fs.makedirs(relpath_folder)

                    # Read file contents
                    file_content = open(os.path.join(self.directory_prefix, relpath_file), 'r').read()

                    # Add file to zip
                    zip_fs.writetext(relpath_file, file_content)

            # Add zip to PyFS
            zip_fs.write_zip()

    def get_code_version(self):
        return {
            'project': get_commit(self.config_filepath),
            'vendor': [
                get_commit(os.path.join(self.directory_path, 'vendor', vendor, 'machinable.yaml'))
                for vendor in [next(iter(d)) for d in self.get_config()['+']]
            ]
        }

    def reload_imports(self):
        vendor_caching = self.vendor_caching
        self.vendor_caching = False
        self.parse_imports()
        self.vendor_caching = vendor_caching

    def parse_imports(self, cached=None):
        if cached is None:
            cached = self.get_root().vendor_caching

        config = self.get_config()['+']

        if len(config) == 0:
            return {'components': None, 'mixins': None}

        import_names = fetch_imports(self, config)

        imports = {'components': {}, 'mixins': {}}

        for import_name in import_names:
            # use pickled import cache if existing
            import_cache = os.path.join(self.directory_path, 'vendor', '.cache', import_name + '.p')
            if cached and os.path.isfile(import_cache):
                with open(import_cache, 'rb') as f:
                    import_config = pickle.load(f)
            else:
                # use project abstraction to resolve imports
                import_project = Project(os.path.join(self.directory, 'vendor', import_name), parent=self)

                if not import_project.has_config():
                    continue

                import_config = import_project.parse_config()

                # write pickle-cache
                os.makedirs(os.path.dirname(import_cache), exist_ok=True)
                with open(import_cache, 'wb') as f:
                    pickle.dump(import_config, f)

            # merge into global imports collection
            for section in ('components', 'mixins'):
                for k, v in import_config[section].items():
                    imports[section][import_name + '.' + k] = v

        return imports

    def parse_config(self, reference=True, cached='auto'):
        if cached == 'auto':
            cached = (self.config_hash == get_file_hash(self.config_filepath))
            # todo: detect import changes and set parse_import cache to false

        if not cached and self.parsed_config is not None:
            return self.parsed_config

        config = self.get_config(cached)

        imports = self.parse_imports()

        if reference:
            # pass in the full config as $ root reference
            reference = config

        collections = [k for k in config.keys() if k.startswith('components')]
        components = {}
        top_level_alias = {}
        for collection in collections:
            if config[collection] is None:
                continue

            scope = collection.replace('components:', '')
            if scope.find('=') != -1:
                scope, alias = scope.split('=')
                if alias in top_level_alias:
                    raise ValueError(f"Alias '{alias}' of 'components:{collection}' is ambiguous")
            else:
                alias = scope
                if alias in top_level_alias:
                    raise ValueError(f"'components:{collection}' already exists")

            if not is_valid_variable_name(alias):
                raise ValueError(f"Alias '{alias}' of 'components:{collection}' is not a valid Python variable name")

            top_level_alias[alias] = collection

            parse_module_list(
                config[collection],
                scope=scope if scope != 'components' else None,
                baseclass=BaseComponent,
                modules=components,
                imports=imports['components'],
                reference=reference,
                import_prefix=self.import_prefix,
                auto_alias=scope if scope != 'components' else None
            )

        mixins = parse_module_list(
            config.get('mixins'),
            scope=None,
            baseclass=BaseMixin,
            imports=[imports['mixins'], imports['components']],
            reference=reference,
            import_prefix=self.import_prefix,
            auto_alias='mixins'
        )

        self.parsed_config = {
            'imports': imports,
            'mixins': mixins,
            'components': components,
            # globals
            '_evaluate': config['_evaluate']
        }

        return self.parsed_config
