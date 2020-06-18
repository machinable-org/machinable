# Overview

Machine learning projects tend to comprise three different phases: development, execution, and result analysis. *machinable* is build around three corresponding concepts: components, experiments, and storage.

The concept section will discuss these fundamentals in more detail. For now, let's focus on the file structure of the project. To create a machinable project, it's sufficient to create a folder or repository that contains a `machinable.yaml`:

    my-example-project
    ├── ...
    └── machinable.yaml

Think of it as a README that provides basic definitions of the project's
components and their respective default hyperparameters.

```yaml
# machinable.yaml
components:
  - optimization:
      data: sinus
components:models:
  - linear_regression:
  - gradient_descent:
      learning_rate: 0.01
```

From the example definition above you can guess that the project compares linear regression with gradient descent on some optimization problem. The file exposes all crucial parameters like the models's learning rate. The definition also implicitly describes the file organisation of the source code:


    my-example-project
    ├── optimization.py
    ├── models
    │   ├── linear_regression.py
    │   └── gradient_descent.py
    └── machinable.yaml

While the directory structure and file names may differ from project to project, the `machinable.yaml` acts as global entry point and enables a number of powerful features.


