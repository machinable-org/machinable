# Sharing and importing projects

One advantage of machinable's configuration structure is that it implicitly enforces modularity. When you build a machinable project, components will always be contained in a dedicated python module that is specified in the `machinable.yaml`. The corresponding configuration values will be modularized in a similar way in the components list. The structure not only helps to keep your code base organized, but also allows for easy sharing and re-use of machinable projects.

To share a machinable project, just share the project code repository containing the `machinable.yaml`. To import an existing project, clone a project's repository into the `vendor` directory in your project:

    my-machinable-project
    ├── vendor
    │   └── imported_project/
    │       ├── ...
    │       └── machinable.yaml
    └── machinable.yaml

and register it in your `machinable.yaml` under the `+` key:

```yaml
+:
 - imported_project:
components:
 - ...
```

That's it. You can now use and extend the imported components as if they were part of your project:

<<< @/.vuepress/includes/machinable_yaml/machinable_imports.yaml

In this example, the `+.` syntax is being used to use a baseline model in the imported project. In the corresponding module, you can also re-use the original implementation via standard python inheritance:

``` python
from vendor.imported_project.models.resnet import ResnetModel

class MyImprovedModel(ResnetModel):

    # overwrite and extend some functionality
```

Importing provides you with another level of modularity and makes it easy to maintain dependencies. It also provides an easy way of sharing baseline or benchmark models. To share logic like data pipelines etc., consider using [mixins](./mixins.md) as well.

Rather than re-downloading dependencies manually for every project, you can overwrite how dependency should be resolved in the `~/.machinablerc`:

    [imports]
    imported_project = /opt/imported_project
    base = /opt/collaborative/base
    distributed = /opt/collaborative/distributed
    img = /opt/collaborative/img
    rl = /opt/collaborative/rl

In this example, machinable will automatically symlink `/opt/imported_project` etc. into `vendor/` whenever a project declares the dependency (e.g. `imported_project`).
