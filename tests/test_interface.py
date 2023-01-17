from machinable import Interface, Project, Storage


def test_interface(tmp_path):
    with Project("tests/samples/project"):
        # test dispatch lifecycle
        interface = Interface.make("interfaces.events_check")

        interface.__model__._storage_instance = Storage.make(
            "machinable.storage.filesystem",
            {"directory": str(tmp_path)},
        )
        interface.__model__._storage_id = str(tmp_path)

        interface.dispatch()
        assert len(interface.load_data("events.json")) == 6
