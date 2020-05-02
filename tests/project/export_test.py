import machinable as ml


def test_project_export(helpers):
    path = helpers.tmp_directory("export")
    ml.Execution(
        experiment=ml.Experiment().components("nodes.observations", "export_model"),
        project="./test_project",
    ).export(path=path + "/test",)
