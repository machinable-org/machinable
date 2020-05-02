import machinable as ml


def test_core_execute_decorator():
    @ml.execute
    def run(node, components, store):
        assert node.config.alpha == 0
        store.log.info("Custom training with learning_rate=" + str(node.config.a))
        assert components[0].config.alpha == 0

    t = ml.Experiment().components("thenode", "thechildren")
    run(t, seed=1, project="./test_project")
