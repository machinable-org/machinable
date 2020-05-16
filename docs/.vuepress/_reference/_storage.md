# Storage

The storage abstraction provides a high-level interface to retrieve data that is being stored during execution.

{% machinable.Storage %}

{% machinable.storage.experiment.ExperimentStorage %}

{% machinable.storage.component.ComponentStorage %}

{% machinable.storage.collections.Collection %}

<--

## Legacy: Observations

Deprecated v1 APIs

{% machinable.v1.Observations %}

{% machinable.v1.observations.views.observation.Observation %}

{% machinable.v1.observations.observations.ObservationsQueryBuilder %}

{% machinable.v1.observations.views.records.Records::{'include': ['refresh', 'info', 'query', 'find_all', 'find', 'find_many', 'as_dataframe']} %}

{% machinable.v1.observations.views.records.RecordsQueryBuilder %}

{% machinable.v1.observations.views.task.Task %}

-->