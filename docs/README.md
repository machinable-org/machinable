---
home: true
heroImage: /hero.png
actionText: Get Started →
actionLink: /guide/
footer: MIT Licensed
annotations: {
    machinable_yaml: [
        {
          x: 205, 
          y: 85, 
          width: 215,
          height: 25, 
          value: "
          Complex configuration values can be implemented as standard Python methods and directly called in-place.
          "
        },
        {
          x: 158, 
          y: 153, 
          width: 100,
          height: 25, 
          value: "
          A referencing syntax enables value reuse without repetition.
          "
        },
        {
          x: 83, 
          y: 198, 
          width: 200,
          height: 90, 
          value: "
          Versioning allows for the specification of complex configuration patterns that can be swapped in and out efficiently.
          "
        },
        {
          x: 170, 
          y: 287, 
          width: 125,
          height: 25, 
          value: "
          Use inheritance to extend existing configuration without duplication.
          "
        },
        {
          x: 100, 
          y: 332, 
          width: 340,
          height: 25, 
          value: "
          Document important parameters inline using comments.
          "
        },
        {
          x: 69, 
          y: 400, 
          width: 158,
          height: 25, 
          value: "
          Import 3rd-party configuration directly into the project and adapt it to your needs
          "
        }
    ],
    experiment: [
        {
          x: 217, 
          y: 42, 
          width: 330,
          height: 25, 
          value: "
          Adjust configuration dynamically
          "
        },
        {
          x: 455, 
          y: 64, 
          width: 80,
          height: 25, 
          value: "
          Declare independent trials within a single execution
          "
        },
        {
          x: 125, 
          y: 155, 
          width: 176,
          height: 25, 
          value: "
          Save results to local and remote locations, or use temporary storage during development
          "
        },
        {
          x: 53, 
          y: 175, 
          width: 110,
          height: 25, 
          value: "
          Leverage hassle-free local or remote execution and implement your own 
          "
        }
    ]
}
---

<Annotated name="machinable_yaml" :debug="false">
```yaml
deviation: 0.5
components:
    - baseline_model:
        learning_rate: base_learning_rate(2**-7)
        distribution:
          name: normal
          sigma: $.deviation
          mu: 0
        ~heavytailed:
          distribution:
            name: lognormal
            sigma: 1.0
    - biased_model^baseline_model:
        distribution:
          # overwrite mean to introduces some bias
          mu: -0.5
        control_variate: True
    - +.kaggle.sota_model:
        control_variate: True
```
</Annotated>

<Annotated name="experiment" :debug="false">
```python
experiment = Experiment().component('biased_model', 
                        [('~heavytailed', {'learning_rate': lr}) 
                        for lr in (0.25, 0.1, 0.5)]).repeat(3)

execute(
    experiment, 
    storage='s3://bucket/results', 
    engine='ray'
)
```
</Annotated>
