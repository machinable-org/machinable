# Aim storage

Integration for the AI metadata tracker [AimStack](https://aimstack.io/).

## Usage example

```python
from machinable import get

get("aimstack", {"repo": "./path/to/aim-repo"}).__enter__()

# your code
```

## Source

::: code-group

<<< @/examples/aim-ui-storage/aimstack.py

:::
