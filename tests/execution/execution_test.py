import machinable as ml


def test_execution_from_storage():
    e = ml.Execution.from_storage("./_test_data/storage/tttttt")
    e.filter(lambda i, component, _: component == "4NrOUdnAs6A5")
    e.submit()


def test_execute_decorator():
    @ml.execute
    def run(node, components, store):
        assert node.config.alpha == 0
        store.log.info("Custom training with learning_rate=" + str(node.config.a))
        assert components[0].config.alpha == 0

    t = ml.Experiment().components("thenode", "thechildren")
    run(t, seed=1, project="./test_project")


def test_execution_setters():
    e = ml.Execution.from_storage("./_test_data/storage/tttttt")
    e.set_version("{ 'a': 1 }")
    e.set_checkpoint("/test")
