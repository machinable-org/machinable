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
