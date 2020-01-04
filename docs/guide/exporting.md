# Exporting tasks

machinable can export tasks as a plain python project so they can be executed without machinable. The export function only collects the configuration and python code that is needed to execute the task and generates a standalone python project that has no further dependencies. To export a task call the export method on the task you would like to export:

<<< @/docs/.vuepress/includes/tasks/export.py

If the `path` argument is not specified export tasks will be generated under `$PROJECT_DIRECTORY/exports`.
