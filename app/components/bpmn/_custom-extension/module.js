import { DBLCLICK_PROPERTY_CONFIG } from '~/constants'

function RegisterDblclickEvent(eventBus, config) {
  let doubleClickHandlers = {}
  const selectors = [
    'input[name=assignee]',
    'input[name=candidateGroups]',
    'input[name=formKey]',
  ]

  eventBus.on('selection.changed', (e) => {
    const selection = e.newSelection?.[0]
    if (selection && selection.type === 'bpmn:UserTask') {
      config.selectionId = selection?.id

      setTimeout(() => {
        selectors.forEach((selector) => {
          const inputElement = document.querySelector(selector)
          if (doubleClickHandlers[selector] && inputElement) {
            inputElement.removeEventListener('dblclick', doubleClickHandlers[selector])
          }

          doubleClickHandlers[selector] = (e) => {
            Object.assign(config, {
              type: selector.slice(11, -1),
              visible: true,
              value: e?.target?.value ?? '',
            })
          }

          if (inputElement) {
            inputElement.addEventListener('dblclick', doubleClickHandlers[selector])
          }
        })
      })
    }
    else {
      Object.assign(config, DBLCLICK_PROPERTY_CONFIG)
    }
  })
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
