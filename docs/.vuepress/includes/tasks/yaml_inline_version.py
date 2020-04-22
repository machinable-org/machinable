# language=yaml
alexnet = """
learning_rate: 0.1
data:
  name: mnist
"""

task = ml.Task().components(("optimization", alexnet))

# the above is equivalent to:

task = ml.Task().components(
    ("optimization", {"learning_rate": 0.1, "data": {"name": "mnist"}})
)
