# language=yaml
alexnet = """
learning_rate: 0.1
data:
  name: mnist
"""

task = ml.Task().component('optimization', alexnet)

# the above is equivalent to:

task = ml.Task().component('optimization', {
    'learning_rate': 0.1,
    'data': {
        'name': 'mnist'
    }
})