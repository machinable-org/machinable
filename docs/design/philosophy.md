# Philosophy

These notes record the reasoning behind machinable. The [guide](/guide/introduction)
explains how to use it; this section explains why it is built the way it is.

## The problem

Research code accumulates housekeeping. A project starts with an algorithm and ends up
maintaining configuration plumbing, a results directory convention, a way to avoid
re-running finished work, a sweep harness, a place to put metrics, and glue to read
everything back. None of that is the research, and every project reinvents it slightly
differently.

machinable's bet is that all of this housekeeping can be handled by one abstraction,
provided you accept a single discipline: **running code and retrieving its results are
the same operation**. You write your research as an [`Interface`](/guide/interface) with
a typed [`Config`](/guide/configuration), and `get(...)` means both "run this" and "give
me what this produced". Because runs are [content-addressed](/guide/identity), asking for
the same thing twice is free and sweeps are incremental.

## Code all the way down

machinable is an API, not a framework that owns your workflow. There is deliberately no
metrics schema, no `log_metric` call, and no `sweep()` DSL. A grid is a Python loop, a
measurement is a method, a statistical question is an [inference](./inference.md).
machinable supplies only what is genuinely cross-cutting: identity, deduplication,
storage, and search.

The reason is that schemas and DSLs try to anticipate what researchers will need, and
research is precisely the activity of doing something unanticipated. Every convenience
layer we considered (a metrics format, a sweep helper) constrained more than it helped;
researchers wrote the Python anyway and then fought the abstraction. The rule throughout
is to surface existing primitives rather than invent new ones.

This stance is also what makes machinable drivable by an [AI agent](/mcp/overview), because if
the workflow is code, an agent that writes code can run the experiment.

## Content-addressing as the backbone

A run is identified by its content (its module and canonical configuration), not by a
name, a path, or a timestamp. This is what lets `get` recognize prior work, makes sweeps
incremental, and makes results reproducible by construction. Much of the harder design
work ([identity](./identity.md), [storage](./storage.md)) is about getting
content-addressing right, i.e. robust to how a config is spelled, where its data lives, and
how the schema evolves.

## Extensibility is sharing, not registration

There is no plugin registry. An execution backend, a storage adapter, a statistical
inference, a widget are all are ordinary Python importable modules. A generally useful 
one is shared (pulled into a project by URL via `on_resolve_remotes`, like the `slurm` and
`globus` [integrations](/integrations/)); a one-off lives in the project as a throwaway
module. Extending machinable and using it are the same activity.

## Legibility

Finally, the system optimizes for a human or an agent being able to understand a result.
Compact [`~versions`](/guide/versions) name experiments the same way in the CLI,
the API, and the MCP; verdicts carry their provenance; any result can be rendered as a
[widget](/guide/widgets). An experiment you cannot read is one you cannot trust.
