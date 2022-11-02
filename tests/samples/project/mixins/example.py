from machinable import Element, mixin


class Example(Element):
    class Config:
        a: str = "world"

    @mixin
    def test(self):
        return "mixins.extension"

    def say(self) -> str:
        return self.test.hello()

    def say_bound(self):
        return self.bound_hello()

    def calling_into_the_void(self) -> str:
        return "success"
