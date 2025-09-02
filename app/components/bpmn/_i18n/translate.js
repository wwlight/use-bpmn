import bpmn from './bpmn-js'
import camunda from './camunda-properties-panel'
import properties from './properties-panel'

const zhCN = {
  ...bpmn,
  ...properties,
  ...camunda,
}

export function customTranslate(template, replacements) {
  replacements = replacements || {}

  template = zhCN[template] || template

  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    return replacements[key] || `{${key}}`
  })
}

export default {
  translate: ['value', customTranslate],
}
