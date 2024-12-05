from machinable import Component, Element, Execution, Index, Project, get


class Trace(Execution):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trace = []

    def on_verify_schedule(self):
        return True

    def __call__(self):
        executables = self.pending_executables
        if self.schedule is not None:
            executables = self.schedule(executables)

        for executable in executables:
            self.dispatch(executable)
            self.trace.append(executable)

    @property
    def name_trace(self):
        return list(map(lambda x: x.__class__.__name__, self.trace))


def test_dependency_graph(tmp_path):
    class A(Component):
        pass

    class B(Component):
        pass

    class C(Component):
        pass

    class D(Component):
        pass

    class E(Component):
        pass

    with Index(str(tmp_path)):
        with Project("docs/examples/dependent-schedules"):
            with Trace(schedule=get("dependency_graph")) as execution:
                #
                #       A
                #      / \
                #     B   C
                #      \ / \
                #       D   E

                a = get(A).launch()
                b = get(B, uses=[a]).launch()
                c = get(C, uses=[a]).launch()
                d = get(D, uses=[b, c]).launch()
                e = get(E, uses=[c]).launch()

            assert execution.name_trace == ["A", "C", "E", "B", "D"]

            with Trace(schedule=get("dependency_graph")) as execution:
                a2 = Element.make(A).launch()
                b = get(B, uses=[a]).launch()
                c = get(C, uses=[a]).launch()
                d2 = Element.make(D, uses=[b, c]).launch()
                e = get(E, uses=[c]).launch()
            assert execution.name_trace == ["D", "A"]
