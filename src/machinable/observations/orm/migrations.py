from orator import Schema


def run(db):
    schema = Schema(db)

    schema.drop_if_exists('storages')
    with schema.create('storages') as table:
        table.increments('id')
        table.string('url')
        table.boolean('indexed').default(False)
        table.timestamps()

    schema.drop_if_exists('tasks')
    with schema.create('tasks') as table:
        table.increments('id')
        table.string('name').nullable()
        table.string('task_id')
        table.string('execution_id').nullable()
        table.integer('seed')
        table.boolean('tune')
        table.integer('rerun')
        table.boolean('code_backup')
        table.text('code_version')
        table.string('path')
        table.integer('storage_id')
        table.integer('observations_count').nullable()
        table.timestamp('started').nullable()
        table.timestamp('heartbeat').nullable()
        table.timestamp('finished').nullable()
        table.timestamps()

    schema.drop_if_exists('observations')
    with schema.create('observations') as table:
        table.increments('id')
        table.string('path')
        table.string('node')
        table.string('children').nullable()
        table.timestamp('started').nullable()
        table.timestamp('heartbeat').nullable()
        table.timestamp('finished').nullable()
        table.integer('task_id')
        table.timestamps()

    return True
