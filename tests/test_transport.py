import os

from machinable import Execution, Interface, Transport


class Far(Transport):
    def path(self, local):
        return "/far" + os.path.abspath(local)


def test_transport_defaults_to_the_local_passthrough():
    assert Transport.get().path("rel") == os.path.abspath("rel")
    assert Transport.get().run(["echo", "ok"]).stdout.strip() == "ok"

    with Far() as far:
        assert Transport.get() is far
        assert Transport.get().path("/a") == "/far/a"

    assert type(Transport.get()) is Transport


def test_transport_does_not_compete_with_the_execution(tmp_storage):
    class Runner(Execution):
        pass

    with Far() as far, Runner() as runner:
        assert Execution.get() is runner
        assert Transport.get() is far


def test_transport_is_identity_neutral(tmp_storage):
    plain = Interface().compute_predicate_key()
    with Far():
        assert Interface().compute_predicate_key() == plain


def test_transport_is_not_replayed_into_the_payload(tmp_storage):
    from machinable import Scope

    interface = Interface().materialize()
    with Far(), Scope({"group": "a"}):
        program = Execution().dispatch_code(interface, inline=False)

    # the ordinary contexts still travel, so the payload resolves the same way
    assert "Interface.from_directory(" in program
    assert '"kind": "Scope"' in program
    # the transport does not
    assert '"kind": "Transport"' not in program


def test_sync_is_a_no_op_without_a_transport(tmp_storage):
    interface = Interface().materialize()
    assert Transport.get().sync(interface) is True


def test_wait_returns_on_a_terminal_run(tmp_storage):

    from machinable.execution import Execution as Runner

    interface = Interface().materialize()
    run = Runner()
    run.prepare_dispatch(interface)

    pulls = []

    class Counting(Transport):
        def sync(self, record, *, status_only=False):
            pulls.append(status_only)
            return True

    transport = Counting()

    status = transport.wait(interface, interval=0.01, timeout=0.05)
    assert status.is_pending and not status.is_finished
    assert pulls and all(pulls), "a poll should fetch status, not artifacts"

    run.update_status("started")
    run.update_status("finished")
    status = transport.wait(interface, interval=10, timeout=None)
    assert status.is_finished


def test_wait_returns_on_a_run_that_died(tmp_storage):
    import arrow

    from machinable.execution import Execution as Runner

    interface = Interface().materialize()
    run = Runner()
    run.prepare_dispatch(interface)
    run.update_status("started")
    run.update_status("heartbeat", timestamp=arrow.now().shift(hours=-1))

    status = Transport().wait(interface, interval=10, timeout=None)
    assert status.is_incomplete and not status.is_finished
