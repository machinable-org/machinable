Requires a Globus account and a configured transfer endpoint.

## Usage

```python
from machinable import get

storage = get("globus", {"client_id": ...}).__enter__()

component = ...                          # run some experiment

storage.upload(component)                # mirror to Globus
matches = storage.search_for(component)  # locate by content hash
storage.download(matches[0].uuid)        # retrieve elsewhere
```
