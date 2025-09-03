import { DBLCLICK_PROPERTY_CONFIG } from '~/constants'

function RegisterDblclickEvent(eventBus, config) {
  let isUserTaskSelected = false
  let currentHandler = null
  const selectors = [
    'input[name=assignee]',
    'input[name=candidateGroups]',
    'input[name=formKey]',
  ]

  function handleDoubleClick(type, value) {
    Object.assign(config, {
      type,
      visible: true,
      value: value || '',
    })
  }

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
          handleDoubleClick(type, target.value)
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
      // 如果之前已经选中了 UserTask，不需要重新绑定
      if (!isUserTaskSelected) {
        config.selectionId = selection?.id
        isUserTaskSelected = true

        setTimeout(() => {
          bindDoubleClickEvents()
        })
      }
    }
    else {
      if (isUserTaskSelected) {
        isUserTaskSelected = false
        unbindDoubleClickEvents()
        Object.assign(config, DBLCLICK_PROPERTY_CONFIG)
      }
    }
  })

  function cleanup() {
    unbindDoubleClickEvents()
    isUserTaskSelected = false
  }

  eventBus.on('diagram.destroy', cleanup)
  window.addEventListener('beforeunload', cleanup)
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
