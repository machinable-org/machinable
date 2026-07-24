# Discovering modules

Discovery answers "what interfaces does this project offer, and how are they configured?" which supports editor autocompletion, the [API](./server.md) module catalog, and any tool that needs the project's vocabulary before anything runs.

It is static using Python's `ast` parser and never imports to be fast and safe. When static analysis cannot resolve a construct, the module is still listed, marked `partial`. See the [design note](/design/discovery) for why it works this way.

## From Python

`Project` exposes discovery as a first-class API, resolved through the provider like the other project hooks:

```python
from machinable import Project

with Project():
    for module in Project.get().provider().modules():
        print(module.module, module.kind, module.resolved)

    schema = Project.get().provider().module_schema("optimize")
    print([f.name for f in schema.config_fields])   # config field names
    print(schema.versions)                          # the ~version vocabulary
    print([m.name for m in schema.config_methods])  # config_<name> methods
```

`modules()` returns lightweight `ModuleInfo` records (`module`, `kind`, `doc`, `widget`, `source_file`, `source_line`, `resolved`). `module_schema(module)` returns a `ModuleSchemaInfo` with the statically reflected `config_fields` (nested and `list[...]` models recursed into), the `version_methods` / `config_methods` vocabularies, and a widget descriptor when the class ships one.

## From the CLI

```bash
machinable modules                 # list discoverable interfaces (module · kind · flags)
machinable modules --project DIR   # a project other than the working directory
```

Modules that could not be fully resolved statically are flagged `(partial)`; interfaces that ship a [widget](./widgets.md) are flagged `[widget]`.

## Shell autocompletion

`machinable get` can complete module names, config overrides, and `~versions` on Tab. Install the completion script once:

```bash
machinable completion bash >> ~/.bashrc      # or: zsh >> ~/.zshrc
```

(For zsh, make sure `autoload -Uz compinit && compinit` runs earlier in your `~/.zshrc`.)

Then, from a project directory:

```bash
machinable get <Tab>                 # -> module names
machinable get optimize <Tab>        # -> that module's config keys (key=) and ~versions
machinable get optimize optimizer.<Tab>   # -> nested config keys (optimizer.lr=, …)
machinable get optimize ~<Tab>       # -> just the ~version vocabulary
```

Once a module is named, completion switches from module names to that module's own vocabulary, i.e. its [config](./configuration.md) fields as `key=` overrides (dotted into
nested models), and its `~versions`. Container-typed fields (a `list`/`dict`) are offered whole, since a CLI override can't address inside them by dotted path.

Under the hood the script calls `machinable complete`; you can invoke it directly if you wire up a different shell:

```bash
machinable complete -- optimize "~"   # candidates for the partial final word
```

## Custom discovery schemes

Discovery is itself an [interface kind](./interface.md). The base `Discovery` walks local
source honoring `.gitignore`. A project declares which schemes to use from its provider.

```python
class Project(machinable.Project):
    def on_resolve_discovery(self):
        # local first, then any extra schemes; composed first-wins
        return ["machinable.discovery", "machinable.discovery:RemoteDiscovery", "my.scheme"]
```

Two override seams sit at different grains. Subclass `excluded()` to swap only the ignore scheme (a Mercurial user reads `.hgignore`), or `discover()` for a wholly different source. Because a scheme is a real interface, its `Config` tunes it without subclassing e.g. extra ignore patterns:

```python
def on_resolve_discovery(self):
    return [("machinable.discovery", {"patterns": ["*.scratch.py"]})]
```

Schemes run in the declared order over a shared analysis, and the first to claim a module name keeps it so your own code always shadows a remote of the same name. Remote schemes report modules under their declared name (never their `interface/remotes/` path) and stay `partial` until fetched with [`machinable fetch`](./cli.md#other-commands).
