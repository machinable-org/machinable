from machinable.registration import Registration


class Project(Registration):
    def config_global_conf(self, works=False):
        return works

    def host_test_info(self):
        return "test_info"
