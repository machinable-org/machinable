from machinable import Project, Storage


def test_docs_snippets_estimate_pi(tmp_path):
    with Project.instance("docs/snippets/estimate_pi"):
        with Storage.filesystem(str(tmp_path)):
            import docs.snippets.estimate_pi.compute_pi


def test_docs_snippets_tutorial_main(tmp_path):
    with Project.instance("docs/snippets/tutorial"):
        with Storage.filesystem(str(tmp_path)):
            import docs.snippets.tutorial.main


def test_docs_snippets_tutorial_main_unified(tmp_path):
    with Project.instance("docs/snippets/tutorial"):
        with Storage.filesystem(str(tmp_path)):
            import docs.snippets.tutorial.main_unified
