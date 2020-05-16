# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

## v2 (unreleased)

  - Experiment.directory() for automatic directories per experiment
  - Set default storage and engine in .machinable/settings.yaml
  - machinable.Execution() for fine grained execution control

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