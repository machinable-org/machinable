# Installation

machinable is available via [pip](https://pypi.org/project/machinable/). Install the current release

```bash
$ pip install machinable
```

::: info
machinable currently supports Python 3.9 and higher
:::

Note that machinable requires the sqlite json1 extension, otherwise, you will likely see the error message:
`sqlite3.OperationalError: no such function: json_extract`. In this case, an easy way to obtain a suitable sqlite version is to install the pysqlite package: 


```bash
$ pip install pysqlite3-binary
```


