# Authoring for agents

The MCP exposes machinable as curated, task-shaped tools (not one per endpoint),
readable resources (the spec the agent writes against), and prompts (canned workflows).
The leverage is in the resources, since a handful of good, current-API examples makes
first-try code correct.

## Tools

**Authoring**

| Tool | Purpose |
| --- | --- |
| `list_modules` | the project's interface modules (module, kind, doc, is-widget) |
| `get_module(module)` | resolved schema: config fields + the `~version` vocabulary (signatures + docs) |
| `resolve_config(target, version)` | dry-run a compact version → resolved config + CLI, no materialize |
| `read_source` / `write_source` / `move_source` / `delete_source` | edit project files; `write_source` re-imports and returns any import/syntax error |
| `search_interfaces(module, filters)` | find runs by config |
| `create_interface` / `launch` / `run_status` | materialize / run / poll |
| `call(interface, method, …)` | invoke any method (the generic compute hook) |
| `provenance(uuid, depth, rels)` | the node-link provenance graph: recipe (config/context/derivation) plus history (executions and the code manifest each used) |

**Inference**

| Tool | Purpose |
| --- | --- |
| `outperforms` / `differs` / `beats_baseline` / `ranks` / `converges_faster` | the scientific vocabulary → a verdict |
| `infer(inference, operands, options)` | run any catalog inference by name |
| `quantity(operand, name)` | probe an accessor: its value(s), or the contract naming what to write |

**Widget**: `read_widget_result`, `list_widgets`.

## Resources

- **`guide://authoring`**: the one page that makes generated code correct. Config is
  always a pydantic `BaseModel`; encode axes as `version_*` methods (`~versions`); expose
  one run's measurement as a `<quantity>()`; the identity affordances
  (`Field(identifying=False)`, `predicate_from_manifest`).
- **`inferences://catalog`**: the available inferences, each with the atomic shape it
  requires (`scalar`/`series`) and the test it runs.
- **`examples://{name}`**: small, runnable, idiomatic templates: `interface`, `config`,
  `execution`, `aggregate`, `inference`, `widget`, and the end-to-end `investigate`.
- **`module://{module}`**: *this* project's resolved schema. **`widget-sdk://docs`**:
  the widget contract.

## Prompts

| Prompt | Emits |
| --- | --- |
| `investigate(hypothesis)` | the full [research loop](./workflow.md) |
| `scaffold-aggregate(name, axis)` | an aggregate skeleton (grid `launch()` + a quantity stub) |
| `add-inference(name, requires)` | a new `Inference` subclass skeleton |
| `scaffold-widget(name, description)` | a `Widget` + `render` skeleton |
| `new-interface(name)` | a generic interface scaffold |

## Teaching, in the order an agent hits it

1. `guide://authoring`: the mental model, with each contract as a short example.
2. `examples://investigate`: one coherent end-to-end project.
3. Single-concept `examples://{…}` for the contract being written.
4. The project's own `get_module`/`source`, since it is its own teaching material.
5. Runtime contracts (the `NotImplementedError`, import errors on `write_source`,
   schema reflection) correct the agent in context.

The examples and `guide://authoring` live in `src/machinable/mcp/teaching/`.
