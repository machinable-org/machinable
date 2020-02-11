# Changelog

## Unreleased

No current changes

## v1.1.1

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