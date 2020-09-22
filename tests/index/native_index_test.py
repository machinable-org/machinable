from machinable.index.native_index import NativeIndex


def test_native_index():
    index = NativeIndex()
    assert index.find("tttttt") is None
    index.add("./_test_data/storage/tttttt")
    assert index.find("tttttt").experiment_id == "tttttt"
    assert len(index.find_all()) > 0
