Asserts that components have been computed instead of running them, which is useful to fail
fast when a pipeline stage expects cached inputs.

## Usage

```python
from machinable import get

with get("require"):
    ...  # components to check
```
