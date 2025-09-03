<script setup lang="ts">
defineOptions({
  name: 'DialogAssignee',
})

const emit = defineEmits<{
  confirm: [value: string]
}>()
const visible = defineModel<boolean>('modelValue', { default: false })

function handleConfirm(cb: () => void) {
  emit('confirm', '111')
  cb()
}
</script>

<template>
  <ep-dialog v-model="visible" title="用户选择" class="h-full" @confirm="handleConfirm">
    <div>用户选择内容</div>
  </ep-dialog>
</template>
