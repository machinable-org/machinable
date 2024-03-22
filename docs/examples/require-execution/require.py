from machinable import Execution


class Require(Execution):
    class Config:
        prevent_commit: bool = True

    def add(
        self,
        executable,
    ):
        if not self.config.prevent_commit:
            return super().add(executable)

        if isinstance(executable, (list, tuple)):
            for _executable in executable:
                self.add(_executable)
            return self

        if not executable.cached():
            raise RuntimeError(
                f"Execution required for {executable.module} <{executable.id}>"
            )

        return super().add(executable)

    def on_before_dispatch(self):
        raise RuntimeError(
            "Execution is required:\n- "
            + "\n- ".join(
                self.pending_executables.map(lambda x: x.module + " <" + x.id + ">")
            )
        )
