from machinable import Mixin


class TestMixin(Mixin):

    attribute = "works"

    def is_bound(self, param):
        return "bound_to_" + self.flags.BOUND + "_" + str(param)

    def this_reference(self, param):
        return self.__mixin__.is_bound("and_referenced_" + str(param))

    def this_attribute(self):
        return self.__mixin__.attribute

    def this_static(self, param):
        return self.__mixin__.static_method(param)

    @staticmethod
    def static_method(foo):
        return foo

    @property
    def key_propery(self):
        return 1
