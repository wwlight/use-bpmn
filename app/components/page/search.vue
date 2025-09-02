<script setup lang="ts">
defineOptions({
  name: 'PageSearch',
})

const emit = defineEmits<{
  query: [value: void]
  reset: [value: void]
}>()

const { isFalsy } = useUtils()
const search = defineModel<any>('modelValue', { default: {} })
const searchConfig = defineModel<any>('config', { default: [] })
const showToggle = ref(false)
const isFold = computed({
  get: () => searchConfig.value?.find((i: any) => i?.hidden === true)?.hidden,
  set: (bool) => {
    searchConfig.value.forEach((i: any) => {
      if (!isFalsy(i.hidden)) {
        i.hidden = bool
      }
    })
  },
})
const isDatePicker = computed(() => (type: string) =>
  ['year', 'years', 'month', 'months', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange', 'yearrange'].includes(type),
)

watch(
  () => searchConfig.value,
  (list = []) => {
    showToggle.value = list?.some((i: any) => !isFalsy(i.hidden))
  },
  { immediate: true, deep: true, once: true },
)

function queryList() {
  emit('query')
}

function resetQuery() {
  emit('reset')
}
</script>

<template>
  <div class="flex gap-30 items-start relative">
    <slot name="prefix" />
    <el-form inline :model="search" v-bind="$attrs">
      <template
        v-for="({ slot, component, type, label, hidden = false, options, width, ...otherItem }) in searchConfig"
      >
        <slot v-if="!isFalsy(slot)" :name="slot" />
        <component :is="component" v-else-if="!isFalsy(component)" :info="otherItem" />
        <el-form-item v-else-if="type === 'input' && !hidden" :label :class="[width && width]">
          <el-input v-model="search[otherItem.prop]" :placeholder="`请输入${label}`" clearable v-bind="otherItem" />
        </el-form-item>
        <el-form-item v-else-if="type === 'select' && !hidden" :label :class="[width && width]">
          <el-select
            v-model="search[otherItem.prop]" :placeholder="`请选择${label}`" clearable v-bind="otherItem"
            @change="queryList"
          >
            <el-option v-for="option in options || []" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="type === 'tree-select' && !hidden" :label :class="[width && width]">
          <el-tree-select
            v-model="search[otherItem.prop]" :data="options" :placeholder="`请选择${label}`" clearable
            v-bind="otherItem" @change="queryList"
          />
        </el-form-item>
        <el-form-item v-else-if="isDatePicker(type) && !hidden" :label :class="[width && width]">
          <el-date-picker
            v-model="search[otherItem.prop]" :type value-format="YYYY-MM-DD" :placeholder="`请选择${label}`"
            start-placeholder="开始时间" end-placeholder="结束时间" v-bind="otherItem" @change="queryList"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="queryList">
          查询
        </el-button>
        <el-button @click="resetQuery">
          重置
        </el-button>
        <el-button v-if="showToggle" link @click="isFold = !isFold">
          <template #icon>
            <i :class="[isFold ? 'i-ep:caret-bottom' : 'i-ep:caret-top']" />
          </template>
          {{ isFold ? '展开' : '收起' }}
        </el-button>
      </el-form-item>
    </el-form>
    <div v-if="$slots.operate" class="ml-a">
      <slot name="operate" />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form) {
  .el-form-item {
    margin-right: 20px;
  }

  .el-input,
  .el-select {
    min-width: 220px;
  }

  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
