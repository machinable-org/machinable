"""examples://aggregate: an interface that lays out a sweep *in code*.

The aggregate is an ephemeral coordinator: its `launch()` grids over the experiment
(seeds × the configured arm), and it is never materialized itself. Content-addressing
and scopes make re-launching incremental. Operands for an inference are
`get('optimizers', ['~sgd'])` and `get('optimizers', ['~adam'])`.

Use an aggregate when the sweep is a *procedure*: it has its own `Config` (recorded,
and part of the operand's identity), an order, dependent runs, or it needs prior
results. A flat fan-out over inputs or seeds is simpler as an axis
(examples://axis), which is also nameable on the CLI and in the MCP.
"""

from pydantic import BaseModel

from machinable import Interface, get


class Optimizers(Interface):
    class Config(BaseModel):
        seeds: int = 10

    def launch(self):
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()  # dedup'd per (config, seed)

    # the experiment axis, named: each operand is one token
    def version_sgd(self):
        return {"lr": 0.1}

    def version_adam(self):
        return {"lr": 1e-3}

    # a <quantity>() the inference will map across this aggregate's runs
    def loss(self):
        return self.load_file("loss.json")["final"]
