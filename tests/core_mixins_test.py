import os
import sys

import pytest

import machinable as ml
from machinable.engine import Engine
from machinable.core.core import Component


def test_mixins():
    # set test project path
    sys.path.insert(0, os.path.join(os.getcwd(), 'test_project'))

    # config only mixin
    component = Component({'_mixins_': ['extended', '+.fooba.test']}, {})
    assert getattr(component, 'extended', True)
    assert getattr(component, 'fooba_test', True)

    # module mixins

    component = Component({'_mixins_': ['mixin_module', '+.fooba.mixins.nested']}, {'BOUND': 'component'})
    assert getattr(component, '_mixin_module_', None) is not None
    assert component._mixin_module_.is_bound('correctly') == 'bound_to_component_correctly'
    with pytest.raises(AttributeError):
        component._mixin_module_.non_existent('call')

    assert getattr(component, '_fooba_mixins_nested_', None) is not None
    assert component._fooba_mixins_nested_.hello() == 'component'
    with pytest.raises(AttributeError):
        component._fooba_mixins_nested_.non_existent('call')

    assert component._mixin_module_.key_propery == 1

    # de-alias via origin
    config = {'_mixins_': ['mixin_module', '+.fooba.mixins.nested',
                           {'name': '+.fooba.nested', 'origin': '+.fooba.mixins.nested'}]}
    component = Component(config, {'BOUND': 'component'})
    assert component._mixin_module_.is_bound('correctly') == 'bound_to_component_correctly'

    # this-referencing
    assert component._mixin_module_.this_reference('correctly') == 'bound_to_component_and_referenced_correctly'
    assert component._mixin_module_.this_attribute() == 'works'
    assert component._mixin_module_.this_static('works') == 'works'


def test_hidden_mixins():
    sys.path.insert(0, os.path.join(os.getcwd(), 'test_project'))

    # hidden mixins that are only part of the imported project but not referenced in the project that imports them
    e = Engine(project_directory=os.path.join(os.getcwd(), 'test_project'), mode='DEV')

    ml.execute(ml.Task().component('inherited_mixin'), engine=e)

    ml.execute(ml.Task().component('direct_mixin_inheritance'), engine=e)


