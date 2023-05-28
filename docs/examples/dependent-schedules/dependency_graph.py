from machinable import Schedule
from machinable.collection import ComponentCollection


class DependencyGraph(Schedule):
    def __call__(self, executables: ComponentCollection) -> ComponentCollection:
        schedule = ComponentCollection()
        done = set()

        def _resolve_dependencies(_executables):
            for e in reversed(_executables):
                if e.uses:
                    _resolve_dependencies(e.uses)

                if e.cached():
                    done.add(e.uuid)
                    continue

                if e.uuid not in done:
                    schedule.append(e)
                    done.add(e.uuid)

        # depth-first search
        _resolve_dependencies(executables)

        return schedule
