from machinable.collection.collection import Collection


class ExperimentCollection(Collection):
    def __str__(self):
        if len(self.items) > 15:
            items = ", ".join([repr(item) for item in self.items[:5]])
            items += " ... "
            items += ", ".join([repr(item) for item in self.items[-5:]])
        else:
            items = ", ".join([repr(item) for item in self.items])
        return f"Experiments ({len(self.items)}) <{items}>"
