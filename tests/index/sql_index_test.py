import os

from machinable.index.sql_index import SqlIndex


def test_sql_index(helpers):
    database = "sqlite:///" + os.path.join(
        helpers.tmp_directory("sql_index"), "test.sqlite"
    )
    index = SqlIndex(database)
    assert index.find("tttttt") is None
    index.add("./_test_data/storage/tttttt")
    assert index.find("tttttt").experiment_id == "tttttt"
    latest = index.find_latest()
    assert len(latest) > 0
    since = latest.first().started_at
    experiments = index.find_latest(since=since)
    assert len(experiments) == 0
    assert len(index.find_all()) > 0
