<script setup lang="ts">
// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import BpmnModeler from 'bpmn-js/lib/Modeler'
import gridModule from 'diagram-js-grid'
import translateModule from './_i18n/translate'
import ZoomTools from './_zoom-tools.vue'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

defineOptions({
  name: 'BpmnPreview',
})

const props = withDefaults(
  defineProps<{
    xmlStr: string
    showTools?: boolean
  }>(),
  {
    xmlStr: '',
    showTools: true,
  },
)

let bpmnModeler: any
const bpmnReady = ref(false)

onMounted(() => {
  initModeler()
})

onUnmounted(() => {
  bpmnModeler?.destroy?.()
})

function initModeler() {
  const option = {
    container: '#bpmn-preview-container',
    additionalModules: [
      gridModule,
      translateModule,
      {
        paletteProvider: ['value', null], // 禁用左侧工具栏
        labelEditingProvider: ['value', null], // 禁用元素的文本编辑
        contextPadProvider: ['value', null], // 禁用元素右键菜单
        bendpoints: ['value', {}], // 禁用连线拖动调整
        // zoomScroll: ['value', null], // 禁用画布滚动缩放
        // moveCanvas: ['value', null], // 禁用整个画布的拖动
        move: ['value', null], // 禁用单个元素的拖动
      },
    ],
  }
  bpmnModeler = new BpmnModeler(option)

  // 禁用快捷键
  bpmnModeler.get('keyboard').unbind()
  // 禁止选中
  const eventBus = bpmnModeler.get('eventBus')
  eventBus.on('selection.changed', (event) => {
    if (event.newSelection && event.newSelection.length > 0) {
      bpmnModeler.get('selection').select(null)
    }
  })
  loadDiagram()
}

async function loadDiagram() {
  const xml = props.xmlStr
  if (!xml) {
    ElMessage.error('无法加载')
    return
  }
  await bpmnModeler?.importXML?.(xml)
  bpmnModeler?.get('canvas').zoom('fit-viewport', 'auto')
  bpmnReady.value = true
}
</script>

<template>
  <div class="size-full relative of-hidden">
    <div id="bpmn-preview-container" class="size-full [&_svg]:outline-none [&_*]:select-none" />
    <zoom-tools v-if="bpmnReady && showTools" :bpmn-modeler />
  </div>
</template>
