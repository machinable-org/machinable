from machinable import Project


class TestProject(Project):
    def config_global_conf(self, works=False):
        return works

    def version_global_ver(self, works=False):
        return works

    def on_resolve_element(self, module):
        if module == "@test":
            return "basic"

        return module
