// 自定义属性提供者，用于隐藏特定字段
function HidePropertiesProvider(propertiesPanel) {
  propertiesPanel.registerProvider(100, this)
}

// 属性面板渲染（如选中元素、切换元素、属性面板刷新），就会自动触发 getGroups
HidePropertiesProvider.prototype.getGroups = function (element) {
  return (groups) => {
    // 过滤组
    if (element?.type === 'bpmn:StartEvent') {
      groups = groups.filter((group) => {
        return !['CamundaPlatform__Form'].includes(group.id)
      })
    }

    // 过滤组内的字段
    // if (element?.type === 'bpmn:UserTask') {
    //   groups.forEach((group) => {
    //     if (group.entries) {
    //       group.entries = group.entries.filter((entry) => {
    //         return !['candidateUsers'].includes(entry.id)
    //       })
    //     }
    //   })
    // }

    return groups
  }
}

HidePropertiesProvider.$inject = ['propertiesPanel']

export default {
  __init__: ['hidePropertiesProvider'],
  hidePropertiesProvider: ['type', HidePropertiesProvider],
}
