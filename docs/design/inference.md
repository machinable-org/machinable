# Inference design

How to write and use an [inference](/guide/inference) is in the guide. This note records
why the inference subsystem is shaped the way it is.

## Inferences, not a metrics schema

The question that started it: how should a code agent and a researcher collaborate on a
research question ("is SGD faster than Adam?") without bolting an experiment-tracking
schema onto machinable?

The tempting answer is a generic `compare(query, metric, group_by)` plus a `log_metric`
convention. We rejected it because it forces a metrics schema, which means foreseeing what a
measurement is. Instead, the MCP offers a vocabulary of scientific inferences, the
questions a researcher actually asks (`outperforms`, `beats_baseline`, `ranks`,
`converges_faster`), and pushes everything else down into code. There is no
`Interface.evidence` method, no fixed metric enum, and no core resolution logic.

## The contract is owned by the inference; the numbers by the operand

An inference declares the shape of evidence it needs (`scalar` or `series`) and resolves
it by calling the operand, not by reading a fixed file. The operand satisfies the
contract with a plain `<quantity>()` accessor returning one run's measurement. The
inference composes that across the operand's runs into the sample its test needs.

This split is the whole design: the operand supplies the numbers, the inference supplies
the test (bringing its own scipy), and machinable supplies neither, only identity,
dedup, storage, and search. A statistical choice is an implementation, shareable like
any interface; machinable ships no statistics.

## The `NotImplementedError` is the engine

When you ask for a quantity an operand doesn't expose, `resolve` raises a
`NotImplementedError` that names the accessor to write. This is not an error to handle;
it is the teaching signal. It turns "the agent must guess what to implement" into "the
contract tells the agent what to write next", which is what makes the
[agent loop](/mcp/workflow) reliable. The same instinct runs through the MCP: import
errors on `write_source` and schema reflection correct the agent in context.

## Identity = method × operands

An `Inference` is an `Interface`, parallel to `Slurm(Execution)`, where the subclass is the
question, the `Config` is the method, and the operands are subjects (via `.of(...)`,
not config). The subtlety is that operands must enter the predicate, by config identity
rather than uuid. If the method were config-only and operands lived in a relation, the
same method applied to A and to B would share one identity and collapse to a single
cached verdict. Operands are typically ephemeral aggregates that are never materialized
(so they have no uuid); their `catalog_identity_key` is stable and computable without
materialization. Net identity is method × operand-identities, so re-asking the same
question dedups; different operands or a different method are distinct verdicts.

## Staleness is explicit, not detected

A verdict caches on `(method, operands)`. If an operand's results change while its
config doesn't, the cached verdict can go stale, and machinable does not try to detect
this. During research, things change constantly and the researcher knows when a result
is invalidated; the remedy is the same `cached(False)` + re-run that invalidates any
cached interface. We deliberately do not hash operand result-state into the predicate.
