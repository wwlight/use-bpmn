<script setup lang="ts">
import type { ElTable } from 'element-plus'

defineOptions({
  name: 'EPTable',
})

withDefaults(
  defineProps<{
    tableData: any
    tableConfig?: any
    tooltipOffset?: boolean
  }>(),
  {
    tableData: () => [],
    tableConfig: () => [],
    tooltipOffset: true,
  },
)

const tableRef = ref<InstanceType<typeof ElTable>>()

// 表格提示标签
const tooltipOptions = ref({
  placement: 'top',
  effect: 'light',
  offset: -1,
})

defineExpose({
  tableRef,
})
</script>

<template>
  <el-table
    ref="tableRef" :data="tableData" class="flex-1" width="100%" height="100%" stripe
    :tooltip-options="tooltipOptions" table-layout="fixed" header-cell-class-name="!text-center"
    cell-class-name="!text-center" v-bind="$attrs"
  >
    <template v-for="item in tableConfig">
      <slot v-if="item?.slot" :name="item.slot" />
      <component :is="item.component" v-else-if="item?.component" :info="item" />
      <el-table-column
        v-else-if="item?.type === 'selection'" type="selection" width="55"
        v-bind="item"
      />
      <el-table-column
        v-else-if="item?.type === 'index'" label="序号" type="index" width="100"
        v-bind="item"
      />
      <el-table-column v-else v-bind="item" />
    </template>
  </el-table>
</template>
