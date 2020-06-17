import machinable as ml
from machinable.experiment.parser import parse_experiment


def seeding_test(spec):
    assert (
        len(set([e.flags["GLOBAL_SEED"] for e, _, _ in spec])) == 1
    )  # repeats share same GLOBAL_SEED
    assert len(set([e.flags["SEED"] for e, _, _ in spec])) > 1  # has unique SEED


def test_experiment_parser():
    # repeat behaviour
    t = ml.Experiment().components("test")
    assert len(list(parse_experiment(t))) == 1
    t = ml.Experiment().components("test").repeat(1)
    assert len(list(parse_experiment(t))) == 1

    t = ml.Experiment().components("test").repeat(5)
    spec = list(parse_experiment(t))
    assert len(spec) == 5
    seeding_test(spec)

    t = ml.Experiment().components(("test", "~v"), ("test", "~v")).repeat(3)
    spec = list(parse_experiment(t))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Experiment().components("test").repeat(3).split(2)
    spec = list(parse_experiment(t))
    assert len(spec) == 6
    seeding_test(spec)

    t = ml.Experiment().components(("test", [{"a": i} for i in range(3)]))
    spec = list(parse_experiment(t))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Experiment().components(("test", [{"a": i} for i in range(3)])).repeat(3)
    spec = list(parse_experiment(t))
    assert len(spec) == 9
    seeding_test(spec)

    t = ml.Experiment().components("test", ("test", [{"a": i} for i in range(3)]))
    spec = list(parse_experiment(t))
    assert len(spec) == 3
    seeding_test(spec)

    t = ml.Experiment().components(
        "test",
        [
            ("test", [{"a": i} for i in range(3)]),
            ("test", [{"a": i} for i in range(3)]),
        ],
    )
    spec = list(parse_experiment(t))
    assert len(spec) == 9
    seeding_test(spec)

    t = ml.Experiment().components("test", ("test", [{"sub": lr} for lr in range(5)]))
    spec = list(parse_experiment(t))
    assert len(spec) == 5
    seeding_test(spec)
