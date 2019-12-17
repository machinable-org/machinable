from .collection import Collection


class RecordsCollection(Collection):

    def as_dataframe(self):
        """Returns collection as Pandas dataframe
        """
        import pandas
        data = {
            k: [row[k] for row in self._items] for k in self._items[0].keys()
        } if len(self._items) > 0 else {}
        return pandas.DataFrame.from_dict(data)
