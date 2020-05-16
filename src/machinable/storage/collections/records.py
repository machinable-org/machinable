from .base import Collection


class RecordCollection(Collection):
    def as_dataframe(self):
        """Returns collection as Pandas dataframe
        """
        import pandas

        data = (
            {k: [row[k] for row in self._items] for k in self._items[0].keys()}
            if len(self._items) > 0
            else {}
        )
        return pandas.DataFrame.from_dict(data)

    def __str__(self):
        if len(self.items) > 15:
            items = ", ".join([repr(item) for item in self.items[:5]])
            items += " ... "
            items += ", ".join([repr(item) for item in self.items[-5:]])
        else:
            items = ", ".join([repr(item) for item in self.items])
        return f"Records ({len(self.items)}) <{items}>"
