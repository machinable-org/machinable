from machinable.collection.collection import Collection


class ExecutionCollection(Collection):
    @property
    def components(self):
        if len(self._items) == 0:
            return SubmissionComponentCollection()
        components = self._items[0].components
        if len(self._items) == 1:
            return components
        for experiment in self._items[1:]:
            components.merge(experiment.components)
        return SubmissionComponentCollection(
            components.unique(lambda x: x.component_id)
        )

    def status(self, status="started"):
        """Filters the collection by a status attribute

        # Arguments
        status: String, status field: 'started', 'finished', 'alive'
        """
        try:
            return self.filter(lambda item: getattr(item, "is_" + status)())
        except AttributeError:
            raise ValueError(f"Invalid status field: {status}")

    def as_dataframe(self):
        """Returns collection as Pandas dataframe"""
        data = {k: [] for k in self._items[0].serialize().keys()}
        for item in self._items:
            for k, v in item.serialize().items():
                data[k].append(v)
        import pandas

        return pandas.DataFrame.from_dict(data)
