# Project structure

Machine learning projects tend to comprise three different phases: development, execution, and result analysis. *machinable* is build around three corresponding concepts: components, tasks, and observations.

The concept section will discuss these fundamentals in more detail. For now, let's focus on the file structure of the project. To create a machinable project, it's sufficient to create a folder or repository that contains a `machinable.yaml`:

    my-example-project
    ├── ...
    └── machinable.yaml

Think of it as a README that provides basic definitions of the project's
components and their respective hyperparameters.

<<< @/docs/.vuepress/includes/getting_started/machinable.yaml


From the example definition above you can guess that the project compares linear regression with gradient descent on some optimization problem as it exposes crucial parameters like the models's learning rate. The file also implicitly describes the file organisation of the source code:


    my-example-project
    ├── experiments
    │   └── optimization.py
    ├── models
    │   ├── linear_regression.py
    │   └── gradient_descent.py
    ├── tasks
    │   └── example.py
    └── machinable.yaml


The different components are implemented in corresponding Python modules while the main execution scripts reside in the tasks module, for example: 

<<< @/docs/.vuepress/includes/getting_started/tasks/example.py

While the directory structure and file names may differ from project to project, the `machinable.yaml` acts as 'project glue' and enables a number of powerful features.


