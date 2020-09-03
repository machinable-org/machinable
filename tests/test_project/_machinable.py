from machinable.registration import Registration
from machinable.engine import Slurm


class Project(Registration):
    def config_global_conf(self, works=False):
        return works

    def host_test_info(self):
        return "test_info"

    def default_resources(self, engine, component, components):
        if isinstance(engine, Slurm):
            return {"used_engine": "Slurm"}
