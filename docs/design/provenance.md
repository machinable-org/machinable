# Provenance

How to read a run's provenance is in the [guide](/guide/provenance). This note records
why the provenance subsystem is shaped the way it is.

Provenance is machinable's answer to "what exactly produced this result, and how do I get
it back". For a system whose pitch is [content-addressed
reproducibility](./identity.md), that answer has to be captured at run time. Provenance
reconstructed at read time, against whatever code happens to be checked out months later,
is provenance that can be wrong.

## One graph, several projections

`provenance`, `lineage`, `related`, and `ancestor` are not four features. They are
projections over one typed interface graph, and machinable already is that graph: the
`@has_many`/`@belongs_to` relations persist to a SQLite edge table with a disk mirror
(`related/metadata.jsonl`). Provenance adds a single traversal and serialization layer on
top, rather than a parallel data model.

The graph has two levels:

- **Recipe**: interface-level, deterministic, content-addressed. What the interface *is*:
  config layers, the `with`-context stack, derivation ancestry. (Inheritance is
  structural type information, not a per-instance input; see naming below.)
- **History**: an event that happened *to* a recipe. What was actually computed: each
  execution, with its engine, resources, seed, and timing, and the code it ran against.

The split dictates where each piece lives. Recipe data sits on the interface and must be
identity-neutral (like `created_by` and `label`), because recording it must not change
the hash and break dedup. History data sits on the `Execution` record, where it is free
to vary per run.

## The governing principle

One rule settles the hard cases:

> machinable holds opaque references and never adjudicates their meaning.

It is the same rule that governs [config identity](./identity.md) (the canonical form is
machinable's; the contents of free-form fields are hashed verbatim) and
[storage](./storage.md) (a remote URI is opaque; the backend interprets it). Provenance
extends it to code.

## What gets persisted

Two pieces of data are captured beyond the relations that already exist, both
identity-neutral:

**The context stack.** At `materialize()`, the ordered `[(module, compact_version)]` of
the entered `with`-contexts is recorded as metadata on the interface. Contexts fold into
the [predicate](./identity.md) at creation time, but the predicate is a hash; recording
the stack makes it invertible, so the element chain a dispatch actually ran can be
reconstructed by uuid without touching identity.

**Code provenance as a `Manifest` kind.** Code, dependencies, and environment are
captured as content-addressed `Manifest` nodes that an execution `uses`. Making it a
graph node rather than a field on the execution record means it dedups, so the same code
state resolves to one `Manifest`, shared by every run that matches, so "show me every
execution at this code state" is an ordinary relation query. A per-run field would
duplicate exactly the fact content-addressing exists to record.

`Manifest` follows the [`Storage`](./storage.md) motif: the base `Manifest` is the git
implementation, the way the base `Storage` is the local-filesystem backend. Other tools
(a dependency lock, a container digest) are ordinary subclasses that override `capture()`
and, as needed, `resolve`/`verify`/`describe`. There is no registry; a tool is available
because it is importable, as [philosophy](./philosophy.md) demands. A project declares
its tools via `Project.on_resolve_manifests()` (default: the git manifest), the same
`on_resolve_*` motif as `on_resolve_remotes`. A run therefore `uses` one manifest node
per resolved tool, each independently content-addressed.

A manifest holds a list of entries `{provider, component, token}` where the token is
opaque to machinable. There are no git-shaped `commit`/`diff` fields; git is one tool
among many. Identity is `hash(entries)`. Because tokens are opaque, the awkward cases
fall to the tool:

- A dirty tree is the git manifest's business. Capture is strictly read-only: the tool
  records the commit, a dirty flag, and a fingerprint of the uncommitted state (the
  tracked diff plus untracked *paths*, never file contents), so identical dirty states
  dedup to one node while the repository is never written to. That trades restorability
  of uncommitted changes for safety; capture stays cheap with large untracked data
  (a freshly downloaded dataset not yet gitignored) and race-free under concurrent
  capture (MPI ranks).
- An unresolvable manifest is still a first-class node. A collaborator's run may name a
  commit you cannot reach; the node still exists and still `describe()`s itself, with
  `resolve()`/`verify()` succeeding only where the tool can reach the bytes. This is the
  stance storage takes with remote URIs: provenance survives without the bytes.

Capture happens at `dispatch_interface`, per run, so a resume gets its own manifest.

## Naming

- `lineage` used to mean the class-MRO chain, which readers perennially confused with
  derivation. The MRO chain is now `inherits`, and `lineage()` means the derivation
  ancestor chain users expect.
- `uses` stays adjacency, not recipe.
- `Manifest` was chosen over `Snapshot` because it holds references (a bill of
  materials), not bytes, which is honest about the delegation boundary. It deliberately
  rhymes with the `predicate_from_manifest` helper, as both are content identities that
  re-establish something.

## The wire shape

The provenance graph is a DAG, not a tree. `context`, `uses`, and `manifest` edges are
many-to-many, and the shared nodes (a manifest used by forty runs) are the payload; a
tree would duplicate them. The walk therefore serializes as a normalized node-link
structure: nodes keyed once, typed edges by reference.

```python
class GraphNode(BaseModel):
    uuid: str
    kind: str                       # Interface | Execution | Manifest | Scope ...
    module: str | None = None
    version: list[str | dict] = []
    label: str | None = None
    attributes: dict[str, Any] = {} # per-kind facet

class GraphEdge(BaseModel):
    source: str
    target: str
    rel: str                        # derivation | context | uses | runs | manifest

class ProvenanceGraph(BaseModel):
    root: str
    nodes: list[GraphNode]
    links: list[GraphEdge]
```

One envelope serves every surface: `Interface.provenance()`, the REST route, and the MCP
tool all return this object. `related` is its depth-1 slice. The node-link JSON
convention was adopted because d3, cytoscape, and `networkx.node_link_graph` read it
directly. machinable does not take a graph library as a dependency, since the operations
provenance needs are a bounded BFS with a seen-set, an edge filter, and a depth cap.

## Traversal policy

The default walk follows `derivation`, `runs`, and `manifest` deeply (trees or single
hops, cheap) and expands `uses` exactly one hop, so you see what a run directly consumed
without paying for its transitive closure. Deeper walks are opt-in via `depth=`/`rels=`.
A node cap bounds the output and sets an explicit `truncated` flag, so the default stays
bounded and honest about being bounded rather than silently dropping edges.

`Manifest` identity never models "partial" capture. A manifest is exactly its entries;
git-only and git+container are simply different manifests that dedup differently.
A completeness flag would require machinable to know the expected tool set, which is the
governing principle's line: it has no grounds to know. A tool that runs and finds nothing
can emit an explicit sentinel entry (a real, hashable token); "warn me the environment
wasn't captured" is a read-time comparison against the currently resolved tool set, the
same shape as storage's `bytes_missing`, never baked into the content hash.
