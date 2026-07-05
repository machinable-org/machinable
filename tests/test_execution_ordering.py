"""Ordering dependent runs through an ordinary interface passed via ``uses=``.

The recipe from the execution guide: a ``DependencyGraph`` strategy that
topologically sorts executables by their ``uses`` relations.
"""

from machinable import Execution, Interface, get
from machinable.collection import InterfaceCollection


class DependencyGraph(Interface):
    """Orders executables so that their dependencies (``uses``) run first."""

    def __call__(self, executables: InterfaceCollection) -> InterfaceCollection:
        ordered = InterfaceCollection()
        done = set()

        def _key(interface):
            return interface.uuid if interface.uuid is not None else id(interface)

        def _resolve_dependencies(_executables):
            for e in reversed(_executables):
                if e.uses:
                    _resolve_dependencies(e.uses)
                if e.cached():
                    done.add(_key(e))
                    continue
                if _key(e) not in done:
                    ordered.append(e)
                    done.add(_key(e))

        _resolve_dependencies(executables)  # depth-first
        return ordered


class Trace(Execution):
    """An execution that orders its interfaces through an ordinary interface."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trace = []

    @property
    def scheduler(self):
        return self.uses.first()

    def dispatch(self) -> "Trace":
        # order before materializing (the base dispatch materializes first,
        # which would dedup fresh duplicates onto their cached records)
        if self._interfaces:
            self.__call__()
        return self

    def __call__(self):
        executables = self.interfaces
        if self.scheduler is not None:
            executables = self.scheduler(executables)

        for executable in executables:
            self.dispatch_interface(executable)
            self.trace.append(executable)

    @property
    def name_trace(self):
        return list(map(lambda x: x.__class__.__name__, self.trace))


def test_dependency_graph(tmp_storage):
    class A(Interface):
        pass

    class B(Interface):
        pass

    class C(Interface):
        pass

    class D(Interface):
        pass

    class E(Interface):
        pass

    with Trace(uses=get(DependencyGraph)) as execution:
        #
        #       A
        #      / \
        #     B   C
        #      \ / \
        #       D   E

        a = get(A).launch()
        b = get(B, uses=[a]).launch()
        c = get(C, uses=[a]).launch()
        get(D, uses=[b, c]).launch()
        get(E, uses=[c]).launch()

    assert execution.name_trace == ["A", "C", "E", "B", "D"]

    with Trace(uses=get(DependencyGraph)) as execution:
        Interface.make(A).launch()
        b = get(B, uses=[a]).launch()
        c = get(C, uses=[a]).launch()
        Interface.make(D, uses=[b, c]).launch()
        get(E, uses=[c]).launch()
    assert execution.name_trace == ["D", "A"]
