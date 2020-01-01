import machinable as ml
import numpy as np

random_search = ml.Task().component('optimization')\
                         .tune(stop={'episodes_total': 50},
                               num_samples=50,
                               config={
                                "stepsize": lambda spec: np.random.uniform(1e-6, 0.1),
                                "noise_std": lambda spec: np.random.uniform(1e-6, 0.1),
                                "l2coeff": lambda spec: np.random.uniform(1e-6, 0.1)
                                })

grid_search = ml.Task().component('optimization')\
                       .tune(stop={'accurary': 80},
                             num_samples=100,
                             config={
                                "learning_rate": {"grid_search": [0.1, 0.05, 0.01]}
                             })
