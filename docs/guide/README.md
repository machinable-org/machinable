# About

**machinable** provides a system to manage configuration of machine learning projects more effectively. Using straight-forward conventions and a powerful configuration engine, it can help structure your projects in a principled way so you can move quickly while enabling reuse and collaboration.

## Features

[Explore key features at a glance →](./at-glance.md)

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
