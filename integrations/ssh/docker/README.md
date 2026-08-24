# A Slurm cluster in a container

A single-node Slurm reachable over SSH as far side of the `ssh` transport, so tests can submit to a real `sbatch` rather than a stub.

```bash
docker build -t machinable-slurm:test integrations/ssh/docker
```
