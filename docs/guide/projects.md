# Project structure

*machinable* projects are build around two corresponding concepts: The `Component` that contains code that you would like to execute; and the `machinable.yaml` configuration file that specifies the default configuration associated with the component.

The following sections will discuss these fundamentals in more detail. For now, let's focus on the file structure of the project. To create a machinable project, it's sufficient to create a folder or repository that contains a `machinable.yaml`:

    my-example-project
    ├── ...
    └── machinable.yaml

Think of it as a README that provides basic definitions of the project's
components and their respective default configuration.

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

From the example definition above you can guess that this project implements a linear regression and some gradient based approach to solve some optimization problem. The file exposes all crucial parameters like the dataset or a model's learning rate. The definition also implicitly describes the file organisation of the component source code:


    my-example-project
    ├── optimization.py
    ├── models
    │   ├── linear_regression.py
    │   └── gradient_descent.py
    └── machinable.yaml

While the directory structure and file names may differ from project to project, the `machinable.yaml` acts as global entry point to any machinable project. In particular, it makes it easy inspect all relevant hyperparameters and the code organisation in one place.


