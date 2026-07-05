# Integrations

Community-maintained interfaces that projects pull in by URL via
`on_resolve_remotes`: execution backends, storage adapters, and reusable
components. Browse them at
[machinable.org/integrations](https://machinable.org/integrations/).

## Use at your own risk

Integrations are **not part of machinable core**. They are not covered by the
core test suite, type checking, or release process, and they come with no
maintenance guarantee. Each integration lists a `maintainer` in its
`integration.yaml`; that person or org is the contact for issues, and an
integration whose maintainer is unresponsive after breakage is marked
`status: archived` rather than fixed by the core team.

## Layout

Each integration is one directory:

```
integrations/<name>/
  integration.yaml   # metadata (required, see schema below)
  <name>.py          # a single module containing the interface
  README.md          # usage notes, rendered on the docs page
  test_<name>.py     # the integration's own tests
```

The module must be a single file because consumers fetch it by raw URL, so it cannot
have sibling imports. Runtime dependencies beyond machinable are declared in
`requires` and imported inside the module.

`integration.yaml` fields:

| Field            | Meaning                                                        |
| ---------------- | -------------------------------------------------------------- |
| `name`           | The directory/module name (unique, snake_case)                 |
| `summary`        | One line shown on the card                                     |
| `tags`           | Free-form classification (at least one); tags shared by more than one integration become filters in the docs UI |
| `maintainer`     | Who is responsible for this integration                        |
| `maintainer_url` | Optional link for the maintainer (GitHub, GitLab, homepage, …) |
| `upstream`       | URL of the integrated system                                   |
| `requires`       | pip packages needed at runtime (may be empty)                  |
| `status`         | `active` or `archived`                                         |

## Contributing

Open a pull request that adds **one directory** following the layout above.
The bar is deliberately low:

- `integration.yaml` validates (CI checks this automatically).
- The module contains a single importable `Interface` subclass.
- At least one test exists (it may `importorskip` heavy dependencies).
- No dangerous code: nothing that exfiltrates data, touches credentials,
  obfuscates its behavior, or executes remote content. Review is a safety and
  metadata check only while correctness stays with the maintainer.

**Names are first-come-first-served.** Pick a unique, descriptive name: a
second MPI integration is `mpi_srun` or `openmpi`, never a duplicate `mpi`.
The name matters beyond the directory because the docs teach it as the module name,
and the module name enters the content-addressed identity of every record it
produces, so distinct implementations must not share one.

Contributions are licensed under the repository's MIT license. To hand off or
drop maintainership, open a PR changing the `maintainer` field (or setting
`status: archived`).
