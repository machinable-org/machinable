from machinable.config.loader import from_file


def test_from_file():
    data = from_file('test_project/machinable.yaml')

    # outsourcing $/
    assert data['outsource']['hello'] == 'success'

    # correct scientific notation parsing
    assert data['scientific'] == 5e-6


