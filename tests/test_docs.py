from machinable import Project


def test_docs_snippets():
    with Project.instance("docs/snippets/estimate_pi"):
        import docs.snippets.estimate_pi.compute_pi
