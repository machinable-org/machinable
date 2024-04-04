from machinable import Project


class TestProject(Project):
    def config_global_conf(self, works=False):
        return works

    def version_global_ver(self, works=False):
        return works

    def on_resolve_element(self, module):
        if module == "@test":
            return "basic", None

        if module == "dummy_version_extend":
            return ["dummy", {"a": 100}], None

        return super().on_resolve_element(module)

    def get_host_info(self):
        info = super().get_host_info()
        info["dummy"] = "data"
        return info

    def on_resolve_remotes(self):
        return {
            "!hello": "file+" + self.path("hello.py"),
            "!hello-link": "link+" + self.path("hello.py"),
            "!invalid": "test",
            "!multi": ["file+" + self.path("hello.py"), "!hello-link"],
            "!multichain": ["file+" + self.path("hello.py"), "!multi"],
            "!multi-invalid": ["file+" + self.path("hello.py"), "!invalid"],
        }
