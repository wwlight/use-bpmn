const { isFalsy } = useUtils()

export default function (bpmnXml: string, fileName?: string) {
  if (isFalsy(bpmnXml)) {
    ElMessage.closeAll()
    ElMessage.warning('无法下载')
    return
  }

  fileName = `${isFalsy(fileName) ? '导出流程模型' : fileName}.bpmn`
  const blob = new Blob([bpmnXml], { type: 'application/xml;charset=utf-8' })
  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = fileName
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
  }, 1000)
}
