<div align="center">
  <img src="https://raw.githubusercontent.com/machinable-org/machinable/master/docs/logo/logo.png">
</div>

# machinable

<a href="https://travis-ci.org/machinable-org/machinable">
<img src="https://travis-ci.org/machinable-org/machinable.svg?branch=master" alt="Build Status">
</a>
<a href="https://opensource.org/licenses/MIT">
<img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</a>
<a href="https://github.com/psf/black">
<img alt="Code style: black" src="https://img.shields.io/badge/code%20style-black-000000.svg">
</a>

<br />
<br />

**machinable** is a modular configuration system for machine learning research. Using straight-forward conventions and a powerful configuration engine, it can help structuring your projects in a principled way to move quickly while enabling reuse and collaboration.

[Explore key features at a glance →](https://machinable.org/guide/at-glance.html)

*Ready to start?*

    $ pip install machinable

## Features

**Powerful configuration**

- YAML-based project-wide configuration files with expressive syntax
- Efficient configuration manipulation
- Modular code organisation to allow for encapsulation and re-use
- Import system to use 3rd party configuration and code without overhead
- 'Mixins' for horizontal inheritance structure

**Efficient execution**

- Works with existing code
- Support for seamless cloud execution
- Automatic code backups
- Managed randomness and reproducibility
- Advanced hyperparameter tuning using [Ray Tune](https://github.com/ray-project/ray)

**Effective result collection and analysis**

- Logging, tabular record writer and storage API
- File system abstraction (in-memory, AWS S3, and more)
- Flat-file result database with convenient query syntax

### Documentation

Read the [user guide ](https://machinable.org/guide) to get started.
