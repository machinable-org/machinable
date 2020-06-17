# Command-line Interface

## Usage

```bash
machinable <command> [options]
```

## -v, --version

Prints the machinable version number

## execute

```bash
machinable execute [OPTIONS] EXPERIMENT
```

Executes an EXPERIMENT

### Options

- `--storage TEXT`  Storage for this execution.
- `--engine TEXT`   Engine used during execution
- `--project TEXT`  Project directory
- `--seed TEXT`     Seed used in this execution


## server

::: warning
This feature is currently under development
:::

Launches a server

## vendor

### fetch

Fetch dependencies of the current project