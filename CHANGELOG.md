# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

# v2.12.2

- Allow registration overwrite in Execution.set_schedule

# v2.12.1

- Ensure that each Execution object has its own Registration
- Allow View creation from URL

# v2.12.0

- Allow simpler standard Python class usage of views
- New Component.submission alias for easier introspection
- Capture Slurm engine resource arguments
- New start, finish and success dependent component life cycle events
- Simplify access to engine information

# v2.11.0

- Add `host_information` event for explicit registration of additional host info
- Add Execution set_directory method
- Use multiprocess execution by default
- Add on_before_component_construction event
- Allow to set environment variables via special ENVIRON flag
- Allows config method invocation from within config methods

# v2.10.0

- Fix bug where SqlIndex models are not recognised correctly
- Add create option to get_url and get_local_directory
- Enable schema-validation by default

# v2.9.4

- Introduce engine before and after dispatch events
- Promote mixin overrides in version dict as default

# v2.9.3

- Adds default project option
- Allow mixin overrides in version dict

# v2.9.2

- Mixins can be specified, extended and overwritten via `Experiment().component(mixins=[])`

# v2.9.1

- New nested version syntax `~nested:version`

# v2.9.0

- Resolve @-directives relative to `_machinable` module rather than top project level
- Submission API replaces the StorageExperiment/StorageComponent interface

# v2.8.4

- Fix uncaught exception in `get_commit` host information

# v2.8.3

- New `on_resolve_vendor` registration event
- `includes` keyword in machinable.yaml
- Clone git+ vendor imports automatically

# v2.8.2

- New `before_script` and `after_script` modifier methods in Slurm engine

# v2.8.1

- Set `default_code_backup` options in settings.yaml and Registration

# v2.8.0

- Record component inheritance lineage in flags.LINEAGE
- Support symlinks and recursive .gitignore files in code backup
- Adds storage.get_component() to directly retrieve components

# v2.7.2

- Hide merged ~version configuration in summary
- Use timestamp representation to decrease records file sizes

# v2.7.1

- Capture Slurm status information in engine/info.json

# v2.7.0

- Experimental schema_validation option
- Support .json and .yaml files as version arguments
- jsonl based record writer for continuous writes 
- Removes deprecated self.store
- New registration event `on_before_storage_creation`
- Control the output redirection via OUTPUT_REDIRECTION flag

# v2.6.0

- Deprecates self.store in favor of self.storage
- Support static host info methods in registration 
- New `find_experiments` method to simplify recursive search for experiments in a given directory

## v2.5.2

 - Improved reference documentation
 - Experimental storage View API
 - Add default_resources inheritance

## v2.5.1

 - Restructured documentation
 - Edit experiments from command line when prefixed with `:`
 - Auto-name experiments when using @-directive
 - Display experiment and project name in logging output
 - Cleaner Execution.summary()

## v2.5.0
 
 - Directory specification is now part of the storage configuration
 - Execution/execute can now be used to decorate Components classes
 - New `on_component_import` events in Registration
 - Configuration updates are validated to only override existing keys to guard against unrecognised typos
 - Specify default resources in Registration
 - Engines can specify support for resource specification

## v2.4.0

 - GraphQL server supports basic execution, index and storage APIs
 - Allow config inheritance from outer scopes
 - Optional project `name` in machinable.yaml
 - New `get_experiment()` shortcut on Storage() instances
 - Explicit symlink support for project dependencies
 - Append vendor project directories to sys.path by default
 - Execution.failure count property to detect failures more easily
 - Removes deprecated v1 compatibility layer

## v2.3.0

- Rewrites storage to experiments/ subfolder if experiment exists
- New storage APIs to discover related experiments
- Introduce global on_submit event
- Disable automatic checkpoint handling in favour of increased user control
- Executions loading via @ import shorthand
- SqlIndex that can persist experiments in SQL-type databases

## v2.2.1

- Make `dataset` dependency optional

## v2.2.0

 - Experimental Index() interface
 - Storage configuration can be written in modules using the Storage() interface
 - Support for flattened dict notation
 - Environment variable expansion in machinable.yaml
 - Reduced import dependencies in __init__.py

## v2.1.0

 - New CLI option `execution` that allows for resuming executions more easily
 - Fix issue that prevented the status.json information to be written

## v2.0.1

 - Improved Slurm engine

## v2.0.0

  - Many APIs have been renamed for increased consistency
  - Experiment.directory() for automatic directories per experiment
  - Set default storage and engine in .machinable/settings.yaml
  - machinable.Execution() for fine grained execution control
  - Computable resources specification
  - Specify values based on other values
  - New Registration API that allows to define project wide settings such as global config methods or custom host information

## v1.2.1

  - Automatic output capturing
  - Allow import registration for non-machinable repositories
  - Handle RayActor exception gracefully

## v1.2.0

  - New Engine API for support of custom execution modes; deprecates ``local`` argument in execute() in favor of default local driver
  - Multiprocessing driver to support parallel execution without Ray
  - Fix uncaught exception in Observations.records when data type was changed between iterations
  - Reload imported components modules to enable easier execution in interactive environments
  - Automatically capture environment variables for host information

## v1.1.5

  - Bugfix for correct Exception propagation in local mode

## v1.1.4

  - Fix bug where record writer fails when used before execute events
  - Add avg mode of record.timing()

## v1.1.3

  - Support for Ray 0.8
  - Fixed bug in observer where task names where not captured correctly
  - New flags with execution information
  - Exceptions in the components are now caught and reported back to the driver

## v1.1.2

  - Prevent records FileNotFoundError when training in progress
  - Catch occasional error from strptime missing microseconds
  - Don't save actor config in observation data
  - Easier access to versions in ConfigDict via get_versioning

## v1.1.0

  - Documentation source code release
  - Removes deprecated ``Experiment.node()``. Use ``Experiment.components()`` instead
  - New optional dependencies installation via ``pip install machinable[full]``

## v1.0.0

  - Initial public release