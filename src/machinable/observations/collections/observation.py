from .collection import Collection


class ObservationCollection(Collection):

    def as_dataframe(self):
        """Returns collection as Pandas dataframe
        """
        data = {k: [] for k in self._items[0].serialize().keys()}
        for observation in self._items:
            for k, v in observation.serialize().items():
                data[k].append(v)
        import pandas
        return pandas.DataFrame.from_dict(data)
