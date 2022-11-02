from machinable import Mixin


class Extension(Mixin):
    def hello(self) -> str:
        return self.there(self.config.a)

    def there(self, a) -> str:
        return "hello, " + a

    def bound_hello(self) -> str:
        return self.calling_into_the_void()

    def calling_into_the_void(self) -> str:
        return "no response"
