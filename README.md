<div align="center">
  <img width="120" src="https://raw.githubusercontent.com/machinable-org/machinable/main/docs/logo/logo.png" alt="machinable">

# machinable

[![Build status](https://github.com/machinable-org/machinable/workflows/build/badge.svg)](https://github.com/machinable-org/machinable/actions?query=workflow%3Abuild)
[![License](https://img.shields.io/github/license/machinable-org/machinable)](https://github.com/machinable-org/machinable/blob/main/LICENSE)

</div>

**machinable** is a content-addressed system for research code. You write an
experiment once; running it, reloading its results, and asking questions of
them are the same gesture. A run's identity is its module and configuration,
so identical runs deduplicate, sweeps are incremental, and results stay
reachable from code with no run names or paths to track.

```python
from machinable import get

get("train", {"lr": 0.1}).launch()   # runs it ...
get("train", {"lr": 0.1}).loss()    # ... or reads it back
```

## Installation

```bash
pip install machinable
```

## Documentation

Visit [machinable.org](https://machinable.org/) to get started.
