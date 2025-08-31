import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    unocss: true,
    formatters: true,
    ignores: [],
    rules: {
      'vue/valid-v-for': 'off',
      'vue/require-v-for-key': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'no-use-before-define': 'off',
      'n/prefer-global/process': 'off',
      'jsdoc/check-param-names': 'off',
      'style/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['BreakStatement'] }],
    },
    languageOptions: {
      globals: {
        defineNuxtConfig: 'readonly',
      },
    },
  }),
)
