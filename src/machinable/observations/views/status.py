import pendulum


class StatusTrait:

    @property
    def started(self):
        """Returns the starting time"""
        return self._model.started

    @property
    def heartbeat(self):
        """Returns the last heartbeat time"""
        return self._model.heartbeat

    @property
    def finished(self):
        """Returns the finishing time"""
        return self._model.finished

    def is_finished(self):
        """True if finishing time has been written"""
        return isinstance(self.finished, pendulum.pendulum.Pendulum)

    def is_alive(self):
        """True if last heartbeat occurred less than 30 seconds ago"""
        return self.heartbeat.substract(seconds=30) < pendulum.now()

    def is_active(self):
        """True if not finished and alive"""
        return (not self.is_finished()) and self.is_alive()
