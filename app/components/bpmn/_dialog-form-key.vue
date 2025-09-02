<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

defineOptions({
  name: 'DialogFormKey',
})

const { formKey } = defineProps(['formKey'])
const emit = defineEmits<{
  confirm: [value: string]
}>()
const visible = defineModel<boolean>('modelValue', { default: false })

const ORIGIN_SEARCH = {
  pageNum: 1,
  pageSize: 20,
  formName: undefined,
  businessType: undefined,
}

const pageTotal = ref(0)
const search = ref(cloneDeep(ORIGIN_SEARCH))
const searchConfig = ref([
  { type: 'input', label: '表单名', prop: 'formName' },
  { type: 'input', label: '表单类型', prop: 'businessType' },
])
const tableConfig = ref([
  { slot: 'radio' },
  { prop: 'id', label: '表单id', width: 120 },
  { prop: 'formName', label: '表单名', minWidth: 200 },
  { prop: 'businessType', label: '表单类型', minWidth: 150 },
  { prop: 'description', label: '表单描述', showOverflowTooltip: true, minWidth: 200 },
  { prop: 'createTime', label: '创建时间', width: 180 },
])
const tableData = ref<any>([])
const selectFormKey = ref(formKey ?? '')

onMounted(() => {
  queryList()
})

function queryList() {
  pageTotal.value = 3
  tableData.value = [
    { id: 1, formName: '表单1', businessType: '类型1', description: '描述1', createTime: '2024-01-01 10:00:00' },
    { id: 2, formName: '表单2', businessType: '类型2', description: '描述2', createTime: '2024-01-02 11:00:00' },
    { id: 3, formName: '表单3', businessType: '类型3', description: '描述3', createTime: '2024-01-03 12:00:00' },
  ]
}

function resetQuery() {
  Object.assign(search.value, cloneDeep(ORIGIN_SEARCH))
  queryList()
}

function handleCurrentChange(row: any) {
  selectFormKey.value = `${row?.id ?? ''}`
}

function handleConfirm(cb: () => void) {
  if (!selectFormKey.value) {
    ElMessage.closeAll()
    ElMessage.warning('请选择表单')
    return
  }
  emit('confirm', selectFormKey.value)
  cb()
}
</script>

<template>
  <ep-dialog v-model="visible" title="表单选择" class="h-full" @confirm="handleConfirm">
    <template #body>
      <page-search v-model="search" v-model:config="searchConfig" @query="queryList" @reset="resetQuery" />
      <ep-table :table-data :table-config row-class-name="cursor-pointer" @current-change="handleCurrentChange">
        <template #radio>
          <el-table-column width="55">
            <template #default="scope">
              <el-radio v-model="selectFormKey" :value="`${scope.row?.id ?? ''}`" />
            </template>
          </el-table-column>
        </template>
        <ep-pagination v-model:page-num="search.pageNum" v-model:page-size="search.pageSize" :total="pageTotal" />
      </ep-table>
    </template>
  </ep-dialog>
</template>
