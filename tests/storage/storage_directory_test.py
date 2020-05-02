def storage_directory_interface():
    _setup(debug=True)
    o = ObservationDirectory("./v1_observations/test_data/tttttt")
    assert o._uid is None
    assert o._path == "tttttt"
    assert o._url == "osfs://./v1_observations/test_data/tttttt"
    o = ObservationDirectory("./v1_observations/test_data/tttttt/tbAXUwxGJzA8")
    assert o._uid == "tbAXUwxGJzA8"
    assert o._path == "tttttt"
    assert o._url == "osfs://./v1_observations/test_data/tttttt"
    assert isinstance(o.load_file("experiment.json", meta=True), dict)
