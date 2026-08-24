#!/bin/bash
set -e

mkdir -p /etc/munge /var/log/munge /var/lib/munge /run/munge
dd if=/dev/urandom bs=1 count=1024 of=/etc/munge/munge.key 2>/dev/null
chown -R munge:munge /etc/munge /var/log/munge /var/lib/munge /run/munge
chmod 400 /etc/munge/munge.key
setpriv --reuid=munge --regid=munge --clear-groups /usr/sbin/munged

mkdir -p /var/spool/slurmctld /var/spool/slurmd /run/sshd
slurmctld
slurmd

mkdir -p /root/.ssh && chmod 700 /root/.ssh
if [ -n "$SSH_PUBKEY" ]; then
  echo "$SSH_PUBKEY" > /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
fi
ssh-keygen -A
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitUserEnvironment.*/PermitUserEnvironment yes/' /etc/ssh/sshd_config

{
  echo "PATH=/opt/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
  echo "PYTHONPATH=${MACHINABLE_SRC:-/machinable/src}"
} > /root/.ssh/environment

for _ in $(seq 1 60); do
  [ "$(sinfo -h -o %T 2>/dev/null)" = "idle" ] && break
  sleep 0.5
done

exec /usr/sbin/sshd -D -e
