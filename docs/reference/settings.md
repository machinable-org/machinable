# Settings

You can set system-specific settings by creating a `~/.machinable/settings.yaml` to override some or all of the default settings given below.

```yaml
cache:
  imports: False
imports: {}
tmp_directory: userdata://machinable:machinable/tmp
schema_validation: False
default_storage:
   url: mem://
default_engine:
default_index:
```