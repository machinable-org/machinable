from machinable import Project


class TestProject(Project):
    def config_global_conf(self, works=False):
        return works

    def version_global_ver(self, works=False):
        return works

    def on_resolve_element(self, module):
        if module == "@test":
            return "basic", None

        return module, None

    def get_host_info(self):
        info = super().get_host_info()
        info["dummy"] = "data"
        return info
