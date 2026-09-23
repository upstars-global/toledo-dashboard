<script setup lang="ts">
interface ReportDetailRowProps {
  label: string
}
defineProps<ReportDetailRowProps>()
</script>

<template>
  <div class="truncate">
    <span class="pe-2 text-sm text-muted">{{ label }}</span>
    <span class="text-sm font-bold text-highlighted">
      <slot />
    </span>
  </div>
</template>
