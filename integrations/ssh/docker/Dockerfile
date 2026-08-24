FROM debian:trixie-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        slurm-wlm slurm-client munge \
        openssh-server rsync \
        python3 python3-venv \
        ca-certificates procps \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir \
        "flatten-dict>=0.5,<1" "pydantic>=1,<3" "arrow>=1.4.0" \
        "omegaconf==2.4.0.dev12" "dill>=0.4.1" "cloudpickle>=3" "pathspec>=0.12"

COPY slurm.conf /etc/slurm/slurm.conf
COPY cgroup.conf /etc/slurm/cgroup.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 22
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
