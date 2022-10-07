<template>
  <a href="#" :style="spec.kind == 'unknown' ? {color: 'red'} : {}">{{ label }}</a>
</template>
<script>
export default {
  props: ["caption"],
  computed: {
    spec() {
      let name = this.$slots.default ? this.$slots.default()[0].children : "<undefined>";
      if (name in this.$pydocData) {
        return this.$pydocData[name]
      }
      return {
        'kind': 'unknown',
        'name': name,
        'path': name,
      }
    },
    label() {
      if (this.caption) {
        return this.caption
      }

      let label = this.spec['path']

      if (this.spec['kind'] == 'routine') {
        label = label + '()'
      }

      if (label.startsWith('machinable.')) {
        label = label.substring('machinable.'.length)
      }

      return label
    }
  }
}
</script>
