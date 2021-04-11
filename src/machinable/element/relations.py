def belongs_to(f):
    @property
    def _wrapper(self):
        related_class = f(self)
        name = f.__name__
        if self.__related__.get(name, None) is None and self.mounted():
            related = self.__model__._storage[name].retrive_related(
                self.__model__, name
            )
            self.__related__[name] = related_class.from_model(related)

        return self.__related__[name]

    return _wrapper


has_one = belongs_to


def has_many(f):
    @property
    def _wrapper(self):
        related_class, collection = f(self)
        name = f.__name__
        if self.__related__.get(name, None) is None and self.mounted():
            related = self.__model__._storage[name].retrieve_related(
                self.__model__, name
            )
            self.__related__[name] = collection(
                [related_class.from_model(r) for r in related]
            )

        return self.__related__[name]

    return _wrapper
