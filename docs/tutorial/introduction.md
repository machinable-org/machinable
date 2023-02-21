# Introduction

## What is machinable?

_machinable_ is a Python API for research code. It provides an object-oriented skeleton that helps you efficiently develop and experiment in a unified interface while handling tedious housekeeping behind the scenes.

The key idea is to unify the running of code and the retrieval of produced results in one abstraction. A detailed discussion of this approach can be found in the [about section](../about/approach.md), but for now, here is a minimal example that illustrates the idea.

_montecarlo\.py_

<<< @/snippets/estimate_pi/montecarlo.py

_compute_pi\.py_ (the main script that may live in a notebook or is launched from the CLI)

<<< @/snippets/estimate_pi/compute_pi.py

Output:

> After 150 samples, PI is approximately 3.1466666666666665.
>
> Experiment \<chocolate_mosquito> (finished just now) is 
>
> stored at \<./storage/2022_40_Sun/is51xA>

<br />

The above example demonstrates the two core principles of _machinable_ code:

- **Enforced modularity** The Monte Carlo algorithm is encapsulated in its own module that can be instantiated with different configuration settings.
- **Unified representation** Running experiments is handled through the same interface that is used to retrieve their results. Specifically, there is no separate script to display the results of the computation. Running `compute_pi.py` for a second time reloads and displays the results without re-running the simulation.

You may already have questions - don't worry. We will cover the details in the rest of the documentation. For now, please read along so you can have a high-level understanding of what machinable offers.

## What it is not

Research is extremely diverse so machinable primarily aims to be an **API-spec** that leaves concrete feature implementation to the user. It does not compete with other frameworks that may provide similar functionality but embraces the integration of other tools within the API. Notably, the machinable ecosystem already provides wrappers and integrations of a variety of tools and it is easy for users to maintain their own. 

## Where to go from here

If you are interested in learning more, continue with the guide that will quickly introduce the bare minimum of concepts necessary to start using machinable. Along the way, we will provide pointers to sections of the tutorial that discuss concepts in more detail or cover more advanced functionality.

After covering the essentials, feel free to pick a learning path that suits your preference - although we do recommend going over all of the content at some point, of course!

:::tip Installation

We recommend [installing machinable](./installation.md) to try things out while following along.

:::

::: info :student: &nbsp; [Continue with the Tutorial](./essentials/project-structure.md)

Designed for beginners to learn the essential things hands-on.

:::

::: info :open_book: &nbsp; [Read the Reference](../reference/index.md)

The guide describes every aspect of the framework and available APIs in full detail.

:::

::: info :arrow_right: &nbsp; [Check out the How-to guides](../examples/overview.md)

Explore real-world examples that demonstrate advanced concepts

:::