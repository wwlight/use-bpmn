<script setup lang="ts">
defineOptions({
  name: 'EPPagination',
})

const pageNum = defineModel<number>('pageNum', { default: 1, required: true })
const pageSize = defineModel<number>('pageSize', { default: 20, required: true })

function handleChange(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
}
</script>

<template>
  <el-pagination
    v-model:current-page="pageNum" v-model:page-size="pageSize" flex="~ justify-end" class="pt-10"
    background :page-sizes="[10, 20, 30, 50, 100]" layout="total, sizes, prev, pager, next" v-bind="$attrs"
    @change="handleChange"
  />
</template>
