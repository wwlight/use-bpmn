<script setup lang="ts">
defineOptions({
  name: 'PageWrapper',
})

withDefaults(
  defineProps<{
    vertical?: boolean
  }>(),
  {
    vertical: true,
  },
)
</script>

<template>
  <div
    class="relative size-full of-hidden rd-8 bg-[--g-main-bg] p-10"
    :class="[vertical && 'flex flex-col']"
  >
    <slot />
  </div>
</template>
