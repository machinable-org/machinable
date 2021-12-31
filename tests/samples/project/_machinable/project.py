from machinable import Project


class TestProject(Project):
    def config_global_conf(self, works=False):
        return works

    def host_information(self) -> dict:
        return {"custom_info": True, "host_info_return": "test"}

    @staticmethod
    def host_test_info_static():
        return "static_test_info"

    def host_test_info(self):
        return "test_info"

    def default_resources(self, engine, component, components):
        from machinable.engine import Slurm

        if isinstance(engine, Slurm):
            return {"used_engine": "Slurm"}

    def on_before_component_import(self, module, baseclass, default):
        if module.endswith("uses_default_module"):
            return DefaultFallback
