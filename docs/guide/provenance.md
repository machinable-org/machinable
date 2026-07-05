# Provenance

Provenance answers "what produced this result?". machinable records the answer at run
time, so you can reconstruct it later even if the project has moved on.

## What gets captured

For every run, three kinds of provenance are recorded automatically:

- **The recipe.** The interface's config layers (default, version, overrides, resolved)
  and the ordered `with`-context stack it was created under, so the exact element chain
  that produced a run can be read back by uuid.
- **The history.** Each [execution](./execution.md), with its seed, resources, and
  timestamps.
- **The code state.** At dispatch, the project's code is captured as a `Manifest`, by
  default the current git commit, plus a read-only fingerprint of any uncommitted
  changes. Capture never modifies the repository. The run records that it `uses` this
  manifest.

## Reading it back

```python
run = get("train", ["~sgd"])

run.lineage()        # the derivation chain, root down to the immediate parent
run.related()        # depth-1 neighbours across all relations
run.provenance()     # the full graph: recipe, executions, manifests
```

`provenance()` returns a node-link graph (nodes plus typed edges such as `derivation`,
`uses`, `runs`, `manifest`) that d3, cytoscape, or `networkx.node_link_graph` can read
directly. The API server and the [MCP](/mcp/overview) expose the same object.

## Manifests

A `Manifest` names the code state a run used. The captured references are opaque to
machinable; the tool that created them knows how to act on them:

```python
execution = run.executions.last()
manifest = next(u for u in execution.uses if u.kind == "Manifest")

manifest.describe()              # e.g. ["git 1b16f09f (dirty)"]
manifest.verify()                # does the current environment still match?
manifest.resolve("/tmp/code")    # reconstruct the recorded commit into a directory
```

For a run that was dirty at capture, `resolve()` reconstructs the base commit; the
uncommitted changes are identified by their fingerprint but are not restorable, since
capture never writes anything into the repository.

The same code state always resolves to the same manifest, so runs that share a commit
share one manifest node, and "every run at this code state" is an ordinary relation
query.

## Capturing more than git

Which tools capture provenance is decided by the project. Override
`on_resolve_manifests` in `project.py` to add or replace tools; each is a `Manifest`
subclass that overrides `capture()` (and `resolve`/`verify`/`describe`):

```python
class Project(machinable.Project):
    def on_resolve_manifests(self):
        return ["machinable.manifest", "manifests.conda_lock"]
```

Each resolved tool contributes its own manifest node per run.

The reasoning behind this design (why manifests are graph nodes, why the references stay
opaque) is in [Design notes → Provenance](/design/provenance).
