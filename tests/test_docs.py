from machinable import Project


def test_docs_snippets_estimate_pi(tmp_storage):
    with Project.instance("docs/snippets/estimate_pi"):
        import docs.snippets.estimate_pi.compute_pi


def test_docs_snippets_tutorial_main(tmp_storage):
    with Project.instance("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main


def test_docs_snippets_tutorial_main_unified(tmp_storage):
    with Project.instance("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main_unified
