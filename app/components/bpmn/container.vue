<script setup lang="ts">
// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from 'bpmn-js-properties-panel'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import BpmnModdle from 'bpmn-moddle'
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import gridModule from 'diagram-js-grid'
import DialogAssignee from './_com/dialog-assignee.vue'
import DialogCandidateGroups from './_com/dialog-candidate-groups.vue'
import DialogFormKey from './_com/dialog-form-key.vue'
import ZoomTools from './_com/zoom-tools.vue'
import DblclickEventRegisterModule from './_extension/dblclick-event-register'
import HidePropertiesProviderModule from './_extension/hide-properties-provider'
import translateModule from './_i18n'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css'

defineOptions({
  name: 'BpmnContainer',
})

const { xmlStr } = defineProps(['xmlStr'])
const { isFalsy } = useUtils()
let bpmnModeler: any
const bpmnReady = ref(false)
// 属性面板当前双击的属性信息
const dblclickPropertyConfig = reactive({
  type: '',
  value: '',
  selectionId: '',
  visible: false,
})
// 属性面板-负责人
const assigneeVisible = computed({
  get: () => dblclickPropertyConfig.visible && dblclickPropertyConfig.type === 'assignee',
  set: (v) => {
    if (!v) {
      Object.assign(dblclickPropertyConfig, { visible: false, type: '' })
    }
  },
})
// 属性面板-角色组
const candidateGroupsVisible = computed({
  get: () => dblclickPropertyConfig.visible && dblclickPropertyConfig.type === 'candidateGroups',
  set: (v) => {
    if (!v) {
      Object.assign(dblclickPropertyConfig, { visible: false, type: '' })
    }
  },
})
// 属性面板-表单key
const formKeyVisible = computed({
  get: () => dblclickPropertyConfig.visible && dblclickPropertyConfig.type === 'formKey',
  set: (v) => {
    if (!v) {
      Object.assign(dblclickPropertyConfig, { visible: false, type: '' })
    }
  },
})

onMounted(() => {
  initModeler()
})

onUnmounted(() => {
  bpmnModeler?.destroy?.()
})

function initModeler() {
  const option = {
    container: '#bpmn-container',
    propertiesPanel: {
      parent: '#properties-panel',
    },
    additionalModules: [
      gridModule,
      translateModule,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      DblclickEventRegisterModule(dblclickPropertyConfig),
      HidePropertiesProviderModule,
    ],
    moddleExtensions: {
      camunda: CamundaBpmnModdle,
    },
  }
  bpmnModeler = new BpmnModeler(option)
  !isFalsy(xmlStr) ? loadDiagram() : createDiagram()
}

async function loadDiagram() {
  await importXML(xmlStr)
  bpmnReady.value = true
}

async function createDiagram() {
  await bpmnModeler?.createDiagram?.()
  bpmnModeler?.get('canvas')?.zoom('fit-viewport', 'auto')
  bpmnReady.value = true
}

async function getXML(format = false) {
  if (!bpmnModeler)
    return

  const { xml } = await bpmnModeler.saveXML({ format })
  const { name } = await getPanelProperties(xml)
  return [xml, name] as any
}

// 获取属性面板数据
async function getPanelProperties(xml: string) {
  const moddle = new BpmnModdle()
  const { rootElement: definitions } = await moddle.fromXML(xml)
  return definitions.get('rootElements').at(0) || {}
}

async function importXML(xml: string) {
  try {
    await bpmnModeler?.importXML(xml)
    bpmnModeler?.get('canvas')?.zoom('fit-viewport', 'auto')
  }
  catch (err) {
    ElMessage.error('加载失败')
    console.error('加载 BPMN 文件失败:', err.message, err.warnings)
  }
}

function undo() {
  bpmnModeler?.get('commandStack').undo()
}

function redo() {
  bpmnModeler?.get('commandStack').redo()
}

// 更新属性面板数据
function updateModdleProperties(key: string, value: string) {
  if (bpmnModeler) {
    const elementRegistry = bpmnModeler?.get('elementRegistry')
    const selectionElement = elementRegistry?.get(dblclickPropertyConfig.selectionId)
    if (elementRegistry && selectionElement) {
      const modeling = bpmnModeler?.get('modeling')
      modeling?.updateModdleProperties(
        selectionElement,
        selectionElement.businessObject,
        { [key]: value },
      )
    }
  }
}

defineExpose({
  getPanelProperties,
  getXML,
  importXML,
  undo,
  redo,
})
</script>

<template>
  <div flex="~ 1" class="b-bs-(1 [hsl(225,10%,75%)]) bg-#fff of-hidden">
    <div class="flex-1 relative">
      <div id="bpmn-container" class="size-full [&_svg]:outline-none" />
      <zoom-tools v-if="bpmnReady" :bpmn-modeler />
    </div>
    <div
      id="properties-panel"
      class="b-(l-1 l-[hsl(225,10%,75%)] l-solid) min-w-[--bpmn-properties-panel-width] w-[--bpmn-properties-panel-width]"
    />
    <dialog-assignee
      v-if="assigneeVisible" v-model="assigneeVisible"
      @confirm="(value) => updateModdleProperties('assignee', value)"
    />
    <dialog-candidate-groups
      v-if="candidateGroupsVisible" v-model="candidateGroupsVisible"
      @confirm="(value) => updateModdleProperties('candidateGroups', value)"
    />
    <dialog-form-key
      v-if="formKeyVisible" v-model="formKeyVisible" :form-key="dblclickPropertyConfig.value"
      @confirm="(value) => updateModdleProperties('formKey', value)"
    />
  </div>
</template>
