# Introduction

## What is machinable?

_machinable_ is a Python API for research code. It provides an object-oriented skeleton that helps you develop and experiment in a unified interface while handling tedious housekeeping behind the scenes.

The key idea is to unify the running of code and the retrieval of produced results in one abstraction. A detailed discussion of this approach can be found in the [about section](../about/approach.md), but for now, here is a minimal example that illustrates the idea.

1. Write some code

::: code-group

```python [montecarlo.py]
from dataclasses import dataclass
from random import random

from machinable import Component


class EstimatePi(Component):
    @dataclass
    class Config:
        samples: int = 100

    def __call__(self):
        count = 0
        for _ in range(self.config.samples):
            x, y = random(), random()
            count += int((x**2 + y**2) <= 1)
        pi = 4 * count / self.config.samples

        self.save_file(
            "result.json",
            {"count": count, "pi": pi},
        )

    def summary(self):
        if self.is_finished():
            print(
                f"After {self.config.samples} samples, "
                f"PI is approximately {self.load_file('result.json')['pi']}."
            )
```

<!-- TEST

```python
from machinable import get
get("montecarlo", {"samples": 150}).launch().summary()
```

-->

:::

2. Run and inspect it using a unified abstraction

::: code-group

```python [Python]
from machinable import get

# Imports component in `montecarlo.py` with samples=150;
# if an component with this configuration exists, it
# is automatically reloaded.
experiment = get("montecarlo", {"samples": 150})

# Executes the component unless it's already been computed
experiment.launch()

experiment.summary()
# >>> After 150 samples, PI is approximately 3.1466666666666665.
```

```python [Jupyter]
>>> from machinable import get
>>> experiment = get("montecarlo", {"samples": 150})
>>> experiment.launch()
Component <24aee0f>
>>> experiment.summary()
After 150 samples, PI is approximately 3.1466666666666665.
>>> experiment.execution.nickname
'chocolate_mosquito'
>>> experiment.finished_at().humanize()
'finished just now'
>>> experiment.local_directory()
'./storage/24aee0fd05024400b116593d1436e9f5'
```

```bash [CLI]
$ machinable montecarlo samples=150 --launch --summary
> After 150 samples, PI is approximately 3.1466666666666665.
```

:::

The above example demonstrates the two core principles of _machinable_ code:

- **Enforced modularity** The Monte Carlo algorithm is encapsulated in its own module that can be instantiated with different configuration settings.
- **Unified representation** Running code is handled through the same interface that is used to retrieve produced results; multiple invocations simply reload and display the results without re-running the experiment.

You may already have questions - don't worry. We will cover the details in the rest of the documentation. For now, please read along so you can have a high-level understanding of what machinable offers.

## What it is not

Research is extremely diverse so machinable primarily aims to be an **API-spec** that leaves concrete feature implementation to the user. Check out the [examples](../examples/) to learn what this looks like in practice.

## Where to go from here

Continue with the guide that will quickly introduce the bare minimum of concepts necessary to start using machinable. Along the way, it will provide pointers to sections that discuss concepts in more detail or cover more advanced functionality.

:::tip Installation

We recommend [installing machinable](./installation.md) to try things out while following along.

:::

::: info :student: &nbsp; [Continue with the Guide](./essentials/elements.md)

Designed to learn concepts hands-on.

:::

::: info :arrow_right: &nbsp; [Check out the How-to guides](../examples/index.md)

Explore real-world examples that demonstrate advanced concepts

:::

::: info :open_book: &nbsp; [Consult the Reference](../reference/index.md)

Describes available APIs in full detail.

:::


