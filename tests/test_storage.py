# import os

# import arrow
# import pytest
# from machinable import Component, Execution, Project, Storage, errors, schema
# from machinable.storage import Storage
# from machinable.utils import random_str


# def storage_tests(storage: Storage) -> None:
#     # serialization should not affect any of the tests
#     storage = storage.clone()

#     # commit
#     pre_execution = schema.Execution()
#     components = [
#         schema.Component(
#             module="test.catch_me", predicate={"if": {"you": "can"}}
#         ),
#         schema.Component(
#             module="test.catch_me", predicate={"if": {"you": "cannot"}}
#         ),
#         schema.Component(module="another"),
#     ]
#     project = schema.Project(directory=".", name="test")
#     group = schema.Group(pattern="test/me", path="test/me")
#     elements = [schema.Component(module="test.catch_me"), schema.Execution()]

#     for component in components:
#         storage.create_component(component, group, project, elements)

#     storage.create_execution(execution=pre_execution, components=components)

#     execution = schema.Execution()
#     storage.create_execution(execution=execution, components=components)

#     execution_ = storage.retrieve_execution(execution._storage_id)
#     assert int(execution_.timestamp) == int(execution.timestamp)

#     for component in components:
#         component_ = storage.retrieve_component(component._storage_id)
#         assert component_.id == component.id

#     # relationships
#     related = storage.retrieve_related(
#         components[0]._storage_id, "component.execution"
#     )
#     assert int(related.timestamp) == int(execution.timestamp)
#     inverse = storage.retrieve_related(
#         related._storage_id, "execution.components"
#     )
#     assert all(
#         [components[i].id == inverse[i].id for i in range(len(components))]
#     )
#     assert (
#         storage.retrieve_related(component._storage_id, "component.group").path
#         == "test/me"
#     )
#     assert (
#         storage.retrieve_related("test/me", "group.components")[0].timestamp
#         == components[0].timestamp
#     )
#     assert (
#         storage.retrieve_related(components[0]._storage_id, "component.derived")
#         == []
#     )
#     assert (
#         storage.retrieve_related(
#             components[0]._storage_id, "component.ancestor"
#         )
#         is None
#     )
#     assert (
#         storage.retrieve_related(
#             components[0]._storage_id, "component.project"
#         ).name
#         == project.name
#     )

#     # search
#     assert storage.find_component(components[0].id) == components[0]._storage_id
#     assert (
#         storage.find_component(components[0].id, components[0].timestamp)
#         == components[0]._storage_id
#     )
#     assert storage.find_component("not-existing") is None
#     # search by predicate
#     assert len(storage.find_component_by_predicate("non-existing")) == 0
#     assert len(storage.find_component_by_predicate(module="test.catch_me")) == 2
#     assert (
#         storage.find_component_by_predicate(
#             module="test.catch_me", predicate={"if": {"you": "can"}}
#         )[0]
#         == components[0]._storage_id
#     )
#     assert (
#         storage.find_component_by_predicate(
#             module="test.catch_me", predicate={"if": "can"}
#         )
#         == []
#     )

#     # status managment
#     now = arrow.now()
#     assert storage.retrieve_status(components[0], "started") is None
#     storage.mark_started(components[0], now)
#     assert storage.retrieve_status(components[0], "started") == now
#     # starting event can occur multiple times
#     old_now = now
#     now = arrow.now()
#     storage.mark_started(components[0], now)
#     now = arrow.now()
#     storage.mark_started(components[0], now)
#     assert storage.retrieve_status(components[0], "started") != old_now
#     assert storage.retrieve_status(components[0], "started") == now

#     assert storage.retrieve_status(components[0], "heartbeat") is None
#     storage.update_heartbeat(components[0], now)
#     assert storage.retrieve_status(components[0], "heartbeat") == now

#     assert storage.retrieve_status(components[0], "finished") is None
#     storage.update_heartbeat(components[0], now, mark_finished=True)
#     assert storage.retrieve_status(components[0], "finished") == now

#     # local directory
#     assert storage.local_directory(components[0]).startswith("/")

#     # output
#     assert storage.retrieve_output(components[0]) is None

#     # files
#     assert storage.retrieve_file(components[0], "non-existing") is None
#     storage.create_file(components[0], "payload.json", {"test": True})
#     assert storage.retrieve_file(components[0], "payload.json") == {
#         "test": True
#     }


# def test_storage_interface(tmpdir):
#     with Project("./tests/samples/project"):
#         repository = Storage.make(
#             "machinable.storage.filesystem", {"directory": str(tmpdir)}
#         )
#         repository_b = Storage.make(
#             "machinable.storage.filesystem", {"directory": str(tmpdir)}
#         )
#         assert repository.config.directory == repository_b.config.directory

#         # serialization
#         restored = Storage.from_json(repository.as_json())
#         assert restored.__module__ == repository.__module__
#         assert restored.config.directory == str(tmpdir)

#         # deferred data
#         component = Component()
#         component.save_data("test.txt", "deferral")
#         component.save_file("test.json", "deferral")
#         assert len(component._deferred_data) == 2
#         execution = Execution().add(component)
#         repository.commit(component, execution)

#         assert os.path.isfile(component.local_directory("data/test.txt"))
#         assert os.path.isfile(component.local_directory("test.json"))
#         assert len(component._deferred_data) == 0


# def test_storage(tmpdir):
#     assert Storage.make(
#         "machinable.storage.filesystem", {"directory": str(tmpdir)}
#     ).config.directory == str(tmpdir)


# def test_filesystem_storage(tmpdir):
#     storage = Storage.make(
#         "machinable.storage.filesystem",
#         {"directory": str(tmpdir / "storage")},
#     )
#     storage_tests(storage)


# def test_multiple_storage(tmpdir):
#     storage = Storage.make(
#         "machinable.storage.multiple",
#         {
#             "primary": [
#                 "machinable.storage.filesystem",
#                 {"directory": str(tmpdir / "0")},
#             ],
#             "secondary": [],
#         },
#     )
#     storage = storage_tests(storage)

#     storage = Storage.make(
#         "machinable.storage.multiple",
#         {
#             "primary": [
#                 "machinable.storage.filesystem",
#                 {"directory": str(tmpdir / "a")},
#             ],
#             "secondary": [
#                 [
#                     "machinable.storage.filesystem",
#                     {"directory": str(tmpdir / "b")},
#                 ]
#             ],
#         },
#     )

#     storage_tests(storage)

#     # serialization
#     storage = Storage.make(
#         "machinable.storage.multiple",
#         {
#             "primary": [
#                 "machinable.storage.filesystem",
#                 {"directory": str(tmpdir / "c")},
#             ],
#             "secondary": [
#                 [
#                     "machinable.storage.filesystem",
#                     {"directory": str(tmpdir / "d")},
#                 ]
#             ],
#         },
#     )
#     storage_tests(Storage.from_json(storage.as_json()))
