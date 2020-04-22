---
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
    tasks: [
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
          x: 136, 
          y: 88, 
          width: 176,
          height: 25, 
          value: "
          Save results hassle-free to local and remote locations, or use temporary store during development
          "
        }
    ],
    observations: [
        {
          x: 163, 
          y: 18, 
          width: 170,
          height: 25, 
          value: "
          Data store is managed and abstracted, local or in the cloud
          "
        },
        {
          x: 345, 
          y: 18, 
          width: 285,
          height: 25, 
          value: "
          Run queries against the store to find the observation data you need
          "
        },
        {
          x: 20, 
          y: 43, 
          width: 500,
          height: 50, 
          value: "
          Retrieve results using a high-level interface that works particularly well in interactive environments
          "
        }
    ]
}
---

# At a glance

*machinable* provides a structured approach to development, execution, and results analysis in machine learning projects.

**Development**

Take advantage of an expressive syntax to write out project configuration:

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

Configuration retrieval in the corresponding code is straight-forward and convenient:

```python   
if self.config.control_variate:
    return -x * self.config.learning_rate

if self.config.distribution.name == 'normal':
    return norm(x, self.config.distribution.mu, self.config.distribution.sigma)
```
So is capturing of results using tabular records, logging and store. 

```python
self.record['acc'] = 0.6
self.log.info('Training finished')
self.store.write('final_result.p', output_data)
```

<br />

**Execution**

Rapidly declare execution in a fluent interface  and take advantage of automatic parallelized execution - locally or in the cloud.

<Annotated name="tasks" :debug="false">
```python
task = Experiment().components('biased_model', 
                        [('~heavytailed', {'learning_rate': lr}) 
                        for lr in (0.25, 0.1, 0.5)]).repeat(3)
execute(task, 's3://bucket/results')
```
</Annotated>

<br />

**Results**

Effortlessly retrieve the configuration, results and execution information you need through a high-level query interface. 

<Annotated name="observations" :debug="false">
```python
o = Observations('s3://bucket/results').find_by_most_recent_task().first()
plot(y=o.records.pluck('acc'), label=o.config.learning_rate)
result = o.write('final_result.p')
```
</Annotated>

<br />

**Repeat**

Share, publish and build on what you have developed - no more 'I will clean this up later' excuses. Move faster from idea to result to publication.

[Get started →](./installation.md)