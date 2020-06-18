# Hyperparameter tuning

While Experiments allow for simple configuration iteration, complex hyperparameter tuning is supported through [Ray tune](https://ray.readthedocs.io/en/latest/tune.html) using the `tune()` method of the Experiment object:

```python
import numpy as np

import machinable as ml

random_search = (
    ml.Experiment()
    .component("optimization")
    .tune(
        stop={"episodes_total": 50},
        num_samples=50,
        config={
            "stepsize": lambda spec: np.random.uniform(1e-6, 0.1),
            "noise_std": lambda spec: np.random.uniform(1e-6, 0.1),
            "l2coeff": lambda spec: np.random.uniform(1e-6, 0.1),
        },
    )
)

grid_search = (
    ml.Experiment()
    .component("optimization")
    .tune(
        stop={"accurary": 80},
        num_samples=100,
        config={"learning_rate": {"grid_search": [0.1, 0.05, 0.01]}},
    )
)

```

Please refer to [Ray's project documentation](https://ray.readthedocs.io/en/latest/tune.html) to learn more about available options.
