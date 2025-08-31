<script setup lang="ts">
import defaultBpmn from '~~/public/default.bpmn?raw'

defineOptions({
  name: 'IndexPage',
})

const bpmnRef = useTemplateRef('bpmn')
const previewVisible = ref(false)
const xmlStr = ref('')
const bpmnName = ref('')

const { open: handleImport, reset, onChange } = useFileDialog({
  accept: '.bpmn',
})

onChange((fileList) => {
  if (fileList && fileList.length > 0) {
    const file = fileList[0]!
    const fileName = file.name
    const fileExtension = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
    if (!['bpmn'].includes(fileExtension)) {
      ElMessage.warning('请上传 bpmn 文件')
      reset()
      return
    }
    // 读取文件为文本
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (e) {
      const xml = e.target!.result as string
      xml && bpmnRef.value?.importXML(xml)
    }
  }
})

function handleUndo() {
  bpmnRef.value?.undo()
}

function handleRedo() {
  bpmnRef.value?.redo()
}

async function handleDownload() {
  const [xml, name] = await bpmnRef.value?.getXML()
  useDownloadBpmn(xml, name)
}

async function handlePreview() {
  const [xml, name] = await bpmnRef.value?.getXML()
  xmlStr.value = xml
  bpmnName.value = name ?? '流程模型'
  previewVisible.value = true
}

async function handleSave() {
  const [xml, name] = await bpmnRef.value?.getXML()
  // eslint-disable-next-line no-console
  console.log({ xml, name })
}
</script>

<template>
  <div class="size-screen" flex="~ col">
    <div class="pl-20 bg-#fff h-50 min-h-50 w-full z-10" flex="~ items-center">
      <el-link type="primary" underline="never" href="https://github.com/wwlight/use-bpmn" target="_blank" class="text-20 font-bold lt-sm:hidden">
        use-bpmn
      </el-link>
      <div flex="~ 1 justify-end items-center" class="lt-sm:hidden">
        <el-divider direction="vertical" />
        <ep-tooltip content="快捷键：Ctrl + Z">
          <el-button type="primary" link bg @click="handleUndo">
            撤销
          </el-button>
        </ep-tooltip>
        <el-divider direction="vertical" />
        <ep-tooltip content="快捷键：Ctrl + Shift + Z">
          <el-button type="primary" link bg @click="handleRedo">
            重做
          </el-button>
        </ep-tooltip>
        <el-divider direction="vertical" />
        <el-button type="primary" link bg @click="handleImport()">
          导入
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" link bg @click="handleDownload">
          下载
        </el-button>
        <el-divider direction="vertical" class="mr-0" />
      </div>
      <div class="ml-a px-10 w-[--bpmn-properties-panel-width]" flex="~ justify-end">
        <el-button type="success" text bg @click="handlePreview">
          预览
        </el-button>
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </div>
    </div>
    <bpmn-container ref="bpmn" :xml-str="defaultBpmn" />
    <ep-dialog
      v-if="previewVisible" v-model="previewVisible" :title="bpmnName" :show-footer="false" class="h-full" body-class="!p-0"
    >
      <template #body>
        <bpmn-preview :xml-str />
      </template>
    </ep-dialog>
  </div>
</template>
