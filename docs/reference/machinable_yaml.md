# machinable.yaml

machinable's configuration file `machinable.yaml` must be placed at root of the project directory.

    my-machinable-project
    ├── ...
    └── machinable.yaml

The following describes an example structure

- Lines starting with `#` describe the keys
- `#!` describe the structure
- types are denoted in brackets `[]`

```yaml
# Name of the project
#! name: [String, must form valid Python module descriptor]
name: example_project
# Imports
#! +: [List]
+:
  #! [ String, valid Python variable name ]: [String, git/symlink/path]
  - fooba_project:
# List of all registered mixins and their configuration
#! mixins: [List]
mixins:
  #! [String, Python import path]=[String, alias name, valid Python variable]: [Dict]
  - mixins.trait=trait:
      key:
        data: True
  #! [String, Python import path]^[String, inherit from name or alias]=[alias]:[Dict]
  - extended^mixins.trait:
      key:
        extension: data
  #! +.[ String, import project ].[ String, mixin name ]=[alias]: [Dict]
  - +.fooba.test=test:
      override: True
  # Inherit from import
  #! [ String, Import path ]^+.[ String, import project]: [Dict]
  - inherit^+.fooba.experiments.start:
      extended: true
# List of all registered components and their configuration
#! components: [List]
components:
  #! Same structure as Mixin list (see above)
  - example_component:
      alpha: False
      beta: 
      # Version that overrides existing keys
      # ~[String]: [Dict]
      ~one:
        alpha: 1
      ~two:
        alpha: 2
      ~three:
        alpha: 3
        ~nested:
          alpha: 4
          beta: nested
          ~nestednested:
            beta: overwritte
      ~nested:
        alpha: 5
  - component_with_mixins:
      # List of mixins. Order determines priority of mixin inheritance
      #! _mixins_: [List]
      _mixins_:
        !# [String, mixin name or alias]
        - trait
        - test
  - configmethods:
      # Configuration methods that can be used as value anywhere
      #! [String]: [config method]
      method: hello()
      argmethod: arghello('world')
      nested:
        method: hello()
      keyarg: kwarghello(works=True)
  - flat_notation:
      # 'flattened' notation of nested structures
      flat.can.be.useful: False
      inherited.flat: value
      ~flat_version:
        flat:
          nested: False
        flat.version: 2
  - referencing:
      target: 'come find me'
      # Global referencing in the entire file
      #! $.[path.to.value]
      globally: $.random_key
      # Local referencing in current component
      #! $self.[path.to.value]
      locally: $self.target
# Component groups
#! components:[String, Python module name]: [List]
components:example_module:
  # -> example_module.example_component
  - example_component:
# Any other keys in the global scope are allowed
random_key: 5e-6
# Embedding of external files
#! $/[filepath.yaml|.json]
outsourcing: $/outsourced.yaml
# Environment variables using the default bash syntax
${envvarkey:-default}: $envvarvalue
```