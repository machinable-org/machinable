# Installation

machinable is available on [PyPI](https://pypi.org/project/machinable/):

```bash
$ pip install machinable
```

::: info Python version
machinable targets modern Python (3.11+)
:::


## Optional extras

| Extra | Install | Adds |
| --- | --- | --- |
| `all` | `pip install machinable[all]` | `numpy` + `pandas`, needed for `Collection.as_dataframe()` and array analysis |
| `mcp` | `pip install machinable[mcp]` | `fastmcp` + `scipy` + `pandas` for the [Agents & MCP](/mcp/overview) server and reference inferences |

## SQLite requirement

machinable's index uses the SQLite `json1` extension. If your Python's bundled SQLite
lacks it you will see:

```
sqlite3.OperationalError: no such function: json_extract
```

The simplest fix is to install [sqlean.py](https://github.com/nalgeon/sqlean.py), which
machinable detects and uses automatically:

```bash
$ pip install sqlean.py
```

## Verify

```bash
$ machinable version
```

Then continue with the [Quickstart](./quickstart.md).
