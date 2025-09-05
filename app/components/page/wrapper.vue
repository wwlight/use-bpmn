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
    class="p-10 rd-8 bg-[--g-main-bg] size-full relative of-hidden"
    :class="[vertical && 'flex flex-col']"
  >
    <slot />
  </div>
</template>
