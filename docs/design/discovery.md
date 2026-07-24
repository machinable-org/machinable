# Discovery

How to list a project's interfaces from the CLI, the API, or an editor is in the [guide](/guide/discovery). This note records why discovery is shaped the way it is.

Discovery answers "what interfaces does this project offer, and how are they configured". This is useful for autocompletion, the API's module catalog, and any tool that needs the project's vocabulary before anything runs. The answer has to be cheap and safe, i.e. typing `machinable <tab>` must not wait on a heavy import, or execute arbitrary project code just to render a list.

## The governing principle

The obvious way to describe an interface is to import it and introspect the class, but importing a research file runs its top-level side effects and pulls its heavy dependencies. Moreover, the walk that finds those files descends into whatever the directory skip-set does not prune (e.g. `venv`, a build tree, a gitignored scratch dir). To avoid this, the discovery's guiding principle is:

> Discovery is a read-only, best-effort static analysis. It imports nothing and promises nothing.

When static analysis cannot resolve a construct (base class computed at runtime, a `Config` built by a metaclass, a `*`-import, etc.), the discovery surfaces what it could extract and marks the rest `partial`. It does not fall back to importing to recover fidelity. A project that reaches for dynamic tricks gets degraded discovery as the signal to write conventionally. machinable does not execute code to guarantee correctness it said it would not guarantee. This is the same stance [provenance](./provenance.md) takes toward an unresolvable manifest where the node still exists and still describes itself, without the bytes.

## Discovery is an interface kind

Discovery follows the [`Manifest`](./provenance.md)/[`Storage`](./storage.md) motif in that the base `Discovery` is the local implementation using a read-only AST walk of the project source that honors `.gitignore`. Other schemes (a remote catalog, a package registry, a different VCS's ignore file) are ordinary `Discovery` subclasses, as the [philosophy](./philosophy.md) demands. A project declares its schemes from its provider via `on_resolve_discovery()`.

Because `Discovery` is a real interface, it inherits Config, versions, and config methods for free, and it offers two override seams at different grains: the ignore rule, so a Mercurial user swaps in `.hgignore` by overriding one method, and the walk itself, for a wholly different source such as a remote catalog. Extra ignore patterns are a Config value, tunable with no subclass at all. `Discovery` is never entered as a `with`-context, it is resolved on demand and instantiated per call, like `Manifest`, so it never touches the
connection stack.

## Resolving inheritance without importing

The hard part of static discovery is that "is this an `Interface`?" and "what is its full `Config`?" both depend on a class's base chain, which crosses module boundaries. machinable already records that chain at runtime as `inherits` (the MRO module tuple) so discovery reconstructs it statically with a symbol graph. Every candidate file is parsed once, and an import table (resolving aliased and relative imports to a concrete module and symbol) lets base references resolve class to class, across files.

The graph is anchored on machinable itself. machinable is installed and trusted, so its own interface kinds are enumerated by importing machinable only (no user code). A project class is an interface exactly when its resolved base chain terminates at one of those anchors. Only user and remote modules are parsed. A chain that terminates at an unresolvable symbol like a third-party base, a star-import, etc. is not confirmed, so the module is either dropped or surfaced `partial`. The same walk merges an inherited or extended `Config` (a subclass that extends the parent's `Config`, or omits it to inherit outright) by collecting fields along the resolved chain, child overriding parent.

## What gets extracted

Because a `Config` must subclass `pydantic.BaseModel`, the static side handles exactly one shape. From a confirmed class it reads the config fields (with their type, whether they are
required, a literal default when one can be evaluated, and the non-identifying flag), the `version_*` vocabulary with signatures and docstrings, and the `config_*` methods. Anything the parser cannot evaluate is skipped rather than guessed, and flips the result to `partial` as an advisory hint carried through the API, MCP, and CLI.

## Remotes carry their declared name

A remote is declared through `on_resolve_remotes()`, a map from a declared module name to a source, where the key is the identity-relevant name and the on-disk location under `interface/remotes/` is an implementation detail that never enters dedup. Discovery preserves that distinction in that it reports a remote under its declared name, using the physical path only to locate source for the parser. Vendored code is walked solely to populate the symbol graph so cross-boundary inheritance resolves but never names a discovered module.

Discovery is static, so it never fetches. A declared-but-unfetched remote is listed under its declared name with an empty `partial` schema (known to exist, not yet introspectable). `machinable fetch` remains the explicit step that makes the full schema available.

## The safety floor

A non-negotiable floor sits below the pluggable ignore layer so that dot-directories (`.git`, `.venv`), `__pycache__`, `node_modules`, and the storage/scratch trees are pruned regardless of any scheme. The base gitignore semantics sit on top of that floor.
