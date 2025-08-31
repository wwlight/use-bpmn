<script setup lang="ts">
defineOptions({
  name: 'ZoomTools',
})

const { bpmnModeler } = defineProps(['bpmnModeler'])
const MIN_SCALE = 0.3 // 最小缩放比例
const MAX_SCALE = 3 // 最大缩放比例
const currentZoom = ref(1)

function handleControl(type: string) {
  if (!bpmnModeler)
    return
  const canvas = bpmnModeler.get('canvas')
  switch (type) {
    case 'zoom-in':
      currentZoom.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentZoom.value += 0.2))
      canvas.zoom(currentZoom.value)
      break
    case 'zoom-out':
      currentZoom.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentZoom.value -= 0.2))
      canvas.zoom(currentZoom.value)
      break
    default:
      currentZoom.value = 1
      canvas.zoom('fit-viewport', 'auto')
  }
}
</script>

<template>
  <div
    class="b-(1 #E0E0E0 solid) bottom-100 right-10 absolute divide-(#E0E0E0 y-1 solid)"
    flex="~ col"
  >
    <ep-tooltip content="重置居中" placement="left">
      <el-button text bg class="px-8 rd-0" @click="handleControl('zoom-reset')">
        <template #icon>
          <i class="i-ep-aim" />
        </template>
      </el-button>
    </ep-tooltip>
    <ep-tooltip content="放大" placement="left">
      <el-button text bg class="px-8 rd-0 !m-0" @click="handleControl('zoom-in')">
        <template #icon>
          <i class="i-ep-plus" />
        </template>
      </el-button>
    </ep-tooltip>
    <ep-tooltip content="缩小" placement="left">
      <el-button text bg class="px-8 rd-0 !m-0" @click="handleControl('zoom-out')">
        <template #icon>
          <i class="i-ep-minus" />
        </template>
      </el-button>
    </ep-tooltip>
  </div>
</template>
