import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
        theme: {
          process: createRemToPxProcessor(4),
        },
      },
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      autoInstall: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  postprocess: [createRemToPxProcessor(4)],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'b': 'b-1 b-solid b-red',
  },
  theme: {
    breakpoints: {
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1920px',
    },
  },
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
