from machinable.index.native_index import NativeIndex


def test_native_index(tmp_path):
    index = NativeIndex()
    assert index.find("tttttt") is None
    index.add(tmp_path / "storage/tttttt")
    assert index.find("tttttt").submission_id == "tttttt"
    assert len(index.find_all()) > 0
