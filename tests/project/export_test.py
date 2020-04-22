import machinable as ml
from machinable.project.export import export_experiment


def test_project_export(helpers):
    path = helpers.tmp_directory("export")
    export_experiment(
        experiment=ml.Experiment().components("nodes.observations", "export_model"),
        path=path + "/test",
        project="./test_project",
    )
