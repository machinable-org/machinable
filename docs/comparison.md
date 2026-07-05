# How machinable compares

machinable overlaps with several tool families without belonging to any of them:
workflow engines, experiment trackers, config frameworks, and data-versioning tools.
This page maps the differences, including the cases where another tool is the
better choice. The lens throughout is machinable's core commitment: running code and
retrieving its results are the same operation, keyed by
[content-addressed identity](/guide/identity).

| Family | Examples | Optimizes for | machinable instead |
| --- | --- | --- | --- |
| Workflow engines | redun, Snakemake, Nextflow, WDL/CWL | executing a task DAG efficiently and portably | no DAG engine; a pipeline is Python calling `get(...).launch()` |
| Experiment trackers | MLflow, W&B, Sacred, Aim | logging metrics and browsing runs in a UI | no metrics schema; a measurement is a method, a comparison is an [inference](/guide/inference) |
| Config frameworks | Hydra | composing configuration and launching jobs | typed `Config` whose canonical form *is* the run's identity |
| Data versioning | DVC | content-addressing data files in git | content-addresses the configuration; data lives in self-describing record directories |

## Workflow engines

Snakemake, Nextflow, WDL, and CWL organize computation as a DAG of tasks or rules,
usually keyed on files, where you declare inputs and outputs and the engine
schedules what is out of date, often across containers and clusters. They are excellent at their question,
which is "run this graph efficiently and portably".

machinable asks a different question: "give me the result of this configuration, running
it only if it doesn't exist yet". There is no scheduler and no DAG description. A sweep
is a Python loop; a dependency is one interface [using](/guide/relations) another; order
of execution is the order of your code. Incrementality comes from identity rather than
from file timestamps or graph analysis, so re-running a loop skips every
configuration that already has a record, whatever produced it and in whatever order.

The two are complementary rather than competing. An interface's `__call__` can invoke a
Snakemake or Nextflow pipeline as its computation, and machinable's
[executions](/guide/execution) can hand runs to the same clusters
([Slurm](/integrations/slurm), [MPI](/integrations/mpi)). If your problem
is ten thousand containerized tasks with complex fan-in, use a workflow engine; if your
problem is keeping track of what you ran, with which configuration, and what it
produced, that is what machinable is for.

### Snakemake

