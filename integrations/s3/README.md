Requires [obstore](https://developmentseed.org/obstore/) and an S3 bucket (AWS S3, or an S3-compatible service such as MinIO or Cloudflare R2).

## Results in a bucket

Connect the storage and the bucket is the home of the project's records: backed up, reachable from any machine, with the local folder only a working copy that can be lost.

```python
from machinable import get

with get("s3", {"url": "s3://my-bucket/lab/machinable", "region": "us-east-1"}):
    get("my_analysis", {"session": 12}).launch()
```

Runs write a local working copy under `directory` (default `./storage`, in the same layout as the bucket under the URL's prefix). Dispatch puts the run-record in the bucket when it starts and each status marker as it is written (heartbeats at most every half liveness window), pushes the run's files when it ends, `finished_at` after them. Outside a run, writes through machinable (`save_file`, ...) go to the bucket as they are made. Delete the working copy and the next read fetches the record again.

Pull the module into a project through `on_resolve_remotes`, pinned to a commit.

| Config | Meaning |
|---|---|
| `url` | `s3://bucket/prefix` |
| `region` | the bucket's region |
| `endpoint` | an S3-compatible endpoint (`http://localhost:9000` for MinIO) |
| `directory` | local working copies (default `./storage`) |
| `catalog_max_bytes` | files up to this size are a record's catalog (default 1 MiB) |
| `credential_provider` | `module:function` returning credentials, see below |
| `conditional_writes` | `false` for a store without `If-None-Match`/`If-Match` (default `true`) |

### Credentials

In order of preference:

1. **obstore's default chain**: the environment (`AWS_ACCESS_KEY_ID`, ...), a profile, or the instance role through IMDS on a cloud machine. Nothing to configure.
2. **A credential provider** for short-lived credentials that refresh (STS credentials from a sign-in): a callable returning `{"access_key_id", "secret_access_key", "token", "expires_at"}`, which obstore calls again before `expires_at`. Pass it to the constructor, `S3(config, credential_provider=fn)`, or name it in the config as `"package.module:function"` (a process that connects the storage from its config, such as `machinable serve`, imports it from there).
3. Explicit `access_key_id`, `secret_access_key` and `session_token` in the config (avoid in code you commit).

### IAM

One user's project needs `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` on the prefix and `s3:ListBucket` on the bucket, limited to the prefix:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-bucket/lab/machinable/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-bucket",
      "Condition": {"StringLike": {"s3:prefix": ["lab/machinable", "lab/machinable/*"]}}
    }
  ]
}
```

Conditional writes need no extra permission. Large files are uploaded in parts; a lifecycle rule that aborts incomplete multipart uploads after a day keeps a crashed upload from costing storage.

## Reading on demand

A machine that did not make a record sees it through the bucket's catalog, without downloading its data:

```python
with get("s3", {"url": "s3://my-bucket/lab/machinable"}) as storage:
    ingested, position = storage.sync()      # what was added since last time
    run = get("my_analysis", {"session": 12})
    run.load_file("metrics.json")            # small files are already here
    run.local_directory("model.pt")          # a large one is downloaded now
    run.fetch()                              # everything
```

`sync(since)` reads the bucket's log of new records (`.catalog/<time>-<uuid>` under the prefix, written when a record is first pushed) after `since` and indexes each record's catalog: its files up to `catalog_max_bytes`, its markers and its edge log. Such records are `bytes_missing` until the rest is read. `Index.get().reindex(storage)` rebuilds an index from the whole bucket the same way.

`storage.delete(uuid)` removes a record (and its runs) from the bucket; the working copy stays.

## Several machines on one bucket

Machines that connect the same bucket share its catalog, and an interface dispatched on several of them at once runs once, as for processes sharing a folder ([concurrent dispatch](/guide/advanced-execution#concurrent-dispatch)):

- a finished run in the bucket is a cache hit everywhere (`cached()` reason `"finished elsewhere"`), its results read on demand;
- two machines dispatching at once: one claims the interface by creating `<identity>/.claims/<predicate>` beside it with `If-None-Match: *`; the other waits on that run (or, with `Execution().wait_elsewhere(False)`, reports it in `execution.elsewhere`) and ends cached on it;
- a claimant that stops beating for the liveness window (90 s by default, `MACHINABLE_HEARTBEAT_WINDOW`) is taken over by exactly one waiter, which replaces the claim with `If-Match` on its ETag and marks the dead run-record `abandoned_at`.

Every machine gives an interface the same record id. Each machine keeps its own index; nothing but the bucket is shared.

This needs a store that honours conditional writes on `PUT`: AWS S3 (both headers since late 2024), MinIO (recent releases) and Cloudflare R2 do. For a store that does not (check yours: a second `PUT` with `If-None-Match: *` must fail with 412), set `conditional_writes: false`; dispatch then still finds runs finished elsewhere, but two machines dispatching at once can both run.
