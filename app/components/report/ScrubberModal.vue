<script setup lang="ts">
const { pair, visible } = storeToRefs(useScrubberStore())
const { scrubberClose } = useScrubberStore()

interface ReportScrubberModalProps {
  branchName: string
}

defineProps<ReportScrubberModalProps>()

const { ui } = useAppConfig()

const open = computed({
  get: () => visible.value,
  set: (value: boolean) => {
    if (!value) {
      scrubberClose()
    }
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :ui="{ content: 'bg-muted', header: 'border-b border-accented justify-between', body: 'p-0 sm:p-0' }"
  >
    <template #header>
      <div class="text-2xl text-pretty font-bold text-toned shrink-0">{{ branchName }}</div>
      <span class="text-pretty font-bold text-toned text-center">
        {{ pair?.label?.split(/(?=[A-Z])/).join(' ') }} {{ pair?.viewportLabel }}
      </span>
      <div class="flex items-center gap-3">
        <UColorModeSwitch />
        <UButton :icon="ui.icons.close" color="neutral" variant="ghost" @click="scrubberClose" />
      </div>
    </template>

    <template #body>
      <ReportImageScrubber />
    </template>
  </UModal>
</template>
