# The CLI

The `machinable` command mirrors the Python API: name a module, optionally a
[version](./versions.md) and config overrides, and call methods.

```bash
machinable get <module> [~version …] [key=value …] [--method …]
```

## Resolving and launching

```bash
machinable get optimize lr=0.5 --launch          # resolve + run __call__
machinable get optimize lr=0.5 --launch --loss   # then call .loss() and print it
machinable get train ~adam lr=3e-4 --launch       # versions and overrides
```

- `key=value` sets a config override (dotted paths nest: `optimizer.lr=0.1`).
- `~version` applies a [version method](./versions.md) (`~adam`, `~large`).
- `--<method>` calls a method on the resolved interface; a returned value is printed.
  `--launch` runs the interface. Arguments follow the same convention as
  [`~versions`](./versions.md): `--summary(top=3)` calls `summary(top=3)` (quote the
  token if your shell parses parentheses).
- `.<path>` is shorthand for `interface.<path>`: `machinable get .example` is
  `machinable get interface.example`.

## Chaining contexts

List several modules; all but the last are opened as contexts wrapping the final one,
the CLI equivalent of nested `with` blocks (e.g. an [execution](./execution.md) or a
[scope](/guide/identity#predicates-and-scopes)):

```bash
machinable get multiprocess processes=4 train ~sgd --launch
#               └── context ──────────┘ └── target ──┘
```

## Choosing where results live

By default results go to `./storage`. Point machinable at a specific storage location
by opening `machinable.storage` as a context:

```bash
PYTHONPATH=.:$PYTHONPATH machinable get machinable.storage directory=$STORAGE <interfaces…>
```

A handy alias for your `.bashrc`:

```bash
function ma { PYTHONPATH=.:$PYTHONPATH machinable get machinable.storage directory=$STORAGE "$@"; }
# then:  ma optimize lr=0.5 --launch
```

## Other commands

```bash
machinable version          # print the installed version
machinable fetch            # download declared remotes without importing them
machinable mcp --project .  # launch the research MCP server (see Agents & MCP)
machinable help get         # usage
```

`machinable fetch` supports [inspecting remote code](./storage.md#remotes-shareable-interfaces)
before it ever executes.

The `machinable mcp` server is documented in [Agents & MCP → Setup](/mcp/setup).
