# Rationale and design considerations

::: warning Coming soon

This section is currently under construction

:::


::: tip Optional reading

This background discusses big-picture ideas. For a hands-on guide, refer to the [tutorial](./tutorial/essentials/project-structure.md).

:::


Consider the following experiment that estimates how monte-carlo samples are needed to approximate the circle constant PI to a certain level of accuracy. The implementation brings together the essential concepts covered thus far.

_montecarlo\.py_

<<< @/snippets/tutorial/montecarlo.py

The experiment defines a number of helper properties to keep track of the current results and then runs the monte-carlo simulation until we reach an acceptable error rate.

Using the experiment, we can write our analysis script that will give us the answer to our question of how many samples are required.

<<< @/snippets/tutorial/main_unified.py

::: details Output

> We need 2560 samples to approximate PI as 3.15 (< 0.01 error)

:::

A first thing to notice here is that to print the result, we were able to conveniently re-use the properties that the experiment implementation itself used during simulation. This is an immediate benefit of the fact that we use the experiment class to both generate as well as retrieve results. In fact, such re-use is likely since important values computed during simulation are likely quantities of interest in the analysis script.

More importantly, however, we can tweak and iteratively develop the analysis script above without re-running the underlying monte-carlo simulation.

This is because `get("montecarlo").launch()` will only execute the experiment once, and otherwise just retrieve the existing experiment from the storage.

What this gives us is a unified representation where we express how results should be displayed, and the same code happens to trigger the generation of the results if they have not been produced yet.

While you would typically write a simulation and later the plot script to display the results, in this paradigm, you can start writing the plot script and use it to launch the required simulation.


<!-- Disentangle configuration from execution -->