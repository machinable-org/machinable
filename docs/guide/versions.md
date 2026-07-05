# Versions

A **version** is how you dial in a configuration without spelling out every field.
Instead of a 40-key dict, you name an experiment with reusable `~versions`. machinable's
[CLI](./cli.md), [API](./server.md), and [MCP](/mcp/overview) all speak versions, and so
should your code.

A version is a list of `~versions` and override dicts, applied left to right:

```python
get("train", ["~bert", "~large", {"batch_size": 256}])
```

## Version methods → `~versions`

Define an experiment axis as a `version_<name>` method that returns a config patch. It
is invoked as `~name`:

```python
class Train(Interface):
    class Config(BaseModel):
        optimizer: str = "sgd"
        lr: float = 0.1

    def version_sgd(self):              # ~sgd
        return {"optimizer": "sgd", "lr": 0.1}

    def version_adam(self, lr=1e-3):    # ~adam   or   ~adam(lr=3e-4)
        return {"optimizer": "adam", "lr": lr}
```

```python
get("train", ["~sgd"])                  # optimizer=sgd, lr=0.1
get("train", ["~adam"])                 # optimizer=adam, lr=1e-3
get("train", ["~adam(lr=3e-4)"])        # adam arm, lr overridden
get("train", ["~adam", {"lr": 5e-4}])   # same, via an override dict
```

Version methods can take arguments (`~adam(lr=3e-4)`) and can be stacked
(`["~bert", "~large"]`). Patches are deep-merged in order, so later `~versions` and override
dicts win key-by-key. Override dicts accept
[dotted paths](./configuration.md#dotted-paths) for nested fields:
`{"optimizer.lr": 3e-4}` is `{"optimizer": {"lr": 3e-4}}`.

`~versions` keep a grid legible, since a comparison reads `~sgd` vs `~adam` instead of two
parameter blobs, both in your loops and when a human reviews an agent's work. (See
[Design notes → Philosophy](/design/philosophy#legibility).)

```python
for opt in ["~sgd", "~adam"]:
    get("train", [opt]).launch()
```

## Versions are UX, not identity

Two versions that evaluate to the same configuration share one identity. `["~large"]`
and the dict it expands to are the same run; `~adam` and
`{optimizer: "adam", lr: 1e-3}` are the same run. The version layer is how you *asked*
for a config; identity tracks the config you got. You can rename or restructure your
version vocabulary without orphaning past results. See
[Identity & dedup](./identity.md).

## Inspecting a version

```python
run = get("train", ["~adam", {"lr": 3e-4}])
run.version()      # the compact version list, the way you asked for it
run.config         # the fully resolved configuration
run.to_cli()       # "train ~adam lr=0.0003", runnable on the CLI
```

`version_*` signatures and docstrings are reflected by the [API](./server.md)
(`get_module`) and [MCP](/mcp/overview), so tools can present your version vocabulary to
an agent before it composes a run.
