# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

# Unreleased

No current changes

# v4.10.6

- Support sqlean.py
- Include defaults in cachable key

# v4.10.5

- Upgrade omegaconf

# v4.10.4

- Respect .gitignore in code rsync
- Prevents false positive config method matches
- Adds CWD to PATH when using CLI
- Load from directory in dispatch code

# v4.10.3

- Option to hide interfaces from get
- Simplified `**kwargs` arguments in CLI
- Adds save/load_attribute helper
- Adds `@cachable` decorator utility

# v4.10.2

- Eager callable resolution in versions
- Allow module dependencies in on_resolve_remotes
- Fix CLI version parsing issue
- Improved version call normalizer
- Prevent recursions in self.future() calls

# v4.10.1

- Consistent `future()` behavior for Interface and Component
- Support multi-line version arguments

# v4.10.0

- New configure and commit events
- Support interface **kwargs in CLI
- Adds `get.cached_or_fail`
- Move `_machinable/project` to `interface/project`
- Adds `Interface.future()`
- Enable custom context lookups in index
- Adds `utils.file_hash`
- Adds `Execution().deferred()` to prevent automatic dispatch
- Respect CLI context order

# v4.9.2

- Determine CLI target based on order to allow non-component targets
- Ensure that config field is always reloaded from index to avoid incorrect recomputation

# v4.9.1

- Use text-based link relation by default

# v4.9.0

- Adds `Interface.related_iterator()`

# v4.9.0

- Use nanoseconds since epoch in timestamp
- Adds `get.from_directory` and `get.by_id` to query
- Introduces stable IDs based on the commit-context
- Saves inverse relations and relationship meta-data in local directory
- Adds index.import_directory method
- Allows search by short ID instead of UUID
- Adds storage upload/download methods

# v4.8.4

- Adds Interface.related()
- Improved Globus storage example

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
