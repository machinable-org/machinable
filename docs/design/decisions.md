# Key decisions

A few smaller design decisions that shaped the current API, recorded so the reasoning
isn't lost.

## pydantic-only `Config`

[`Config` must be a pydantic `BaseModel`](/guide/configuration); plain `dict` and
dataclass configs were dropped and now raise. The reason is [identity](./identity.md):
typed fields coerce (`1` becomes `1.0`), which is what makes the canonical form
well-defined. An untyped dict config lets the same value reach the hash as `1` in one
record and `1.0` in another, producing spurious distinct identities, exactly the
subtlety the canonical form exists to remove. With identity riding on the schema,
requiring pydantic is a prerequisite rather than a tax, and it pays for itself
(validation, defaults, `model_fields`, JSON-schema for the API and MCP). The only
un-coerced residue is the contents of free-form container fields, which are hashed
verbatim by design.

## cloudpickle for in-session interfaces

An ad-hoc interface defined in a REPL or notebook (a `__session__` module) is persisted
by pickling its class. `dill` cannot pickle a locally-defined pydantic model class, so
making `Config` pydantic-only would have broken in-session interfaces outright. The
class dump uses `cloudpickle` instead (by value, and the stream stays
standard-`pickle`-loadable). Module-level interfaces were never affected, since they
pickle by reference. A small dependency in exchange for keeping notebook-defined
interfaces working.

## The `Collection` clean break

[`Collection`](/guide/collections) was reduced to a minimal live-run handle
(`filter`/`map`/`first`/`last`/relations/`launch`/`find_many_by_id`); the home-brewed
analytics methods (`pluck`, `avg`, `implode`, `as_numpy`, ...) were removed, not
soft-deprecated. The reasoning: a `Collection` holds live, behavior-bearing interfaces
while analysis wants tabular values, which are different kinds of object. Rather than
reimplement pandas in idioms nobody has training on, machinable hands off a DataFrame
via a flat-columned `as_dataframe()` and keeps `pandas` a lazy import out of core. This
reduces the bespoke surface to learn instead of mimicking pandas.

## Unknown config keys

As a consequence of strict pydantic models, an unknown config key (a typo in a version)
is silently dropped by pydantic's default `extra="ignore"` rather than creating a
distinct run. This is mostly desirable (schema discipline) but silent; whether to switch
to `extra="forbid"` so typos raise is an open follow-up.
