# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

## Unreleased

No current changes

## v1.1.4

  - Fix bug where record writer fails when used before execute events
  - Add avg mode of record.timing()

## v1.1.3

  - Support for Ray 0.8
  - Fixed bug in observer where task names where not captured correctly
  - New flags with execution information
  - Exceptions in the component are now caught and reported back to the driver

## v1.1.2

  - Prevent records FileNotFoundError when training in progress
  - Catch occasional error from strptime missing microseconds
  - Don't save actor config in observation data
  - Easier access to versions in ConfigDict via get_versioning

## v1.1.0

  - Documentation source code release
  - Removes deprecated ``Task.node()``. Use ``Task.component()`` instead
  - New optional dependencies installation via ``pip install machinable[full]``

## v1.0.0

  - Initial public release