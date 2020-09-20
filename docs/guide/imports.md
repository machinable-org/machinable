# Sharing and importing projects

One advantage of machinable's configuration structure is that it implicitly enforces modularity. When you build a machinable project, components will always be contained in a dedicated python module that is specified in the `machinable.yaml`. The corresponding configuration values will be modularized in a similar way in the components list. The structure not only helps to keep your code base organized, but also allows for easy sharing and re-use of machinable projects.

## Sharing a project

To share a machinable project, it's enough share the project's source code repository that contains the `machinable.yaml`. Other projects can import and use it without modification since all necessary configuration is described in the ``machinable.yaml``.

## Importing a project

::: tip
 Direct importing is one of the most powerful features of the machinable system. You can cherry-pick components of existing projects or start maintaining your own shared libraries. If you are familiar with package managers like ``npm`` or ``composer``, you can think of machinable projects as dependency packages that are ready for use without any special glue code.
:::
 
To import an existing machinable project, copy or clone it into the `vendor` directory in your project:

    my-machinable-project
    ├── vendor
    │   └── imported_project/
    │       ├── ...
    │       └── machinable.yaml
    └── machinable.yaml

Then register its name in your `machinable.yaml` under the `+` key:

```yaml
+:
 - imported_project: 
components:
 - ...
```

That's it. You can now use and extend the imported components as if they were part of your project:

```yaml
+:
  - imported_project: git+https://git.serv.er/baselines/resnet50.git
components:experiments:
  - experiments.benchmark:
      data: imagenet
components:models:
  - +.imported_project.models.resnet=baseline:
  - models.improved_resnet^+.imported_project.models.resnet=improved:
      learning_rate: 0.01
```

In this example, the `+.` syntax is being used to use a baseline model in the imported project. Generally, components of the imported projects can be accessed via ``+.{project_name}``.

Naturally, you can also re-use the original code implementation via standard python inheritance, for instance:

``` python
from vendor.imported_project.models.resnet import ResnetModel

class MyImprovedModel(ResnetModel):

    # overwrite and extend some functionality
```

Import dependencies can be used recursively, meaning the imported project may have dependecies of its own that will be resolved in turn.

Importing provides you with another level of modularity and makes it easy to maintain dependencies. It also provides an easy way of sharing baseline or benchmark models. To share logic like data pipelines etc., consider using [mixins](./mixins.md) as well.

### Global dependencies

Rather than re-downloading dependencies manually for every project, you can overwrite how dependency should be resolved in the [`~/machinable/settings.yaml`](../reference/settings.md):
```yaml
imports:
  imported_project: /opt/imported_project
```

machinable will automatically symlink `/opt/imported_project` etc. into `vendor/` whenever a project declares the dependency (e.g. `imported_project`).