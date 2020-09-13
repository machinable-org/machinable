---
annotations: {
    module_mapping: [
        {
          x: 53, 
          y: 42, 
          width: 130,
          height: 25, 
          value: "
          The keyname describes the Python module import path, i.e. path/to_module.py
          "
        },
        {
          x: 53, 
          y: 65, 
          width: 150,
          height: 67, 
          value: "
          The configuration that will become available to the components
          "
        },
        {
          x: 53, 
          y: 132, 
          width: 135,
          height: 25, 
          value: "
          If the target is a module directory, machinable will use path/directory/__init__.py instead
          "
        },
        {
          x: 53, 
          y: 175, 
          width: 135,
          height: 25, 
          value: "
          You can choose any name or directory structure as long as you specify the import path of the source code module, e.g. models/baseline.py
          "
        }
    ],
    module_groups: [
        {
          x: 20, 
          y: 43, 
          width: 200,
          height: 25, 
          value: "
          Write 'components:module' to group components in this section
          "
        },
        {
          x: 45, 
          y: 65, 
          width: 120,
          height: 25, 
          value: "
          Equivalent to 'experiments.optimization'. The corresponding components will be placed in experiments/optimization.py
          "
        }
    ],
}
---


# machinable.yaml

Let's take a closer look at the features of machinable's central configuration file `machinable.yaml` which lives at the project directory root:

    my-machinable-project
    ├── ...
    └── machinable.yaml

## Module mapping

The components section lists the project's components and their configuration using the following convention: the name determines the python module that contains the components's code, for example:

<Annotated name="module_mapping" :debug="false">
```yaml
components:
  - path.to_module:
      config_value: 1
      nested:
        value: 2
  - path.directory:
      config_value: 3
  - models.baseline:
      learning_rate: 0.1
```
</Annotated>

You can group components into modules by appending the directory name to the components key:

<Annotated name="module_groups" :debug="false">
```yaml
# machinable.yaml
components:experiments:
  - optimization:
      data: sinus
components:models:
  - linear_regression:
  - gradient_descent:
      learning_rate: 0.01
```
</Annotated>

The module mapping allows machinable to load and execute code automatically. 

## Config inheritance

The module-to-config mapping also enables configuration sharing through inheritance. Consider the following example:

```yaml
components:
  - base_component:
      config_value: 1
      nested:
        value: 2
  - extended_component^base_component:
      nested:
        value: overwritten
      new_value: 3
```

Here, the extended components 'inherits' the ``base_component``'s configuration using the `^` syntax. The resulting configuration that becomes available to the ``extended_component`` would have the following structure :

```yaml
config_value: 1             # inherited
nested:
   value: overwritten       # inherited but overwritten
new_value: 3                # new value
```

Config inheritance can be useful in preventing unnecessary configuration repetitions and allows matching class inheritance structures in the components implementation.

## Aliases

In larger projects, module paths can become long or convoluted. To simplify the discription, you can define simpler aliases using the `=` syntax:

```yaml
components:
  - base_component=base:
      config_value: 1
  - extended_component^base:
      new_value: 3
```

## Config references

The `machinable.yaml` supports config references that are written using the `$` symbol. In particular, `$.{path}` refers to values from the config root while `$self.{path}`
refers to values of the local components. Consider the following example:

```yaml
dataset: mnist
components:
  - data: $.dataset
  - model:
      learning_rate: $self._parameter[$.dataset].learning_rate
      _parameter:
        mnist:
          learning_rate: 0.1
        fashion-mnist: $self._parameter[mnist]  
        cifar10:
          learning_rate: 0.01
```

At runtime, the above configuration will be parsed as:

```yaml
dataset: mnist
components:
  - data: mnist
components:models:
  - models:
      learning_rate: 0.1
      _parameter:
        mnist:
          learning_rate: 0.1
        fashion-mnist:
          learning_rate: 0.1
        cifar10:
          learning_rate: 0.01
```

Note that you can use the Python convention of a leading underscore (`_example`) as a weak "internal use" indicator. machinable will hide configuration values that start with an underscore (`_`) in execution outputs.

::: tip
To implement dynamic configuration dependencies, consider using [config methods](./components.md#config-methods).
:::

## Versions

Components often induce a number of different versions. For example, a model might have a version with momentum and a version without momentum. To manage the configuration of different versions it can be impractical to create multiple components that inherit the configuration from some base components. Instead, we can define configuration patterns inline. To define a version, specify the configuration difference under a key that starts with `~`.

```yaml
components:
  - sgd:
      learning_rate: 0.001
      data:
        name: cifar10
        augmentation: False
      ~mnist:
        data:
          name: mnist
      ~alexnet:
        learning_rate: 0.1
        data:
          name: imagenet
```
At runtime, this will result in the following patterns
```yaml
# ~mnist:
learning_rate: 0.001
data:
  name: mnist
  augmentation: False

# ~alexnet:
learning_rate: 0.1
data:
  name: imagenet
  augmentation: False

```
You can choose which version is going to be used in the experiment. Learn more about how to execute different versions in the [experiment section](./experiments.md).

## Using subfiles

As the machinable.yaml grows, it can be useful to split the file into smaller subfiles. It is possible to include YAML configuration and JSON files relative to the `machinable.yaml` using the `$/` syntax:

```yaml
# machinable.yaml
components:
  - test.example: $/example/included.yaml

# example/included.yaml
learning_rate: 1
alpha: 0.5

# ... will be parsed as

components:
  - test.example:
      learning_rate: 1
      alpha: 0.5

```