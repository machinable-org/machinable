from orator import Schema


def run(db):
    schema = Schema(db)

    schema.drop_if_exists("storages")
    with schema.create("storages") as table:
        table.increments("id")
        table.string("url").nullable()
        table.boolean("indexed").default(False)
        table.timestamps()

    schema.drop_if_exists("tasks")
    with schema.create("tasks") as table:
        table.increments("id")
        table.string("name").nullable()
        table.string("task_id").nullable()
        table.string("execution_id").nullable()
        table.integer("seed").nullable()
        table.boolean("tune").nullable()
        table.integer("execution_cardinality").nullable()
        table.integer("rerun").nullable()
        table.boolean("code_backup").nullable()
        table.text("code_version").nullable()
        table.string("path").nullable()
        table.integer("storage_id").nullable()
        table.integer("observations_count").nullable()
        table.timestamp("started").nullable()
        table.timestamp("heartbeat").nullable()
        table.timestamp("finished").nullable()
        table.timestamps()

    schema.drop_if_exists("observations")
    with schema.create("observations") as table:
        table.increments("id")
        table.string("path").nullable()
        table.string("node").nullable()
        table.integer("execution_index").nullable()
        table.string("components").nullable()
        table.timestamp("started").nullable()
        table.timestamp("heartbeat").nullable()
        table.timestamp("finished").nullable()
        table.integer("task_id").nullable()
        table.timestamps()

    return True
