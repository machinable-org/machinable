def element_test(element):
    assert isinstance(str(element), str)
    assert isinstance(repr(element), str)
    element.unserialize(element.serialize())
