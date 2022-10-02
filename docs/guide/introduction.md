# Introduction

## What is machinable?

*machinable* is a Python framework for research code. It provides an object-oriented skeleton that helps you efficiently develop and experiment in a unified interface while handling tedious house-keeping behind the scenes.

Here is a minimal example:

*montecarlo\.py*

<<< @/snippets/estimate_pi/montecarlo.py


*compute_pi\.py*

<<< @/snippets/estimate_pi/compute_pi.py

Output:

> After 150 samples, PI is approximately 3.1466666666666665.
> 
> Experiment \<chocolate_mosquito> (finished just now) is 
>
> stored at \<./storage/2022_40_Sun/is51xA>

<br />

The above example demonstrates the two core principles of *machinable* code:

- **Enforced modularity**: The Monte Carlo algorithm is encapsulated in its own module that can be instantiated with different configuation settings
- **Unified representation** Running experiments is handled through the same interface that is used to retrieve their results. In fact, re-running the script will not re-run the Monte-Carlo simulation but only reprint the results. 

You may already have questions - don't worry. We will cover the details in the rest of the documentation. For now, please read along so you can have a high-level understanding of what machinable offers.


## Features

machinable is a framework and ecosystem that covers features commonly needed in scientific code. But research is extremely diverse so machinable is primarly designed to be flexible and extensible via composition and inheritance. In any case, you can count on the following features:

- Managed randomness and reproducibility via reliable configuration managment 
- Incrementable adoptable and dependency and environment agnostic
- Works well with CLI and Jupyter for interactive computation
- Seamless local and remote execution
- Result and storage managment


## Installation

Ready to get started? Type

```bash
$ pip install machinable
```


## Where to go from here

Feel free to pick a learning path that suits your preference

- **Try the Tutorial**: For those who prefer learning things hands-on. (coming soon!)
- [Read the Guide](quick-start.md): The guide walks you through every aspect of the framework in full detail
- **Check out the Examples**: Explore examples of core features and common patterns (coming soon!)


