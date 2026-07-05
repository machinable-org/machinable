# Agents & MCP

machinable ships an [MCP](https://modelcontextprotocol.io/) server that lets an AI
coding agent drive research with you: author interfaces, run experiments, and ask
scientific questions. It stays true to machinable's code-all-the-way-down approach
rather than bolting on an experiment-tracking schema.

The premise: because experiments, measurements, and even statistical questions are
[ordinary interface code](/guide/inference), an agent that can read and write that code
can run the whole research loop, and machinable's contracts tell it what to write next.

## The loop

> **Is SGD faster than Adam on this problem?**

1. **Frame** the question as a comparison of operands by a measurable quantity.
2. **Scaffold** an [aggregate interface](/guide/advanced-execution#aggregates-and-deferred-collection)
   that sweeps the experiment. The agent writes it with `write_source`, and machinable
   returns any import error so it can self-correct.
3. **Launch** it. Runs are content-addressed, so this is incremental.
4. **Ask** an [inference](/guide/inference) (`outperforms`, `converges_faster`, ...).
   If an operand doesn't expose the needed `<quantity>()`, the inference returns a
   `NotImplementedError` naming the accessor to write. The agent writes it and re-runs,
   now a cached no-op for unchanged operands.
5. **Surface** the verdict as a [widget](/guide/widgets) for you to validate.

Every step is content-addressed, searchable, and reproducible, with no tracking layer.

## What the server provides

- **Tools**: authoring (`get_module`, `resolve_config`, `write_source` with import-error
  surfacing, `search_interfaces`, `launch`), inference (`outperforms`,
  `beats_baseline`, `ranks`, `converges_faster`, `infer`, `quantity`), and widget
  verification (`read_widget_result`).
- **Resources**: the context the agent writes against, attached without tool calls:
  `guide://authoring`, `inferences://catalog`, `examples://{name}`, `module://{module}`,
  `widget-sdk://docs`.
- **Prompts**: canned workflows (`investigate`, `scaffold-aggregate`, `add-inference`,
  `scaffold-widget`).

## Read on

- [Setup](./setup.md): install and launch the server, connect a client.
- [The research workflow](./workflow.md): the `investigate` loop in detail.
- [Authoring for agents](./authoring.md): the tools, resources, and prompts.
- [Reference inferences](./reference-inferences.md): the inferences that ship with it.

Why inferences instead of a metrics schema is covered in
[Design notes → Inference design](/design/inference).
