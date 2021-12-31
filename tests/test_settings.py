import json

import pytest
from machinable.errors import ConfigurationError
from machinable.settings import get_settings


def test_get_settings(tmp_path):
    assert get_settings().default_experiment is None
    file = str(tmp_path / "test.json")
    with open(file, "w") as f:
        json.dump({"default_experiment": "test"}, f)
    assert get_settings(file).default_experiment == "test"
    with open(file, "w") as f:
        f.write("invalid")
    with pytest.raises(ConfigurationError):
        get_settings(file)
