from nodes.default_fallback import DefaultFallback

from machinable.engine import Slurm
from machinable.registration import Registration


class Project(Registration):
    def config_global_conf(self, works=False):
        return works

    @staticmethod
    def host_test_info_static():
        return "static_test_info"

    def host_test_info(self):
        return "test_info"

    def default_resources(self, engine, component, components):
        if isinstance(engine, Slurm):
            return {"used_engine": "Slurm"}

    def on_before_component_import(self, module, baseclass, default):
        if module.endswith("uses_default_module"):
            return DefaultFallback
