# Axes

Why fan-out (`axis_<name>` → [`~~name`](/guide/versions#axes-one-token-many-runs)) is a
version token rather than a second module, a decorator, or a collection.

## The problem

Running one interface over many inputs used to cost a second module whose entire body was
a `for` loop. The [aggregate](/guide/advanced-execution#aggregates-and-deferred-collection)
is right when the coordinator has a config of its own, but for "sort these 40 sessions" it
was boilerplate — and, worse, invisible. The CLI, the API and the MCP all speak versions,
so a sweep that lived in a Python method could not be named on any of them.

The unused degree of freedom was that a version token denoted exactly one config. Letting
a token denote *several* turns the version list into a product space without inventing a
configuration language: an axis is still an ordinary Python function returning a list.

A useful consequence: axes resolve on the interface *and* on the project provider, like
config methods. A provider-level `axis_sessions` is a project-wide vocabulary that every
module can expand over.

## Cardinality belongs to the call site

`~~` is not decoration. It is the difference between `get(...)` returning a record and
returning a group, and that difference has to be visible everywhere a version is —
`to_cli()`, a stored `_version_`, an MCP call, a line pasted into a notebook.

The alternative considered was an `@axis` decorator on ordinary `version_*` methods, so
that `['~sgd', '~sweep']` expands without a distinct sigil. It is cheaper (one method
family, no parser change) and it was rejected: `~sweep` and `~fast` would look identical
while one launches 200 runs, and an author flipping `version_sweep` from a patch to a list
would silently change every existing call site from producing a record to producing a
group — including the lifecycle state the returned object is in. Cardinality is part of a
call site's contract, not an implementation detail of the method it names. (Secondary, but
concrete: [discovery](./discovery.md) is AST-only and never imports user code, so a prefix
is unfoolable where a decorator must be resolved through the import table, aliases
included.)

## Unexpanded is a state, not a subtraction

An interface with a pending axis is the module's own class, in a new *leading* lifecycle
state. It can be expanded, launched, versioned and printed; it can never be entered,
called, or materialized.

Defining a thing by what it cannot do is a Liskov smell, and the objection is worth
recording because the resolution is the interesting part: this is not subtraction, it is
the same shape as `local_directory()` on an interface that is not yet materialized.
`expand()` is a transition exactly as `materialize()` is, and the
[lifecycle table](/guide/interface#lifecycle) simply gains a row.

Keeping the module's own class (rather than returning a collection or a new kind) is what
preserves the class's methods — a group-level `summary()`, the quantity accessor an
[inference](/guide/inference) falls back to — keeps `get() -> Interface`, and keeps `get()`
lazy: nothing is globbed until you launch or ask.

## The silent-collapse hazard

The guards exist because of one specific failure. `Scope.__call__` returns its config
update, and an unexpanded scope's update does *not* contain the axis patch — so
`with get("machinable.scope", "~~seeds"):` would apply an **empty predicate** and fold an
entire sweep onto one record, without an error. Blocking `__enter__` makes that
unreachable.

The same class of failure has a general net: since every member's `(identity_key,
predicate_key)` pair is computed anyway (below), an expansion that yields N elements but
fewer than N distinct pairs is rejected. That single check catches a non-`Scope` context,
an axis method that ignores its loop variable, duplicate paths from a sloppy glob, and a
version override positioned after the axis token that cancels out the element's key. It is
the reason no whitelist of forbidden element types is needed.

## Contexts must be predicate-bearing

An element is a config patch or a **`Scope`** — nothing else. Entering an arbitrary
interface is legal Python but its effect is kind-dependent: a `Scope` folds into the
predicate, an `Execution` re-routes where members queue, a `Storage` re-routes where
records land, and a plain interface does *nothing* except leave an identity-neutral
context record. So `axis_datasets` yielding `[get("dataset_a"), get("dataset_b")]` reads
like it expands over datasets and instead produces N identical members.

The rule is narrower than it sounds only in name: `kind` is inherited, so any `Scope`
subclass qualifies, with its own `Config` and a `__call__` returning a richer predicate.

**Executions are deliberately not elements.** The semantics does not resolve: entering one
per member gives a fresh execution per run (right for Slurm, absurd for a multiprocessing
pool), while grouping members by execution requires identity-based election among objects
machinable never deduplicates, since each execution is a distinct event. And the motivating
case is already a first-class hook — resources are computed *per interface*
(`on_compute_default_resources(interface)`), so size-dependent resources are one execution
with per-member resources, not an axis element. Storages are excluded for a further
reason: members in different stores share `(identity_key, predicate_key)`, so duplicate
detection would reject a legitimate sweep; adding them would first require widening that
key with the parent.

## Identity

Two rules, pulling in opposite directions.

**Members are identity-neutral.** A run launched through an axis is the same record as the
same configuration launched directly — no group tag, no extra predicate. Axes are UX, like
[versions](/guide/versions#versions-are-ux-not-identity); version spelling never reaches
the hash, since the `_version_` layer is popped out of the resolved config before
canonicalization.

**The group is identified by the set it expands into**, as the sorted
`(identity_key, predicate_key)` pairs of its members. Config identity alone is not enough:
members that differ only by scope share a config, so `~~seeds(10)` and `~~seeds(3)` would
otherwise be the same [inference](/guide/inference) operand. The pairs must be captured
while each member's contexts are entered — `compute_predicate` reads the live connection
stack, so reading a member's predicate after its scope has exited returns the ambient one.

An unexpanded interface also never participates in record lookup (`singleton` short-circuits,
and `compute_fingerprint()` returns `None` as an `Execution` does). Without that,
`get("train", ["~sgd", "~~seeds"])` would resolve onto the *existing plain* `~sgd` record,
whose base config it shares.

## An axis is a pure function of its arguments

`axis_*` must be a `@staticmethod`. The rule it replaced — "an axis may read the base
config" — was implemented, tried, and abandoned, because it needs two incompatible notions
of order. For `["~~variants", {"lr": 0.7}]`, evaluating the axis against all non-axis
tokens gives `self.config.lr == 0.7` and then merges the element where the token sat, where
the trailing patch overwrites it: the axis reads as if the patch came first and is
overridden as if it came last. Evaluating against only the tokens to the *left* is
self-consistent but makes `self.config` inside the axis differ from `.config` outside it,
on the same expression. Neither is defensible, and the failure is not always caught:
elements `[{"lr": 0.07, "tag": "a"}, {"lr": 0.7, "tag": "b"}]` under a trailing
`{"lr": 0.7}` stay distinct by `tag` while every `lr` is silently `0.7`.

Without `self` there is exactly one ordering rule — the element merges where the token is —
and no config question at all. A relative sweep takes an argument
(`~~variants(base=0.5)`), which is strictly more legible: the dependency is in the version
list and round-trips through `to_cli()`, where `~sgd ~~variants` hid that `variants` read
`~sgd`. A sweep that wants a config field supplies it (`~~sessions(root=/data)` yielding
both `root` and `path`), so the parameter belongs to the axis rather than being duplicated
between config and call site.

A proxy `self` that raises only on `.config` was considered as the targeted version of the
same enforcement, and rejected: it blocks more than the rule, breaks `isinstance`,
`save_file`/`load_file` and session pickling for any axis that touches them, and
`@staticmethod` says the same thing in one visible word.

## The boundary against aggregates

The `@staticmethod` rule closes the easy route to impurity — no `self`, hence no
`load_file`, no `interfaces`, no config — but a module-level import can still read prior
results, so the rest is contract:

1. **Enumerable without running anything.** Needing results to decide makes it an
   experiment, not an axis.
2. **Pure and deterministic** given project state; group identity *is* the enumerated set,
   so sort your elements.
3. **Unordered and independent.** Members that depend on each other need an aggregate and
   `uses`.
4. **No state of its own beyond arguments.** The sharpest test: does the sweep's parameter
   need to survive as a record? Then it wants a `Config`, i.e. an aggregate.

Compressed: an axis answers *which points?*, an aggregate answers *what happens?* — a set
versus a procedure.

An adaptive axis that reads prior results is possible and unattractive: its group identity
is unstable, expansion happens at launch time so the results must already exist and the
sweep quietly becomes order-dependent, and the dependency is **invisible to
[provenance](./provenance.md)** where an aggregate would record `uses` edges. The last is
the real argument, and the reason the boundary is not merely stylistic.

## Also rejected

- **`get.each(module, [versions])` returning a collection.** Caller-side only: the axis
  stays undeclared, unspeakable on the CLI, and unusable as an inference operand. Still
  reasonable as a later convenience for genuinely ad-hoc fan-out.
- **`get()` returning an `InterfaceCollection`.** Breaks the return contract and loses both
  the operand story and the class's own methods.
- **`InterfaceCollection` inheriting from `Interface`**, so that a coordinator could simply
  *be* a collection. The most attractive wrong turn, and worth recording in full: four hard
  name collisions with incompatible semantics (`serialize`, `__eq__`, `launch`, `collect`);
  every `filter`/`map`/`related()` would construct two pydantic models and walk the MRO for
  a container that is pure plumbing; it inverts the [Collection clean
  break](./decisions#the-collection-clean-break); and it costs laziness and the class's
  methods. The `__iter__`/`__len__` delegation on an expanded interface is the bounded
  version of what it was reaching for.
- **`{"path": ["a", "b"]}` meaning fan-out.** Collides irrecoverably with list-typed config
  fields.
- **A materialized group record.** Inconsistent with ephemeral aggregates; anyone who wants
  a stored group handle can build one explicitly, since a coordinator is an ordinary
  interface.
- **The prefixes `versions_` and `each_`.** The first is a lie once contexts are elements;
  the second is a verb where `config_`/`version_` are nouns, and collides with
  `Collection.each`.

## Tension with "no sweep DSL"

[The philosophy](./philosophy#code-all-the-way-down) says machinable has no `sweep()` DSL,
and that stands: an axis is a Python method returning a list, and the loop is still Python.
What is new is only that a version token may denote several versions.

It does mean there are two ways to express a grid. The line: an axis for the flat case
(same interface, N inputs), an aggregate when the coordinator has its own config,
dependent ordering, or nested contexts. They compose — an aggregate's `launch()` may use
axes, and an axis member may be an aggregate.

The honest residue is that axes are not content-addressed. A glob that picks up a new file
changes the group, which is exactly why the group's identity is the set it produced rather
than the token that produced it.
