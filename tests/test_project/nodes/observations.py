import random
import datetime

from machinable import Component


class Observations(Component):

    # used to generate observer test data

    def on_execute_iteration(self, iteration):
        if iteration > 5:
            return StopIteration

        self.log.info(f"Observation node {self.config.id}, iteration {iteration}")
        self.record['number'] = random.randint(1, 100)
        self.record['constant'] = 42
        self.record['float'] = 13.1
        self.record['string'] = 'test'
        self.record['none'] = None
        self.record['nan'] = float('NaN')
        self.record['custom'] = Observations({}, {})
        self.record['date'] = datetime.datetime.now()

        # switching type
        if iteration > 3:
            self.record['float'] = None
            self.record['string'] = 1.3

        if self.config.get('test') is True:
            # custom records
            self.observer.get_record_writer('validation')['iteration'] = iteration
            self.observer.get_record_writer('validation').save()

        self.observer.store('test', 2, overwrite=True)
        if iteration == 1:
            self.observer.store('test.txt', f'hello from observation {self.config.id}')
            self.observer.store('data.json', {'observation_id': self.config.id})
            self.observer.store('key', 'value')
            self.observer.store('test', 1, overwrite=True)
