# Hyperparameter tuning

While tasks allow for simple configuration iteration, complex hyperparameter tuning is supported through [Ray tune](https://ray.readthedocs.io/en/latest/tune.html) using the `tune()` method of the Experiment object:

<<< @/docs/.vuepress/includes/tasks/tune.py

Please refer to [Ray's project documentation](https://ray.readthedocs.io/en/latest/tune.html) to learn more about available options.
