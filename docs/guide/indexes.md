# Indexes

Indexes allow you to build a database to keep track of your experiments. 

::: tip
To take advantage of a fast, SQL-based index, make sure you install the `dataset` package.
:::

## Creating an index

```python
from machinable import Index

index = Index()

# searches recursively and adds all experiments in the given location to the index
index.add_from_storage('~/results') 
```

## Querying

```python
index.find("r5zSco")
>>> Storage: Experiment <r5zSco>
```