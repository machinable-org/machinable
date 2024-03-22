# Globus storage

Integration for [Globus Compute](https://www.globus.org/).

## Usage example

```python
from machinable import get

storage = get("globus", {"client_id": ..., ...}).__enter__()

# run some experiment
component = ...

# upload to globus
storage.upload(component) 

# search for component in globus using hash 
matches = storage.search_for(experiment)
print(matches)

# download from globus
storage.download(matches[0].uuid)
```

## Source

::: code-group

<<< @/examples/globus-storage/globus.py

:::
