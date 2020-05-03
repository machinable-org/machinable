import os
import shutil

import pytest


class Helpers:
    @staticmethod
    def tmp_directory(append=""):
        path = os.path.join("./_test_data/", append)
        shutil.rmtree(path, ignore_errors=True)
        os.makedirs(path)
        return path


@pytest.fixture
def helpers():
    return Helpers
