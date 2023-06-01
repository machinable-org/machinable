# Globus storage

Integration for [Globus Compute](https://www.globus.org/).

## Usage example

```python
from machinable import get

get("globus", {"client_id": ..., ...}).__enter__()

# your code
```

## Source

::: code-group

<<< @/examples/globus-storage/globus.py

:::
