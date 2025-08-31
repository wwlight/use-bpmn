<script setup lang="ts">
defineOptions({
  name: 'EPTooltip',
})

const showTooltip = ref(false)
function onMouseEnter(e: any, el?: any) {
  el = el ?? e.target
  showTooltip.value = !(el.offsetWidth < el.scrollWidth)
}
</script>

<template>
  <el-tooltip
    placement="bottom" effect="dark" :show-after="300" :disabled="showTooltip" :persistent="false"
    popper-class="max-w-300 break-all" v-bind="$attrs"
  >
    <slot :mouseenter="onMouseEnter" />
    <template #content>
      <slot name="content" />
    </template>
  </el-tooltip>
</template>
