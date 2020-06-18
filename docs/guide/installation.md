# Installation

::: tip
machinable requires Python 3.6 or higher and does not support Python 2.
:::

Install the latest stable version via [pip](http://www.pip-installer.org/):

```bash
pip install machinable
```

machinable integrates with a number of optional packages. [Ray](http://pythonhosted.org/ray/) enables seamless and efficient distributed execution. Results analysis may use [pandas](https://pypi.python.org/pypi/pandas), [numpy](https://pypi.python.org/pypi/numpy) and [tabulate](https://pypi.python.org/pypi/tabulate). To install machinable with all optional dependencies type:

```bash
pip install machinable[all]
```


## For development

To test or develop new features you may want to install the latest package version from the repository.

Clone the source from the [public code repository](https://github.com/machinable-org/machinable) on GitHub and change into the machinable directory. Install the development dependencies:

```bash
pip install -r test-requirements.txt
```
Then symlink the package into the activated Python environment:
```bash
pip install -e .
```
To build the [Vuepress](https://vuepress.vuejs.org)-based documentation run:

```bash
vuepress dev docs
```

To develop the server, use
```bash
uvicorn machinable.server:server --reload --port 5000
```

If you plan to contribute please read the [contribution guide](../miscellaneous/contribution-guide.md)
