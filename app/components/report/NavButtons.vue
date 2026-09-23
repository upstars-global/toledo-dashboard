<script setup lang="ts">
interface ReportNavButtonsProps {
  currentId: number
  lastId: number
}

const props = defineProps<ReportNavButtonsProps>()

const { ui } = useAppConfig()
const hasPrev = computed(() => props.currentId > 0)
const hasNext = computed(() => props.currentId < props.lastId)

function jumpTo(index: number) {
  document.getElementById(`test-${index}`)?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <div class="flex gap-1.5">
    <UButton
      :icon="ui.icons.chevronUp"
      color="neutral"
      variant="subtle"
      :disabled="!hasPrev"
      @click="jumpTo(currentId - 1)"
    />
    <UButton
      :icon="ui.icons.chevronDown"
      color="neutral"
      variant="subtle"
      :disabled="!hasNext"
      @click="jumpTo(currentId + 1)"
    />
  </div>
</template>
