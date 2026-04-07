<template>
  <span class="pydoc-wrapper" ref="wrapperRef">
    <a
      href="#"
      class="pydoc-link"
      :class="[`pydoc-${spec.kind}`]"
      @click.prevent.stop="togglePanel"
    >
      <span class="pydoc-icon" aria-hidden="true">{{ icon }}</span>
      <span class="pydoc-label">{{ label }}</span>
    </a>
    <ClientOnly>
      <Teleport to="body">
        <Transition name="pydoc-fade">
          <div
            v-if="showPanel"
            class="pydoc-panel"
            ref="panelRef"
            :style="panelStyle"
            @click.stop
          >
            <div class="pydoc-panel-header">
              <span class="pydoc-panel-kind">{{ spec.kind }}</span>
              <button class="pydoc-panel-close" @click="closePanel" aria-label="Close">&times;</button>
            </div>
            <div class="pydoc-panel-path">{{ spec.path }}</div>
            <div v-if="spec.signature" class="pydoc-panel-sig">
              <code>{{ signatureDisplay }}</code>
            </div>
            <div v-if="spec.parents && spec.parents.length" class="pydoc-panel-parents">
              Inherits from: <code>{{ spec.parents.join(', ') }}</code>
            </div>
            <div v-if="spec.doc" class="pydoc-panel-doc">{{ spec.doc }}</div>
            <div v-if="spec.file" class="pydoc-panel-file">
              <span class="pydoc-panel-file-icon">📁</span> {{ spec.file }}
            </div>
            <div v-if="spec.kind === 'unknown'" class="pydoc-panel-unknown">
              No API entry found for this symbol.
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </span>
</template>

<script setup>
import { ref, computed, watch, useSlots, getCurrentInstance, nextTick } from 'vue'

const props = defineProps({
  caption: String
})

const slots = useSlots()
const instance = getCurrentInstance()
const pydocData = instance.appContext.config.globalProperties.$pydocData

const showPanel = ref(false)
const wrapperRef = ref(null)
const panelRef = ref(null)
const panelStyle = ref({})

function extractText(vnodes) {
  if (!vnodes) return ''
  if (typeof vnodes === 'string') return vnodes
  if (!Array.isArray(vnodes)) vnodes = [vnodes]
  return vnodes.map(vnode => {
    if (typeof vnode === 'string') return vnode
    if (typeof vnode === 'number') return String(vnode)
    if (vnode == null) return ''
    if (typeof vnode.children === 'string') return vnode.children
    if (Array.isArray(vnode.children)) return extractText(vnode.children)
    return ''
  }).join('').trim()
}

const spec = computed(() => {
  const slotContent = slots.default?.()
  const name = extractText(slotContent) || '<undefined>'
  if (name in pydocData) {
    return pydocData[name]
  }
  return {
    kind: 'unknown',
    name: name,
    path: name,
  }
})

const icon = computed(() => {
  switch (spec.value.kind) {
    case 'class': return 'C'
    case 'routine': return 'f'
    case 'module': return 'M'
    default: return '?'
  }
})

const label = computed(() => {
  if (props.caption) {
    return props.caption
  }
  let l = spec.value.path
  if (spec.value.kind === 'routine') {
    l = l + '()'
  }
  if (l.startsWith('machinable.')) {
    l = l.substring('machinable.'.length)
  }
  return l
})

const signatureDisplay = computed(() => {
  const name = spec.value.realname || spec.value.path.split('.').pop()
  return `${name}${spec.value.signature || '()'}`
})

function closePanel() {
  showPanel.value = false
}

function onDocumentClick(e) {
  if (wrapperRef.value?.contains(e.target)) return
  closePanel()
}

function onKeydown(e) {
  if (e.key === 'Escape') closePanel()
}

async function togglePanel() {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    await nextTick()
    positionPanel()
  }
}

watch(showPanel, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      document.addEventListener('click', onDocumentClick)
      document.addEventListener('keydown', onKeydown)
    }, 0)
  } else {
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
  }
})

function positionPanel() {
  if (!wrapperRef.value || !panelRef.value) return
  const rect = wrapperRef.value.getBoundingClientRect()
  const panelWidth = 420
  const margin = 12

  let top = rect.bottom + 6
  let left = rect.left

  if (left + panelWidth > window.innerWidth - margin) {
    left = window.innerWidth - panelWidth - margin
  }
  if (left < margin) {
    left = margin
  }
  if (top + 200 > window.innerHeight) {
    top = rect.top - 6
    panelStyle.value = {
      position: 'fixed',
      left: left + 'px',
      bottom: (window.innerHeight - top) + 'px',
      top: 'auto',
      width: panelWidth + 'px',
    }
    return
  }

  panelStyle.value = {
    position: 'fixed',
    left: left + 'px',
    top: top + 'px',
    width: panelWidth + 'px',
  }
}
</script>
