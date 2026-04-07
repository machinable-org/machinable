<template>
    <ul>
        <li v-for="item in items" :key="item.path">
            <Pydoc :caption="item.id">{{ item.path }}</Pydoc>
            <Tree v-if="item.children && item.children.length > 0" :items="item.children"/>
        </li>
    </ul>
</template>
<script>
import Pydoc from './Pydoc.vue'

export default {
  name: 'Tree',
  components: { Pydoc },
  props: {
    items: Array
  }
}
</script>
