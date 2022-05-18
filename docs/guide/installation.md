# Installation

::: tip
machinable requires Python 3.7 or higher and does not support Python 2.
:::

Install the latest stable version via [pip](http://www.pip-installer.org/):

```bash
pip install machinable
```

## For development

To test or develop new features you may want to install the latest package version from the repository.

Clone the source from the [public code repository](https://github.com/machinable-org/machinable) on GitHub and change into the machinable directory.

Install the development dependencies using [poetry](https://python-poetry.org/):

```bash
poetry install -D
```

To build the [Vuepress](https://vuepress.vuejs.org)-based documentation run:

```bash
npm install
npm run docs:dev
```

If you plan to contribute please read the [contribution guide](../miscellaneous/contribution-guide.md)
