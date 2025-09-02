<script setup lang="ts">
defineOptions({
  name: 'DialogCandidateGroups',
})

const emit = defineEmits<{
  confirm: [value: string]
}>()
const visible = defineModel<boolean>('modelValue', { default: false })

function handleConfirm(cb: () => void) {
  emit('confirm', '222')
  cb()
}
</script>

<template>
  <ep-dialog v-model="visible" title="角色选择" class="h-full" @confirm="handleConfirm">
    <div>角色选择内容</div>
  </ep-dialog>
</template>
