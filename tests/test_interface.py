from machinable import Interface, get


def test_interface():
    class Example(Interface):
        def __call__(self):
            print("hello world")

    get(Example).launch()
