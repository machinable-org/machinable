# Changelog

<!-- Please add changes under the Unreleased section that reads 'No current changes' otherwise -->

# Unreleased

No current changes

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
