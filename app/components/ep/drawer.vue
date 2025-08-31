<script setup lang="ts">
defineOptions({
  name: 'EPDrawer',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    showCancel?: boolean
    showConfirm?: boolean
    confirmLoading?: boolean
    confirmDisabled?: boolean
    showFooter?: boolean
    autoClose?: boolean
    cancelText?: string
    confirmText?: string
  }>(),
  {
    showCancel: true,
    showConfirm: true,
    confirmLoading: false,
    confirmDisabled: false,
    showFooter: true,
    autoClose: true,
    cancelText: '取消',
    confirmText: '确定',
  },
)

const emit = defineEmits<{
  confirm: [handler: () => void]
  cancel: [handler: () => void]
}>()

const { width } = useWindowSize()
const slots = useSlots()
const attrs = useAttrs()
const visible = defineModel<boolean>('modelValue', { default: false, required: true })
const innerVisible = ref(visible.value)

const {
  'header-class': headerClass,
  'body-class': bodyClass,
  'footer-class': footerClass,
  'view-class': viewClass,
  ...mergedAttrs
} = attrs
const mergedHeaderClass = `relative px-20 py-16 m-0 ${headerClass ?? ''}`.trim()
const mergedBodyClass = `${!slots.body ? 'p-0' : 'px-20'} ${bodyClass ?? ''}`.trim()
const mergedFooterClass = `flex justify-end gap-12 space-x-0 *:last:ml-0 px-20 py-16 ${footerClass ?? ''}`.trim()
const mergedViewClass = `${!slots.body ? 'relative h-full px-20 py-5' : ''} ${viewClass ?? ''}`.trim()

function callback() {
  innerVisible.value = false
}

function handleConfirm() {
  emit('confirm', callback)
}

function handleCancel() {
  props.autoClose && callback()
  emit('cancel', callback)
}

function handleClosed() {
  visible.value = false
  handleCancel()
}
</script>

<template>
  <el-drawer
    v-model="innerVisible" destroy-on-close :size="width < 1500 ? '40%' : '30%'" class="min-w-500"
    :class="[!showFooter && 'pb-20']" :header-class="mergedHeaderClass" :body-class="mergedBodyClass"
    :footer-class="mergedFooterClass" v-bind="mergedAttrs" @closed="handleClosed"
  >
    <template #header>
      <slot name="header" />
    </template>
    <template #default>
      <el-scrollbar
        v-if="!slots.body" :min-size="100" class="[&_.is-horizontal]:!h-0"
        :view-class="mergedViewClass"
      >
        <slot />
      </el-scrollbar>
      <slot v-else name="body" />
    </template>
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <el-button v-if="showCancel" @click="handleCancel">
          {{ cancelText }}
        </el-button>
        <el-button
          v-if="showConfirm" type="primary" :loading="confirmLoading" :disabled="confirmDisabled"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </el-button>
        <slot name="footer-extra" />
      </slot>
    </template>
  </el-drawer>
</template>
