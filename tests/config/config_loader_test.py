import os
from unittest.mock import patch

from machinable.config.loader import from_callable, from_file


@patch.dict(
    os.environ, {"envvarkey": "ENVVARTESTKEY", "envvarvalue": "ENVVARTESTVALUE"}
)
def test_config_loader_from_file():
    data = from_file("./test_project/machinable.yaml")

    # envvar resolving
    assert data["ENVVARTESTKEY"] == "ENVVARTESTVALUE"

    # outsourcing $/
    assert data["outsource"]["hello"] == "success"

    # correct scientific notation parsing
    assert data["scientific"] == 5e-6


def test_config_loader_from_callable():
    def test_callable():
        """Normal doc string No machinable config here"""
        pass

    def test_machinable_callable():
        """Normal doc string
        # machinable.yaml
        a: 1
        nested:
          level: 2
        """
        pass

    assert from_callable(test_callable) is None

    config = from_callable(test_machinable_callable)
    assert config["a"] == 1
    assert config["nested"]["level"] == 2
