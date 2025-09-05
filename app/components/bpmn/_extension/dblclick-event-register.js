function RegisterDblclickEvent(eventBus, config) {
  let currentHandler = null
  const selectors = [
    'input[name=assignee]',
    'input[name=candidateGroups]',
    'input[name=candidateUsers]',
    'input[name=formKey]',
  ]

  // 绑定双击事件
  function bindDoubleClickEvents() {
    const propertiesPanel = document.getElementById('properties-panel')
    if (!propertiesPanel)
      return

    if (currentHandler) {
      unbindDoubleClickEvents()
    }

    // 创建新的事件处理器
    currentHandler = (e) => {
      const target = e.target

      selectors.forEach((selector) => {
        if (target.matches(selector)) {
          const type = selector.slice(11, -1)
          Object.assign(config, { type, value: target.value, visible: true })
        }
      })
    }

    propertiesPanel.addEventListener('dblclick', currentHandler)
  }

  function unbindDoubleClickEvents() {
    const propertiesPanel = document.getElementById('properties-panel')
    if (propertiesPanel && currentHandler) {
      propertiesPanel.removeEventListener('dblclick', currentHandler)
      currentHandler = null
    }
  }

  eventBus.on('selection.changed', (e) => {
    const selection = e.newSelection?.[0]
    if (selection && selection.type === 'bpmn:UserTask') {
      config.selectionId = selection?.id
      setTimeout(bindDoubleClickEvents)
    }
    else {
      unbindDoubleClickEvents()
    }
  })

  eventBus.on('diagram.destroy', unbindDoubleClickEvents)
  window.addEventListener('beforeunload', unbindDoubleClickEvents)
}

RegisterDblclickEvent.$inject = ['eventBus']

export default function (config) {
  return {
    __init__: ['registerDblclickEvent'],
    registerDblclickEvent: [
      'type',
      function (eventBus) {
        return new RegisterDblclickEvent(eventBus, config)
      },
    ],
  }
}
