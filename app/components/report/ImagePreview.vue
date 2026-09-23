<script setup lang="ts">
interface ReportImagePreviewProps {
  src?: string
  label: string
}
defineProps<ReportImagePreviewProps>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <div class="grow basis-0 text-center flex flex-col" @click="emit('select')">
    <span class="block pb-4 text-center text-xs uppercase text-muted">
      {{ label }}
    </span>
    <img
      :src="src"
      :alt="label"
      loading="lazy"
      decoding="async"
      class="m-auto w-auto max-w-full object-scale-down max-h-120"
    />
  </div>
</template>