[Snakemake](https://snakemake.readthedocs.io/en/stable/) is the archetype of the
file-keyed family and deserves its own comparison. A workflow is a set of rules
declaring input and output files; wildcards expand a rule across samples or parameters;
the engine derives the DAG from the filenames and re-runs a rule when its outputs are
missing or stale (newer releases also consider changed params, code, or software
environment). Per-rule shell commands make it language-agnostic, and conda/container
integration makes the graph portable. Three differences matter in practice:

- **What is addressed.** In Snakemake, a parameter that matters must surface in a file
  path (`results/{sample}/lr{lr}/model.pt`), because files are what the DAG is keyed
  on. machinable inverts this, making the canonical configuration the identity from
  which the record directory follows, so nothing needs encoding into filenames and
  adding a parameter never restructures your results tree.
- **What triggers recomputation.** Snakemake recomputes on staleness, whenever outputs
  are missing or older than inputs. machinable recomputes only what has never run;
  an existing record is valid until you invalidate it explicitly (`cached(False)`),
  which suits research loops where inputs rarely change but configurations multiply.
- **Unit of reuse.** A Snakemake rule produces files, and downstream analysis starts
  from those paths. A machinable interface is a configured object that outlives the
  run, so analyses, plots, and [inferences](/guide/inference) are methods you call
  against the stored results rather than scripts pointed at a directory layout.

As with the other engines, the relationship is complementary. An interface's
`__call__` can invoke a Snakemake workflow as its computation, with machinable
recording which configurations of that workflow ran, while Snakemake handles the
file-level fan-out inside each run.

### redun

[redun](https://insitro.github.io/redun/design.html) is the closest relative and worth
a direct comparison (GRAIL's Reflow explored the same memoize-on-digest idea earlier,
for cloud data processing). Both redun and machinable are Python-native, both memoize
on content, and both record provenance. The interesting differences are in what "content" means:

- **Identity.** A redun task's cache key hashes the function's *code* together with its
  arguments; edit the function and prior results are invalidated. A machinable
  interface's identity is its module name plus the
  [canonical form of its configuration](/design/identity), deliberately excluding code.
  Code state is captured as [provenance](/guide/provenance) (a `Manifest` records the
  commit and any uncommitted changes per run), but changing code does not silently
  invalidate results; you decide when a result is stale and clear it explicitly
  (`cached(False)`). During research, code changes constantly in ways that don't affect
  results (refactors, plotting, comments), and machinable's position is that the
  researcher, not a hash, knows which changes matter.
- **Unit of reuse.** redun's unit is the function call, where results are values
  in a call graph. machinable's unit is a configured object that outlives the
  run, so you reload it and call its methods (analyses, [quantities](/guide/inference), plots) against the
  stored results.
- **Where truth lives.** redun records its call graph in a backend database.
  machinable's record directories are [self-describing](/design/storage); the SQLite
  index is a rebuildable cache, so a results folder can be moved, copied, or handed to a
  collaborator and re-indexed as-is.

## Experiment trackers

MLflow, Weights & Biases, Sacred, and Aim are write-oriented, in that you
instrument your code with `log_metric`/`log_param` calls, and browse the accumulated runs in a dashboard. Two
structural differences:

- **No metrics schema.** machinable deliberately has no `log_metric`. A run saves
  whatever files it wants; a measurement is a plain method that reads them back; a
  comparison ("is A better than B?") is an [inference](/guide/inference) whose verdict
  is itself a reproducible, cached run. The place you'd eyeball a dashboard, machinable
  gives you a statistical answer with provenance.
- **Retrieval, not just logging.** Trackers append a new run every time and identify
  runs by generated ids. machinable is content-addressed, so asking for a configuration
  that already ran returns the existing record, which is what makes sweeps incremental
  and results reachable from code (`get(...)`, `.all()`, search) rather than from a UI.

The families compose: a tracker can serve as a mirror through the
[Storage](/guide/storage) interface (see the
[integrations library](/integrations/) for examples), giving you a browsing UI on top
of machinable's records.

## Config frameworks

Hydra (built, like machinable, on omegaconf) composes YAML configuration groups and
launches jobs, writing outputs to timestamped directories. machinable's
[configuration](/guide/configuration) is a typed pydantic model in code, with experiment
axes as [version methods](/guide/versions) rather than YAML files. The deeper difference
is what configuration is *for*: in Hydra it parameterizes a launch; in machinable the
canonical config is the run's identity, which is what enables deduplication, reloading,
and search. Hydra answers "compose and launch this config"; machinable also answers
"have I run this before, and what did it produce?".

## Data versioning

DVC content-addresses data files and pipeline stages alongside git. machinable
content-addresses the *configuration* instead, so results live in
[record directories](/design/format) whose identity is independent of their location,
git versions the code, and the per-run `Manifest` ties the two together. For versioning
large raw datasets themselves, DVC (or any blob store) remains the right tool; a
machinable interface typically references such data by a stable content id via a
[predicate](/guide/advanced-configuration#non-identifying-fields-machinable-field) rather than owning it.

## When machinable is not the tool

- You need to schedule large, containerized, language-heterogeneous DAGs: use a workflow
  engine.
- Your team primarily wants a hosted dashboard and alerting on live training curves: an
  experiment tracker does that out of the box.
- Your code is not Python: machinable's [writing side is Python-only by
  design](/design/format#conformance-classes) (reading a store is language-portable).

The reasoning behind these boundaries is in the
[design notes](/design/philosophy): machinable supplies only what is genuinely
cross-cutting (identity, dedup, storage, search) and stays out of everything a
researcher would rather express as code.
