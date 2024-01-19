# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

# v4.8.3

- Ensure that committed in-session interface code is being updated

# v4.8.2

- Fix issue where extra data from schema is not reloaded from index

# v4.8.1

- Allow version extension via on_resolve_element
- Resolve remotes during project element import
- Allow arbitrary classes within on_resolve_element
- Ignore errors during storage symlink creation

# v4.8.0

- Only unflatten version at the top-level by default
- Adds `get.prefer_cached` modifier
- Uses index and lazy directory fetch for faster interface retrieval
- Adds storage relation symlink for easier directory navigation
- Uses reversed uuid7 non-hex notation for easier tab-complete

# v4.7.0

- Support element list or instance in `get` for easy extension
- Configurable project and python in component dispatch code
- Adds shell helpers `utils.run_and_stream` and `utils.chmodx`
- Supports get modifiers in CLI, closely matching the Python API

# v4.6.3

- Improves element string representation
- Adds `execution.output_filepath` and `execution.component_directory`
- Reject stale context matches in `index.find`

# v4.6.2

- Introduces cached `computed_resources` to supersede `compute_resources`
- Fixes exception handling if raised within execution context

# v4.6.1

- Adds a priori modifiers `get.all`, `get.new` etc.
- Remove experimental enderscore feature

# v4.6.0

- Leverages UUID7 for timestamp information
- Drops support for EOL Python 3.7
- Upgrades to pydantic v2
- Drops default settings parser
- Handles non-existing keys in Element.matches scope lookup
- Propagate exceptions during mixin getattr lookup

# v4.5.0

- Adds scopes to support context annotations
- Adds all() and new() interface query modifiers
- Adds config `to_dict` helper
- Gracefully end output streaming on keyboard interrupt

# v4.4.0

- Improved tracking of execution meta-data
- Reliable `.execution` access to make None-checks obsolete
- Adds `stream_output` to simplify live monitoring of execution logs
- Allow predicate specification based on the element kind
- Prevent index errors in multithreaded environments
- Disables automatic gathering of project relationship

# v4.3.1

- Drops commandlib dependency
- Fix Component.execution resolution for resource retrieval

# v4.3.0

- Generalized storage (#437)
- Support for in-session element instances
- Allow unstructured untyped dict-config
- Simplified event structure

# v4.2.0

- Convert multiple storage into regular element (#426)

# v4.1

- Revamped CLI using element version syntax  (#422)
- Allow arbitrary plain file extensions when saving/loading files
- Filesystem storage captures groups within JSON files rather than directory name
- Represent independent schedule via `None`
- Adds Execution.on_verify_schedule to verify execution schedule compatibility

# v4.0

- Complete rewrite using elementary approach. Check out the documentation to learn more.
