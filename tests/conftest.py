import pytest
import os
import shutil


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
